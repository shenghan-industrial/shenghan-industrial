import { NextResponse } from "next/server";
import { kvGetJSON, kvPutJSON } from "@/lib/kv-storage";


export async function GET() {
  try {
    const data = await kvGetJSON("site-content");
    if (data) return NextResponse.json(data);
    return NextResponse.json({ error: "No content file" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Read failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await kvPutJSON("site-content", body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
