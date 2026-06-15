import { NextResponse } from "next/server";
import { hasR2, getR2 } from "@/lib/kv-storage";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const timestamp = Date.now();
    const filename = `${timestamp}-${originalName}`;

    if (!hasR2()) {
      return NextResponse.json({ error: "Image upload requires R2 (not available in local dev)" }, { status: 503 });
    }

    const r2 = getR2()!;
    await r2.put(`images/products/${filename}`, bytes, {
      httpMetadata: { contentType: file.type || "image/webp" },
    });
    return NextResponse.json({ url: `/api/images/products/${filename}`, filename });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
