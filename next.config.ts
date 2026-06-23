import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude Node.js native packages from Edge Runtime bundling
  serverExternalPackages: [
    "sharp",
    "detect-libc",
    "bcryptjs",
  ],
  // Allow images from Cloudflare R2 / CDN
  images: {
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
