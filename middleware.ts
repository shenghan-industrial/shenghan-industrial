import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Inline JWT verify (Web Crypto, Edge-compatible) ──

const COOKIE_NAME = "admin_token";

function base64UrlDecode(str: string): Uint8Array<ArrayBuffer> {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length) as Uint8Array<ArrayBuffer>;
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function getSecret(): Uint8Array<ArrayBuffer> {
  const secret = process.env.JWT_SECRET || "shenghan-dev-jwt-secret";
  return new TextEncoder().encode(secret) as Uint8Array<ArrayBuffer>;
}

async function verifyJWT(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlDecode(signatureB64);
    const key = await crypto.subtle.importKey("raw", getSecret(), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify("HMAC", key, signature, data);
    if (!valid) return null;
    return JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));
  } catch { return null; }
}

// ── Path config ──────────────────────────────────────────────

const PUBLIC_AUTH_PATHS = ["/admin-login", "/api/admin/auth"];
const PUBLIC_READ_PATHS = ["/api/admin/products", "/api/admin/categories"];
const PROTECTED_PREFIXES = ["/admin", "/api/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_AUTH_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (PUBLIC_READ_PATHS.some((p) => pathname.startsWith(p)) && request.method === "GET") return NextResponse.next();

  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const response = NextResponse.redirect(new URL("/admin-login", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("x-admin-username", payload.username as string);
  response.headers.set("x-admin-role", payload.role as string);
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
