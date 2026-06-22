export const runtime = "edge";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signJWT, verifyPassword, findAdminByUsername, getCookieName, getTokenMaxAge } from "@/lib/auth";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Rate limit: max 5 attempts per minute per IP
  const key = `login:${getRateLimitKey(request)}`;
  const { allowed } = checkRateLimit(key, 5, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in 1 minute." },
      { status: 429 }
    );
  }

  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  const admin = findAdminByUsername(username);
  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Generate JWT
  const token = await signJWT({
    username: admin.username,
    role: admin.role,
  });

  // Set HttpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set(getCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: getTokenMaxAge(),
  });

  return NextResponse.json({
    success: true,
    user: {
      username: admin.username,
      role: admin.role,
    },
  });
}
