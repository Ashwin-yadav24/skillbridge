import dotenv from "dotenv";
import path from "path";

// Load .env from the server directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  PORT: parseInt(process.env.PORT || "5001", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
} as const;
