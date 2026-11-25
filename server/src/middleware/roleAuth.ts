import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { User } from "../models/User";

/**
 * Role-based authorization middleware.
 *
 * Must be applied AFTER requireAuth (clerkId is already verified).
 * Looks up the user's role in MongoDB and rejects non-admin requests.
 *
 * IMPORTANT: Never trust the role from the request body or JWT claims.
 * Always read it from the database.
 */
export function requireRole(role: "admin" | "student") {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const { getAuth } = await import("@clerk/express");
      const auth = getAuth(req);
      const clerkId = auth?.userId;

      if (!clerkId) {
        return next(new AppError("Authentication required.", 401));
      }

      const user = await User.findOne({ clerkId }).select("role").lean();

      if (!user) {
        return next(new AppError("User not found.", 404));
      }

      if (user.role !== role) {
        return next(
          new AppError(
            `Access denied. This action requires the '${role}' role.`,
            403
          )
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

