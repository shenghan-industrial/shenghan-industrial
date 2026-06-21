import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT, getCookieName } from "@/lib/auth";

// Paths that do NOT require authentication
const PUBLIC_AUTH_PATHS = ["/admin-login", "/api/admin/auth"];

// Public read-only API endpoints (used by frontend visitors)
const PUBLIC_READ_PATHS = ["/api/admin/products", "/api/admin/categories"];

// All /admin and /api/admin paths require authentication
const PROTECTED_PREFIXES = ["/admin", "/api/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public auth paths
  if (PUBLIC_AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow public read-only API for frontend visitors (GET only)
  if (PUBLIC_READ_PATHS.some((p) => pathname.startsWith(p)) && request.method === "GET") {
    return NextResponse.next();
  }

  // Check if this path needs protection
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!needsAuth) {
    return NextResponse.next();
  }

  // Verify JWT from cookie
  const cookieName = getCookieName();
  const token = request.cookies.get(cookieName)?.value;

  if (!token) {
    // API routes return 401, pages redirect to login
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL("/admin-login", request.url));
    response.cookies.delete(cookieName);
    return response;
  }

  // Attach user info to request headers for downstream API routes
  const response = NextResponse.next();
  response.headers.set("x-admin-username", payload.username);
  response.headers.set("x-admin-role", payload.role);
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
