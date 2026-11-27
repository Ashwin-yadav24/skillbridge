/**
 * SkillBridge AI — Import Service
 *
 * Supports CSV, JSON and Excel imports of occupation + skill data.
 *
 * Rules:
 * - Demo records are always verificationStatus: "demo"
 * - Official/imported records start as "imported" (require manual verification)
 * - Duplicate detection: slug for occupations, normalizedName for skills
 * - dryRun: true → previews changes without writing to DB
 * - Saves ImportHistory on committed (non-dry-run) runs
 */

import { getAuth } from "@clerk/express";
import type { Request } from "express";
import { z } from "zod/v4";
import { parse as csvParse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import { Sector } from "../models/Sector";
import { Skill } from "../models/Skill";
import { Occupation } from "../models/Occupation";
import { OccupationSkill } from "../models/OccupationSkill";
import { ImportHistory } from "../models/ImportHistory";
import type { ImportFileType } from "../models/ImportHistory";

// ─── Zod schema for each importable occupation row ─────────────────────────

const importRowSchema = z.object({
  title: z.string().min(2).max(200),
  sector: z.string().min(1).max(120),
  subSector: z.string().max(120).optional(),
  description: z.string().max(2000).optional(),
  nsqfLevel: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === "" || v === null) return undefined;
      const n = Number(v);
      return isNaN(n) ? undefined : n;
    }),
  qualificationCode: z.string().max(80).optional(),
  qpCode: z.string().max(80).optional(),
  qualificationTitle: z.string().max(300).optional(),
  minimumEducation: z.string().max(200).optional(),
  qualificationCriteria: z.string().max(2000).optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  sourceName: z.string().max(200).optional(),
  sourceIdentifier: z.string().max(200).optional(),
  // Skills — comma-separated names (simple import format)
  skills: z.string().optional(),
  verificationStatus: z
    .enum(["demo", "imported", "verified", "pending"])
    .optional()
    .default("imported"),
});

type ImportRow = z.output<typeof importRowSchema>;

// ─── Preview record ─────────────────────────────────────────────────────────

export interface ImportPreviewRecord {
  row: number;
  action: "insert" | "update" | "skip" | "error";
  title: string;
  reason?: string;
}

export interface ImportResult {
  total: number;
  inserted: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: { row: number; field?: string; message: string }[];
  preview: ImportPreviewRecord[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeSkillName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

function detectFileType(mimetype: string, originalname: string): ImportFileType {
  if (mimetype === "application/json" || originalname.endsWith(".json")) return "json";
  if (
    mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimetype === "application/vnd.ms-excel" ||
    originalname.endsWith(".xlsx") ||
    originalname.endsWith(".xls")
  )
    return "excel";
  return "csv";
}

function parseBuffer(buffer: Buffer, fileType: ImportFileType): Record<string, unknown>[] {
  if (fileType === "json") {
    const parsed = JSON.parse(buffer.toString("utf-8"));
    return Array.isArray(parsed) ? parsed : [parsed];
  }
  if (fileType === "excel") {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
  }
  // CSV
  return csvParse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, unknown>[];
}

// ─── Main import function ───────────────────────────────────────────────────

export async function importOccupations(
  file: Express.Multer.File,
  dryRun: boolean,
  req?: Request
): Promise<ImportResult> {
  const fileType = detectFileType(file.mimetype, file.originalname);
  const rawRows = parseBuffer(file.buffer, fileType);

  const result: ImportResult = {
    total: rawRows.length,
    inserted: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
    preview: [],
  };

  for (let i = 0; i < rawRows.length; i++) {
    const rowNum = i + 1;
    const raw = rawRows[i];

    // Validate row
    const parsed = importRowSchema.safeParse(raw);
    if (!parsed.success) {
      result.failed++;
      const firstIssue = parsed.error.issues[0];
      result.errors.push({
        row: rowNum,
        field: firstIssue?.path?.join("."),
        message: firstIssue?.message ?? "Validation failed",
      });
      result.preview.push({
        row: rowNum,
        action: "error",
        title: (raw.title as string) ?? `Row ${rowNum}`,
        reason: firstIssue?.message ?? "Validation failed",
      });
      continue;
    }

    const data: ImportRow = parsed.data;
    const slug = slugify(data.title);

    // Find or create sector
    const sectorSlug = slugify(data.sector);
    const existingOcc = await Occupation.findOne({ slug }).select("_id").lean();

    if (dryRun) {
      result.preview.push({
        row: rowNum,
        action: existingOcc ? "update" : "insert",
        title: data.title,
        reason: existingOcc ? `Would update existing (slug: ${slug})` : "Would insert new record",
      });
      if (existingOcc) {
        result.updated++;
      } else {
        result.inserted++;
      }
      continue;
    }

    // Committed run — write to DB
    try {
      let sectorDoc = await Sector.findOne({ slug: sectorSlug });
      if (!sectorDoc) {
        sectorDoc = await Sector.create({
          name: data.sector,
          slug: sectorSlug,
          isActive: true,
        });
      }

      const occupationPayload = {
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
          name: data.sourceName ?? "Imported",
          url: data.sourceUrl ?? undefined,
          identifier: data.sourceIdentifier ?? undefined,
          importedAt: new Date(),
        },
      };

      await Occupation.findOneAndUpdate({ slug }, { $set: occupationPayload }, { upsert: true, new: true });

      // Handle skills from comma-separated list
      if (data.skills) {
        const occDoc = await Occupation.findOne({ slug }).select("_id").lean();
        if (occDoc) {
          const skillNames = data.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

          for (const skillName of skillNames) {
            const normalized = normalizeSkillName(skillName);
            const skillDoc = await Skill.findOneAndUpdate(
              { normalizedName: normalized },
              {
                $setOnInsert: {
                  name: skillName,
                  normalizedName: normalized,
                  category: "General",
                  verificationStatus: data.verificationStatus,
                  sourceInformation: {
                    name: data.sourceName ?? "Imported",
                    importedAt: new Date(),
                  },
                },
              },
              { upsert: true, new: true }
            );

            await OccupationSkill.findOneAndUpdate(
              { occupationId: occDoc._id, skillId: skillDoc._id },
              {
                $setOnInsert: {
                  occupationId: occDoc._id,
                  skillId: skillDoc._id,
                  mandatory: false,
                  importanceWeight: 0.5,
                  proficiencyExpectation: "intermediate",
                  sourceReference: data.sourceName ?? "Imported",
                },
              },
              { upsert: true }
            );
          }
        }
      }

      if (existingOcc) {
        result.updated++;
      } else {
        result.inserted++;
      }

      result.preview.push({
        row: rowNum,
        action: existingOcc ? "update" : "insert",
        title: data.title,
      });
    } catch (err) {
      result.failed++;
      result.errors.push({
        row: rowNum,
        message: err instanceof Error ? err.message : "Unknown error",
      });
      result.preview.push({
        row: rowNum,
        action: "error",
        title: data.title,
        reason: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  // Save import history (committed runs only)
  if (!dryRun && req) {
    const auth = getAuth(req);
    await ImportHistory.create({
      sourceName: file.originalname,
      importedBy: auth.userId ?? "unknown",
      fileType,
      totalRecords: result.total,
      inserted: result.inserted,
      updated: result.updated,
      skipped: result.skipped,
      failed: result.failed,
      errors: result.errors,
      status: "committed",
      previewOnly: false,
    });
  }

  return result;
}
