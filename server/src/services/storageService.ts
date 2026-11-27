/**
 * SkillBridge AI — Private Storage Service
 *
 * Stores uploaded resumes in a private local directory (not publicly
 * accessible). The public uploads/ directory is NEVER used.
 *
 * Interface is designed so a private object-storage provider (e.g.
 * AWS S3 with pre-signed URLs, GCS with signed URLs) can be swapped
 * in by replacing only this module.
 *
 * SECURITY:
 *  - Files are stored under <project-root>/private-uploads/ (outside public/)
 *  - Access requires the authenticated Clerk userId to match the resume owner
 *  - Storage keys are UUIDs — never the original filename
 *  - Storage keys are NEVER returned to the client
 */

import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Private storage directory — outside the Next.js public/ folder
const STORAGE_ROOT = path.resolve(
  process.cwd(),
  "private-uploads"
);

/** Ensure the private storage directory exists. */
function ensureStorageDir(): void {
  if (!fs.existsSync(STORAGE_ROOT)) {
    fs.mkdirSync(STORAGE_ROOT, { recursive: true, mode: 0o700 });
  }
}

/** Generate a collision-free storage key for a given extension. */
export function generateStorageKey(ext: "pdf" | "docx"): string {
  return `${randomUUID()}.${ext}`;
}

/** Resolve the absolute filesystem path for a storage key. */
function storagePath(key: string): string {
  // Prevent path traversal — key must be a plain filename
  const basename = path.basename(key);
  if (basename !== key) {
    throw new Error("Invalid storage key");
  }
  return path.join(STORAGE_ROOT, basename);
}

/**
 * Save a file buffer to private storage.
 * @returns The opaque storage key.
 */
export async function saveFile(
  buffer: Buffer,
  ext: "pdf" | "docx"
): Promise<string> {
  ensureStorageDir();
  const key = generateStorageKey(ext);
  const dest = storagePath(key);
  await fs.promises.writeFile(dest, buffer, { mode: 0o600 });
  return key;
}

/**
 * Read a file from private storage.
 * Throws if the key does not exist.
 */
export async function readFile(key: string): Promise<Buffer> {
  const src = storagePath(key);
  return fs.promises.readFile(src);
}

/**
 * Delete a file from private storage.
 * Silently succeeds if the file does not exist.
 */
export async function deleteFile(key: string): Promise<void> {
  try {
    const src = storagePath(key);
    await fs.promises.unlink(src);
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException;
    if (e.code !== "ENOENT") throw err;
    // File already gone — not an error
  }
}

/**
 * Check whether a storage key exists.
 */
export async function fileExists(key: string): Promise<boolean> {
  try {
    const src = storagePath(key);
    await fs.promises.access(src, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
