export const runtime = "edge";
import { NextResponse } from "next/server";
import { signJWT, verifyPassword, findAdminByUsername, getCookieName, getTokenMaxAge } from "@/lib/auth";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
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

  const token = await signJWT({
    username: admin.username,
    role: admin.role,
  });

  const cookieName = getCookieName();
  const maxAge = getTokenMaxAge();
  const cookieValue = `${cookieName}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;

  return NextResponse.json(
    { success: true, user: { username: admin.username, role: admin.role } },
    {
      headers: {
        "Set-Cookie": cookieValue,
      },
    }
  );
}
