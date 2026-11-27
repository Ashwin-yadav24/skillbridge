/**
 * SkillBridge AI — Occupation Controller (Public Read)
 */

import { Request, Response, NextFunction } from "express";
import { z } from "zod/v4";
import { Occupation } from "../models/Occupation";
import { OccupationSkill } from "../models/OccupationSkill";
import { Sector } from "../models/Sector";
import { AppError } from "../middleware/errorHandler";

// ─── Query validation ────────────────────────────────────────────────────────

const listQuerySchema = z.object({
  search: z.string().max(200).optional(),
  sector: z.string().max(120).optional(),
  nsqfLevel: z.string().optional(),
  qpCode: z.string().max(80).optional(),
  verificationStatus: z
    .enum(["demo", "imported", "verified", "pending"])
    .optional(),
  pmkvy: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  page: z
    .string()
    .optional()
    .transform((v) => Math.max(1, parseInt(v ?? "1", 10) || 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => Math.min(100, Math.max(1, parseInt(v ?? "20", 10) || 20))),
  sortBy: z
    .enum(["title", "sector", "nsqfLevel", "createdAt"])
    .optional()
    .default("title"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// ─── GET /api/occupations ────────────────────────────────────────────────────

export async function getOccupations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = listQuerySchema.safeParse(req.query);
    if (!query.success) {
      return next(new AppError("Invalid query parameters.", 400));
    }

    const {
      search,
      sector,
      nsqfLevel,
      qpCode,
      verificationStatus,
      pmkvy,
      page,
      limit,
      sortBy,
      sortOrder,
    } = query.data;

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (nsqfLevel) {
      const level = parseInt(nsqfLevel, 10);
      if (!isNaN(level)) {
        filter.nsqfLevel = level;
      }
    }

    if (qpCode) {
      filter.qpCode = { $regex: qpCode, $options: "i" };
    }

    if (verificationStatus) {
      filter.verificationStatus = verificationStatus;
    }

    if (pmkvy) {
      // Only return occupations where PMKVY association is verified
      filter["schemeAssociations"] = {
        $elemMatch: {
          schemeName: { $regex: "pmkvy", $options: "i" },
          verified: true,
        },
      };
    }

    // Sector filter — look up sector by name or slug
    if (sector) {
      const sectorDoc = await Sector.findOne({
        $or: [
          { slug: sector.toLowerCase() },
          { name: { $regex: `^${sector}$`, $options: "i" } },
        ],
      })
        .select("_id")
        .lean();

      if (sectorDoc) {
        filter.sector = sectorDoc._id;
      } else {
        // No matching sector → empty results
        res.json({
          success: true,
          data: [],
          pagination: { total: 0, page, limit, pages: 0 },
        });
        return;
      }
    }

    const sortDirection = sortOrder === "desc" ? -1 : 1;
    const sortField = sortBy === "sector" ? "sector" : sortBy;

    const total = await Occupation.countDocuments(filter);
    const occupations = await Occupation.find(filter)
      .populate("sector", "name slug")
      .sort({ [sortField]: sortDirection })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Enrich with competency count
    const ids = occupations.map((o) => o._id);
    const counts = await OccupationSkill.aggregate([
      { $match: { occupationId: { $in: ids } } },
      { $group: { _id: "$occupationId", count: { $sum: 1 } } },
    ]);

    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

    const enriched = occupations.map((o) => ({
      ...o,
      competencyCount: countMap.get(o._id.toString()) ?? 0,
    }));

    res.json({
      success: true,
      data: enriched,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/occupations/sectors ───────────────────────────────────────────

export async function getSectors(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const sectors = await Sector.find({ isActive: true })
      .select("name slug")
      .sort({ name: 1 })
      .lean();

    res.json({ success: true, data: sectors });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/occupations/:id ────────────────────────────────────────────────

export async function getOccupationById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;

    const occ = await Occupation.findOne({
      $or: [
        ...(idStr.match(/^[a-f\d]{24}$/i) ? [{ _id: idStr }] : []),
        { slug: idStr },
      ],
      isActive: true,
    })
      .populate("sector", "name slug")
      .lean();

    if (!occ) {
      return next(new AppError("Occupation not found.", 404));
    }

    res.json({ success: true, data: occ });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/occupations/:id/skills ────────────────────────────────────────

export async function getOccupationSkills(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;

    const occ = await Occupation.findOne({
      $or: [
        ...(idStr.match(/^[a-f\d]{24}$/i) ? [{ _id: idStr }] : []),
        { slug: idStr },
      ],
      isActive: true,
    })
      .select("_id")
      .lean();

    if (!occ) {
      return next(new AppError("Occupation not found.", 404));
    }

    const skills = await OccupationSkill.find({ occupationId: occ._id })
      .populate("skillId", "name category description normalizedName")
      .sort({ mandatory: -1, importanceWeight: -1 })
      .lean();

    res.json({ success: true, data: skills });
  } catch (err) {
    next(err);
  }
}
