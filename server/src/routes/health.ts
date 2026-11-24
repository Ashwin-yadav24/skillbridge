import { Router, Request, Response } from "express";
import { env } from "../config/env";
import { isDBConnected } from "../config/db";

const router = Router();

/**
 * GET /api/health
 *
 * Returns the current server status, environment and
 * database connectivity.
 */
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "SkillBridge AI API is running",
    environment: env.NODE_ENV,
    database: isDBConnected() ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

export default router;

