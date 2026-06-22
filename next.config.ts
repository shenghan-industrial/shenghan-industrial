import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude Node.js native packages from Edge Runtime bundling
  serverExternalPackages: [
    "sharp",
    "detect-libc",
  ],
};

export default nextConfig;
