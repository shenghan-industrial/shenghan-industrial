import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude Node.js native packages from Edge Runtime bundling
  serverExternalPackages: [
    "sharp",
    "detect-libc",
    "bcryptjs",
  ],
  // Skip image optimization at build time to avoid OOM
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
    ],
  },
};

export default nextConfig;
