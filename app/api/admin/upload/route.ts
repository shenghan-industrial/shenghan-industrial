import { NextResponse } from "next/server";
import { hasR2, getR2 } from "@/lib/kv-storage";

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

    // Local dev: write to public/images/products/
    // eslint-disable-next-line
    const nr: any = (typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__ : null);
    if (nr) {
      const fs = nr("fs");
      const path = nr("path");
      const dir = path.join(process.cwd(), "public", "images", "products");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const uint8 = new Uint8Array(bytes);
      fs.writeFileSync(path.join(dir, filename), uint8);
      return NextResponse.json({ url: `/images/products/${filename}`, filename });
    }

    return NextResponse.json({ error: "Upload not available" }, { status: 503 });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
