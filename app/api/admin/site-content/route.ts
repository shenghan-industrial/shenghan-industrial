import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "edge";

const SITE_JSON = path.join(process.cwd(), "data", "site-content.json");

export async function GET() {
  try {
    if (fs.existsSync(SITE_JSON)) {
      return NextResponse.json(JSON.parse(fs.readFileSync(SITE_JSON, "utf8")));
    }
    return NextResponse.json({ error: "No content file" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Read failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(SITE_JSON, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
