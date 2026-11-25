import { Router } from "express";
import { requireAuth } from "../middleware/clerkAuth";
import { getMe, updateMe } from "../controllers/userController";

const router = Router();

/**
 * All /api/users routes require a valid Clerk session.
 * The clerkSessionMiddleware is already applied globally in app.ts.
 */

/**
 * GET /api/users/me
 * Returns the authenticated user's profile (creates on first call).
 */
router.get("/me", requireAuth, getMe);

/**
 * PATCH /api/users/me
 * Updates permitted profile fields (name, education).
 * Never allows updating role, clerkId, or email.
 */
router.patch("/me", requireAuth, updateMe);

export default router;

