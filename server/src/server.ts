import { env } from "./config/env";
import { connectDB } from "./config/db";
import app from "./app";

async function startServer(): Promise<void> {
  // Attempt database connection (gracefully degrades if URI is missing)
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`\n🚀 SkillBridge AI server running on port ${env.PORT}`);
    console.log(`   Environment : ${env.NODE_ENV}`);
    console.log(`   Client URL  : ${env.CLIENT_URL}`);
    console.log(`   Health check: http://localhost:${env.PORT}/api/health\n`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

