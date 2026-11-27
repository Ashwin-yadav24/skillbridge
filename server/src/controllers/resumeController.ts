import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { Resume } from "../models/Resume";
import { saveFile, deleteFile } from "../services/storageService";
import { processResume } from "../services/resumeProcessor";
import { AppError } from "../middleware/errorHandler";
import { isDBConnected } from "../config/db";
import mongoose from "mongoose";

/** Guard — returns false and calls next(AppError) if DB is offline */
function dbRequired(next: NextFunction): boolean {
  if (!isDBConnected()) {
    next(new AppError("Database is not connected.", 503));
    return false;
  }
  return true;
}

// ── POST /api/resumes ─────────────────────────────────────────────────────

/**
 * Upload a new resume.
 *
 * Multer attaches req.file (validated in the route middleware).
 * File is stored privately; processing begins after record creation.
 */
export async function uploadResume(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!dbRequired(next)) return;

  try {
    const { userId } = getAuth(req);
    if (!userId) return next(new AppError("Authentication required.", 401));

    const file = req.file;
    if (!file) return next(new AppError("No file provided.", 400));

    // Determine file type from validated extension
    const ext = file.originalname.toLowerCase().endsWith(".pdf") ? "pdf" : "docx";

    // Store file privately
    const storageKey = await saveFile(file.buffer, ext);

    // Create MongoDB record
    const resume = await Resume.create({
      userId,
      originalFileName: file.originalname,
      fileType: ext,
      fileSize: file.size,
      storageKey,
      status: "uploaded",
    });

    res.status(201).json({
      success: true,
      data: resume,
      message: "Resume uploaded successfully. Processing will begin now.",
    });

    // Start processing asynchronously (fire-and-forget)
    // Status will be updated in DB; client polls GET /api/resumes/:id
    setImmediate(() => {
      processResume((resume._id as mongoose.Types.ObjectId).toString()).catch(
        (err: Error) => console.error("[uploadResume] processResume error:", err.message)
      );
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/resumes ──────────────────────────────────────────────────────

/** List all resumes for the authenticated user (newest first). */
export async function getResumes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!dbRequired(next)) return;

  try {
    const { userId } = getAuth(req);
    if (!userId) return next(new AppError("Authentication required.", 401));

    const resumes = await Resume.find({ userId })
      .sort({ createdAt: -1 })
      .select("-storageKey")   // Never expose storage key
      .lean();

    res.status(200).json({ success: true, data: resumes });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/resumes/:id ──────────────────────────────────────────────────

/** Get a single resume record (must be owned by the authenticated user). */
export async function getResumeById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!dbRequired(next)) return;

  try {
    const { userId } = getAuth(req);
    if (!userId) return next(new AppError("Authentication required.", 401));

    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid resume ID.", 400));
    }

    const resume = await Resume.findOne({ _id: id, userId }).select("-storageKey");
    if (!resume) return next(new AppError("Resume not found.", 404));

    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    next(err);
  }
}

// ── DELETE /api/resumes/:id ───────────────────────────────────────────────

/** Delete a resume record and its stored file. */
export async function deleteResume(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!dbRequired(next)) return;

  try {
    const { userId } = getAuth(req);
    if (!userId) return next(new AppError("Authentication required.", 401));

    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid resume ID.", 400));
    }

    // Fetch with storageKey (not in select exclusion here — needed for deletion)
    const resume = await Resume.findOne({ _id: id, userId });
    if (!resume) return next(new AppError("Resume not found.", 404));

    // Delete from private storage first
    await deleteFile(resume.storageKey);

    // Delete from MongoDB
    await Resume.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Resume deleted successfully." });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/resumes/:id/reprocess ───────────────────────────────────────

/** Re-trigger Gemini extraction for an existing resume. */
export async function reprocessResume(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!dbRequired(next)) return;

  try {
    const { userId } = getAuth(req);
    if (!userId) return next(new AppError("Authentication required.", 401));

    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid resume ID.", 400));
    }

    const resume = await Resume.findOne({ _id: id, userId });
    if (!resume) return next(new AppError("Resume not found.", 404));

    if (resume.status === "processing") {
      return next(new AppError("This resume is already being processed.", 409));
    }

    // Reset status
    await Resume.findByIdAndUpdate(id, {
      status: "uploaded",
      extractedData: null,
      processingError: null,
    });

    res.status(202).json({
      success: true,
      message: "Reprocessing started.",
    });

    // Fire-and-forget
    setImmediate(() => {
      processResume(id).catch((err: Error) =>
        console.error("[reprocessResume] error:", err.message)
      );
    });
  } catch (err) {
    next(err);
  }
}
