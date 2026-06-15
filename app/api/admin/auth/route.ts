import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
