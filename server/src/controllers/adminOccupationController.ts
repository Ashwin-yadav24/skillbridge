/**
 * SkillBridge AI — Admin Occupation Controller
 *
 * All routes here require requireAuth + requireRole("admin").
 * Never trust client-provided role.
 */

import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { z } from "zod/v4";
import multer from "multer";
import { Occupation } from "../models/Occupation";
import { Skill } from "../models/Skill";
import { Sector } from "../models/Sector";
import { OccupationSkill } from "../models/OccupationSkill";
import { ImportHistory } from "../models/ImportHistory";
import { importOccupations } from "../services/importService";
import { AppError } from "../middleware/errorHandler";

// ─── Multer — memory storage for import files ────────────────────────────────

export const importUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "text/csv",
      "application/json",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const allowedExts = [".csv", ".json", ".xlsx", ".xls"];
    const extOk = allowedExts.some((e) =>
      file.originalname.toLowerCase().endsWith(e)
    );
    if (allowed.includes(file.mimetype) || extOk) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV, JSON and Excel files are allowed."));
    }
  },
});

// ─── Zod schemas ─────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const createOccupationSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  sector: z.string().min(1), // name or existing id
  subSector: z.string().max(120).optional(),
  qualificationCode: z.string().max(80).optional(),
  qpCode: z.string().max(80).optional(),
  qualificationTitle: z.string().max(300).optional(),
  nsqfLevel: z.number().int().min(1).max(10).optional(),
  minimumEducation: z.string().max(200).optional(),
  qualificationCriteria: z.string().max(2000).optional(),
  verificationStatus: z
    .enum(["demo", "imported", "verified", "pending"])
    .optional()
    .default("pending"),
  sourceInformation: z
    .object({
      name: z.string().min(1).max(200),
      url: z.string().url().optional().or(z.literal("")),
      identifier: z.string().max(200).optional(),
    })
    .optional()
    .default({ name: "Admin Entry" }),
});

const updateOccupationSchema = createOccupationSchema.partial();

// ─── POST /api/admin/occupations ─────────────────────────────────────────────

export async function createOccupation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = createOccupationSchema.safeParse(req.body);
    if (!body.success) {
      const msg = body.error.issues.map((i) => i.message).join("; ");
      return next(new AppError(msg, 400));
    }

    const data = body.data;
    const slug = slugify(data.title);

    // Check duplicate slug
    const existing = await Occupation.findOne({ slug }).select("_id").lean();
    if (existing) {
      return next(
        new AppError(
          `An occupation with slug '${slug}' already exists.`,
          409
        )
      );
    }

    // Find or create sector
    const sectorSlug = slugify(data.sector);
    let sectorDoc = await Sector.findOne({
      $or: [{ slug: sectorSlug }, { name: { $regex: `^${data.sector}$`, $options: "i" } }],
    });
    if (!sectorDoc) {
      sectorDoc = await Sector.create({
        name: data.sector,
        slug: sectorSlug,
        isActive: true,
      });
    }

    const occupation = await Occupation.create({
      title: data.title,
      slug,
      description: data.description,
      sector: sectorDoc._id,
      subSector: data.subSector,
      qualificationCode: data.qualificationCode,
      qpCode: data.qpCode,
      qualificationTitle: data.qualificationTitle,
      nsqfLevel: data.nsqfLevel,
      minimumEducation: data.minimumEducation,
      qualificationCriteria: data.qualificationCriteria,
      verificationStatus: data.verificationStatus,
      isActive: true,
      sourceInformation: {
        name: data.sourceInformation?.name ?? "Admin Entry",
        url: data.sourceInformation?.url || undefined,
        identifier: data.sourceInformation?.identifier,
        importedAt: new Date(),
      },
    });

    res.status(201).json({ success: true, data: occupation });
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/admin/occupations/:id ────────────────────────────────────────

