import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";

import { env } from "./config/env";
import healthRouter from "./routes/health";
import usersRouter from "./routes/users";
import resumesRouter from "./routes/resumes";
import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandler";

const app = express();

// --------------- Security middleware ---------------
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// --------------- Clerk session verification ---------------
// Attaches auth context to every request; individual routes
// enforce authentication via the requireAuth guard.
app.use(clerkMiddleware());

// --------------- Rate limiting ---------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 1000 : 100, // relaxed in dev
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "development", // skip entirely in dev
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use(limiter);

// --------------- Body parsing ---------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// --------------- Routes ---------------
app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter);
app.use("/api/resumes", resumesRouter);

// --------------- Error handling ---------------
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
