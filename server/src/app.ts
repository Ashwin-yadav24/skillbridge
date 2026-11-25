import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";

import { env } from "./config/env";
import healthRouter from "./routes/health";
import usersRouter from "./routes/users";
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
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use(limiter);

// --------------- Body parsing ---------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// --------------- Routes ---------------
app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter);

// --------------- Error handling ---------------
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
