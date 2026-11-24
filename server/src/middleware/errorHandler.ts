import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

/**
 * Custom application error with an HTTP status code.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * 404 handler — catches requests that match no route.
 */
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

/**
 * Centralised error-handling middleware.
 *
 * Express identifies error handlers by their 4-parameter signature,
 * so the unused `_next` parameter is intentional.
 */
export function globalErrorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message =
    err instanceof AppError && err.isOperational
      ? err.message
      : "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });

  // Log unexpected (non-operational) errors
  if (!(err instanceof AppError) || !err.isOperational) {
    console.error("❌ Unexpected error:", err);
  }
}

