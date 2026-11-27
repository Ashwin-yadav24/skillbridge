/**
 * SkillBridge AI — Resume Parsing Service
 *
 * Extracts plain text from PDF and DOCX buffers.
 *
 * SECURITY:
 *  - Does NOT execute macros or embedded scripts
 *  - Does NOT follow embedded links
 *  - Rejects encrypted / unreadable documents
 *  - Enforces a maximum text length to prevent resource exhaustion
 *  - Does NOT store raw extracted text beyond the processing function
 */

/* eslint-disable @typescript-eslint/no-require-imports */
// pdf-parse v1.1.1 — exports a direct function (CJS compatible)
const pdfParse = require("pdf-parse") as (
  buffer: Buffer,
  options?: { max?: number }
) => Promise<{ text: string; numpages: number }>;

import mammoth from "mammoth";

/** Maximum characters we will process from any resume. */
const MAX_TEXT_LENGTH = 20_000;

export interface ParseResult {
  text: string;
  pageCount?: number;
}

/**
 * Validate PDF magic bytes (%PDF-).
 */
function isPdfBuffer(buf: Buffer): boolean {
  return (
    buf.length >= 5 &&
    buf[0] === 0x25 && // %
    buf[1] === 0x50 && // P
    buf[2] === 0x44 && // D
    buf[3] === 0x46 && // F
    buf[4] === 0x2d    // -
  );
}

/**
 * Validate DOCX magic bytes (PK ZIP signature).
 * .docx files are ZIP archives beginning with PK\x03\x04.
 */
function isDocxBuffer(buf: Buffer): boolean {
  return (
    buf.length >= 4 &&
    buf[0] === 0x50 && // P
    buf[1] === 0x4b && // K
    buf[2] === 0x03 &&
    buf[3] === 0x04
  );
}

/**
 * Normalize whitespace and control characters from extracted text.
 */
function normalizeText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")          // Windows line endings
    .replace(/\r/g, "\n")            // Old Mac line endings
    .replace(/[ \t]+/g, " ")         // Collapse horizontal whitespace
    .replace(/\n{3,}/g, "\n\n")      // Collapse excessive blank lines
    .trim()
    .slice(0, MAX_TEXT_LENGTH);
}

/**
 * Extract text from a PDF buffer.
 */
export async function parsePdf(buffer: Buffer): Promise<ParseResult> {
  if (!isPdfBuffer(buffer)) {
    throw new Error(
      "File signature does not match PDF. The file may be corrupted or is not a valid PDF."
    );
  }

  let data: { text: string; numpages: number };
  try {
    data = await pdfParse(buffer, {
      // Disable rendering — text extraction only
      max: 0,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("encrypt")) {
      throw new Error(
        "This PDF is password-protected or encrypted. Please upload an unlocked PDF."
      );
    }
    throw new Error(`PDF parsing failed: ${msg}`);
  }

  const text = normalizeText(data.text);
  if (!text || text.length < 50) {
    throw new Error(
      "The PDF appears to be empty, image-only, or contains no readable text. " +
        "Please upload a text-based PDF."
    );
  }

  return { text, pageCount: data.numpages };
}

/**
 * Extract text from a DOCX buffer using Mammoth.
 * Mammoth does NOT execute macros.
 */
export async function parseDocx(buffer: Buffer): Promise<ParseResult> {
  if (!isDocxBuffer(buffer)) {
    throw new Error(
      "File signature does not match DOCX (ZIP). The file may be corrupted or is not a valid DOCX."
    );
  }

  let result: { value: string; messages: Array<{ message: string }> };
  try {
    result = await mammoth.extractRawText({ buffer });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`DOCX parsing failed: ${msg}`);
  }

  const text = normalizeText(result.value);
  if (!text || text.length < 50) {
    throw new Error(
      "The DOCX appears to be empty or contains no readable text."
    );
  }

  return { text };
}

/**
 * Dispatch to the correct parser based on file type.
 */
export async function parseResume(
  buffer: Buffer,
  fileType: "pdf" | "docx"
): Promise<ParseResult> {
  if (fileType === "pdf") return parsePdf(buffer);
  return parseDocx(buffer);
}
