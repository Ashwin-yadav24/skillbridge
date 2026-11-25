import { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { z } from "zod";
import { User } from "../models/User";
import { syncUser } from "../services/userSync";
import { AppError } from "../middleware/errorHandler";
import { isDBConnected } from "../config/db";

// ── Zod schema for PATCH /api/users/me ───────────────────────────────────

const updateMeSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  education: z
    .object({
      qualification: z.string().trim().max(200).optional(),
      institution: z.string().trim().max(200).optional(),
      graduationYear: z.number().int().min(1950).max(2100).optional(),
    })
    .optional(),
});

// ── Helpers ───────────────────────────────────────────────────────────────

function dbRequired(next: NextFunction): boolean {
  if (!isDBConnected()) {
    next(new AppError("Database is not connected. Please check server configuration.", 503));
    return false;
  }
  return true;
}

// ── Controllers ───────────────────────────────────────────────────────────

/**
 * GET /api/users/me
 *
 * Returns the authenticated user's profile from MongoDB.
 * Creates a new record on first sign-in (via syncUser).
 */
export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!dbRequired(next)) return;

  try {
    const auth = getAuth(req);
    const clerkId = auth.userId!;

    // Fetch Clerk profile for name / email / image
    const clerkUser = await clerkClient.users.getUser(clerkId);
    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
      clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0] ||
      "User";
    const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
    const profileImage = clerkUser.imageUrl ?? undefined;

    // Idempotent sync — creates or updates the MongoDB record
    const { user } = await syncUser({ clerkId, name, email, profileImage });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/users/me
 *
 * Updates permitted profile fields.
 * Fields that are NEVER permitted: clerkId, role, email, _id.
 */
export async function updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!dbRequired(next)) return;

  try {
    const auth = getAuth(req);
    const clerkId = auth.userId!;

    // Validate request body
    const parsed = updateMeSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e: import("zod").ZodIssue) => e.message).join("; ");
      return next(new AppError(`Validation error: ${message}`, 400));
    }

    const { name, education } = parsed.data;

    // Build update — never allow role, clerkId, email to be updated here
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (education !== undefined) {
      if (education.qualification !== undefined) update["education.qualification"] = education.qualification;
      if (education.institution !== undefined) update["education.institution"] = education.institution;
      if (education.graduationYear !== undefined) update["education.graduationYear"] = education.graduationYear;
    }

    if (Object.keys(update).length === 0) {
      return next(new AppError("No updatable fields provided.", 400));
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

