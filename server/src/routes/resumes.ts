/**
 * SkillBridge AI — Resume Routes
 *
 * All routes require authentication via requireAuth.
 * File uploads are handled by multer (memory storage, never disk
 * in the route layer — saves to private-uploads/ via storageService).
 *
 * Rate limiting: 10 uploads per 15 minutes per user (IP-level here).
 */

import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/clerkAuth";
import {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
  reprocessResume,
} from "../controllers/resumeController";

const router = Router();

// ── Multer — memory storage, validated here before hitting the controller ─

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB hard limit
    files: 1,
  },
  fileFilter(_req, file, cb) {
    const allowedMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExts = /\.(pdf|docx)$/i;

    const mimeOk = allowedMimes.includes(file.mimetype);
    const extOk = allowedExts.test(file.originalname);

    if (mimeOk && extOk) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF (.pdf) and Word (.docx) files are accepted."
        )
      );
    }
  },
});

// ── Rate limiter for uploads (stricter than global) ───────────────────────

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 1000 : 10,
  skip: () => process.env.NODE_ENV === "development",
  message: { success: false, message: "Too many uploads. Please wait before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

const reprocessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 1000 : 5,
  skip: () => process.env.NODE_ENV === "development",
  message: { success: false, message: "Too many reprocess requests. Please wait." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Routes ────────────────────────────────────────────────────────────────

router.post(
  "/",
  requireAuth,
  uploadLimiter,
  upload.single("resume"),
  uploadResume
);

router.get("/", requireAuth, getResumes);

router.get("/:id", requireAuth, getResumeById);

router.delete("/:id", requireAuth, deleteResume);

router.post("/:id/reprocess", requireAuth, reprocessLimiter, reprocessResume);

export default router;
