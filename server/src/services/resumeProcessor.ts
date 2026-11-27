/**
 * SkillBridge AI — Resume Processing Workflow
 *
 * Orchestrates: parse → extract → persist
 *
 * Runs synchronously within the request lifecycle for the initial
 * version. The status is updated in MongoDB throughout so clients
 * can poll GET /api/resumes/:id to observe progress.
 *
 * To add a background queue later, extract `processResume()` into
 * a worker and enqueue calls here.
 */

import { Resume } from "../models/Resume";
import { readFile } from "./storageService";
import { parseResume } from "./parseService";
import { extractResumeData } from "./geminiService";
import mongoose from "mongoose";

/**
 * Run the full parse → Gemini → save pipeline for a resume record.
 *
 * Safe to call from a route handler. Status transitions:
 *   uploaded → processing → completed | failed
 */
export async function processResume(resumeId: string): Promise<void> {
  // Validate ID before hitting the DB
  if (!mongoose.Types.ObjectId.isValid(resumeId)) return;

  // Mark as processing
  await Resume.findByIdAndUpdate(resumeId, {
    status: "processing",
    processingError: null,
  });

  try {
    const resume = await Resume.findById(resumeId);
    if (!resume) throw new Error(`Resume ${resumeId} not found`);

    // 1. Read from private storage
    const buffer = await readFile(resume.storageKey);

    // 2. Parse document → plain text
    const { text } = await parseResume(buffer, resume.fileType);

    // 3. Send to Gemini for structured extraction
    const extractedData = await extractResumeData(text);

    // 4. Persist results
    await Resume.findByIdAndUpdate(resumeId, {
      status: "completed",
      extractedData,
      processingError: null,
    });

    console.log(`[ResumeProcessor] ✅ Resume ${resumeId} processed successfully`);
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "An unexpected processing error occurred.";

    // Truncate error message before saving — do NOT log resume content
    const safeMsg = msg.slice(0, 500);

    await Resume.findByIdAndUpdate(resumeId, {
      status: "failed",
      processingError: safeMsg,
    });

    console.error(`[ResumeProcessor] ❌ Resume ${resumeId} failed: ${safeMsg}`);
  }
}
