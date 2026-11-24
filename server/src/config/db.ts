import mongoose from "mongoose";

/**
 * Connect to MongoDB Atlas.
 *
 * If MONGODB_URI is not set the server starts in
 * "database-disconnected" mode — every other feature
 * still works but database-dependent routes will
 * return 503 Service Unavailable.
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      "⚠️  MONGODB_URI is not set. Running in database-disconnected mode.\n" +
        "   Set MONGODB_URI in your .env file to connect to MongoDB Atlas."
    );
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    // Don't crash the server — allow graceful degradation
    console.warn("⚠️  Server will continue without database connectivity.");
  }
}

/**
 * Returns true when Mongoose has an active connection.
 */
export function isDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

