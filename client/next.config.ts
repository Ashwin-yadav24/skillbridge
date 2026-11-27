import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Disable Partial Prerendering to prevent Recharts Math.random() prerender errors
    ppr: false,
  },
  turbopack: {
    // Set root to the client directory to suppress the multiple lockfiles warning
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
