import { Request, Response, NextFunction } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { AppError } from "./errorHandler";

/**
 * Clerk session verification middleware.
 *
 * Usage: apply `verifyClerkSession` before any route that
 * requires the user to be authenticated.
 *
 * On success: attaches `req.auth.userId` (the Clerk user ID).
 * On failure: returns HTTP 401.
 */
export const clerkSessionMiddleware = clerkMiddleware();

/**
 * Guard that rejects requests without a valid Clerk session.
 * Must be applied AFTER `clerkSessionMiddleware`.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const auth = getAuth(req);

  if (!auth?.userId) {
    return next(new AppError("Authentication required. Please sign in.", 401));
  }

  next();
}

/**
 * Extends Express Request to expose the authenticated Clerk userId.
 * Use `getAuth(req).userId` from @clerk/express — this declaration
 * is for IDE convenience only; Clerk attaches `auth` at runtime.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: { userId: string | null };
    }
  }
}

