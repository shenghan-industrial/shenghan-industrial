export const runtime = "edge";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const correctUser = process.env.ADMIN_USERNAME || "admin";
  const correctPass = process.env.ADMIN_PASSWORD || "admin123";

  if (username !== correctUser || password !== correctPass) {
    return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "shengyu-jwt-2024-secret-key!!");
  const token = await new SignJWT({ username, role: "SUPER_ADMIN" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret);

  return NextResponse.json(
    { success: true, user: { username, role: "SUPER_ADMIN" } },
    {
      headers: {
        "Set-Cookie": `admin_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`,
      },
    }
  );
}
