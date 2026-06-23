import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal middleware — Cloudflare-compatible (no Node.js deps)
// Admin auth is handled per-route by API check functions

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