export async function updateOccupation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = updateOccupationSchema.safeParse(req.body);
    if (!body.success) {
      const msg = body.error.issues.map((i) => i.message).join("; ");
      return next(new AppError(msg, 400));
    }

    const { id } = req.params;
    const data = body.data;

    const occ = await Occupation.findById(id);
    if (!occ) {
      return next(new AppError("Occupation not found.", 404));
    }

    // Handle sector
    if (data.sector) {
      const sectorSlug = slugify(data.sector);
      let sectorDoc = await Sector.findOne({
        $or: [{ slug: sectorSlug }, { name: { $regex: `^${data.sector}$`, $options: "i" } }],
      });
      if (!sectorDoc) {
        sectorDoc = await Sector.create({ name: data.sector, slug: sectorSlug, isActive: true });
      }
      occ.sector = sectorDoc._id as typeof occ.sector;
    }

    if (data.title !== undefined) occ.title = data.title;
    if (data.description !== undefined) occ.description = data.description;
    if (data.subSector !== undefined) occ.subSector = data.subSector;
    if (data.qualificationCode !== undefined) occ.qualificationCode = data.qualificationCode;
    if (data.qpCode !== undefined) occ.qpCode = data.qpCode;
    if (data.qualificationTitle !== undefined) occ.qualificationTitle = data.qualificationTitle;
    if (data.nsqfLevel !== undefined) occ.nsqfLevel = data.nsqfLevel;
    if (data.minimumEducation !== undefined) occ.minimumEducation = data.minimumEducation;
    if (data.qualificationCriteria !== undefined) occ.qualificationCriteria = data.qualificationCriteria;
    if (data.verificationStatus !== undefined) occ.verificationStatus = data.verificationStatus;

    await occ.save();

    res.json({ success: true, data: occ });
  } catch (err) {
    next(err);
  }
}

// ─── DELETE /api/admin/occupations/:id (soft delete) ─────────────────────────

export async function deleteOccupation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const occ = await Occupation.findById(id);
    if (!occ) {
      return next(new AppError("Occupation not found.", 404));
    }

    occ.isActive = false;
    await occ.save();

    res.json({ success: true, message: "Occupation deactivated." });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/admin/occupations/import ──────────────────────────────────────

export async function handleImport(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      return next(new AppError("No file uploaded.", 400));
    }

    const dryRun = req.query.preview === "true" || req.query.dryRun === "true";
    const result = await importOccupations(req.file, dryRun, req);

    res.json({ success: true, dryRun, data: result });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/admin/import-history ───────────────────────────────────────────

export async function getImportHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string ?? "1", 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string ?? "20", 10) || 20);

    const total = await ImportHistory.countDocuments();
    const history = await ImportHistory.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: history,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/admin/occupations (all, including inactive) ────────────────────

export async function adminListOccupations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string ?? "1", 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string ?? "20", 10) || 20);
    const search = req.query.search as string | undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Occupation.countDocuments(filter);
    const occupations = await Occupation.find(filter)
      .populate("sector", "name slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: occupations,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

// ─── Skill management ─────────────────────────────────────────────────────────

export async function listSkills(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string ?? "1", 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string ?? "50", 10) || 50);
    const search = req.query.search as string | undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Skill.countDocuments(filter);
    const skills = await Skill.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: skills,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

// ─── Map skill to occupation ──────────────────────────────────────────────────

const mapSkillSchema = z.object({
  skillId: z.string().min(1),
  mandatory: z.boolean().optional().default(false),
  proficiencyExpectation: z
    .enum(["beginner", "intermediate", "advanced", "expert"])
    .optional()
    .default("intermediate"),
  importanceWeight: z.number().min(0).max(1).optional().default(0.5),
  competencyDescription: z.string().max(500).optional(),
});

export async function mapSkillToOccupation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = mapSkillSchema.safeParse(req.body);
    if (!body.success) {
      const msg = body.error.issues.map((i) => i.message).join("; ");
      return next(new AppError(msg, 400));
    }

    const { id: occupationId } = req.params;
    const data = body.data;
    const auth = getAuth(req);

    const occ = await Occupation.findById(occupationId).select("_id").lean();
    if (!occ) return next(new AppError("Occupation not found.", 404));

    const skill = await Skill.findById(data.skillId).select("_id").lean();
    if (!skill) return next(new AppError("Skill not found.", 404));

    const link = await OccupationSkill.findOneAndUpdate(
      { occupationId, skillId: data.skillId },
      {
        $set: {
          mandatory: data.mandatory,
          proficiencyExpectation: data.proficiencyExpectation,
          importanceWeight: data.importanceWeight,
          competencyDescription: data.competencyDescription,
          sourceReference: `Admin: ${auth.userId ?? "unknown"}`,
        },
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: link });
  } catch (err) {
    next(err);
  }
}
