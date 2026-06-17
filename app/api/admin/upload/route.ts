import { NextResponse } from "next/server";
import { hasR2, getR2 } from "@/lib/kv-storage";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const timestamp = Date.now();
    const filename = `${timestamp}-${originalName}`;

    // Cloudflare R2
    if (hasR2()) {
      const r2 = getR2()!;
      await r2.put(`images/products/${filename}`, bytes, {
        httpMetadata: { contentType: file.type || "image/webp" },
      });
      return NextResponse.json({ url: `/api/images/products/${filename}`, filename });
    }

    // Local / Vercel: write to public/images/products/
    const dir = path.join(process.cwd(), "public", "images", "products");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), new Uint8Array(bytes));
    return NextResponse.json({ url: `/images/products/${filename}`, filename });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
