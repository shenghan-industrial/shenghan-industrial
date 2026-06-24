export const runtime = "edge";
import { NextResponse } from "next/server";
import { hasR2, getR2 } from "@/lib/kv-storage";
import {
  validateImage,
  computeHash,
  findExistingByHash,
  registerHash,
  uploadToR2,
  SIZES,
  MAX_FILE_SIZE,
} from "@/lib/image-service";
import { requirePermission } from "@/lib/auth";

// NOTE: No edge runtime here — uses Buffer and sharp (Node.js only)

export async function POST(request: Request) {
  // RBAC check (any authenticated admin can upload)
  try {
    requirePermission(request, "product:create");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.startsWith("UNAUTHORIZED")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // ── Validation ──────────────────────────────────────────
    const validation = validateImage(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    // ── Hash dedup ──────────────────────────────────────────
    const hash = await computeHash(bytes); // FIX: was missing await
    const existing = findExistingByHash(hash);
    if (existing) {
      const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
      const dedupFilename = `${existing.split("/").pop()}.${ext}`;
      const urlPrefix = hasR2() ? "/api/images" : "";
      const dedupUrl = `${urlPrefix}/${existing}.${ext}`;

      return NextResponse.json({
        url: dedupUrl,
        original: {
          url: dedupUrl,
          filename: dedupFilename,
          mime: file.type,
          size: bytes.length,
        },
        filename: dedupFilename,
        deduplicated: true,
        hash,
      });
    }

    // ── R2 path ─────────────────────────────────────────────
    if (hasR2()) {
      console.log("[upload] R2 path, buffer.length:", bytes.length);
      const r2 = getR2()!;
      const result = await uploadToR2(r2, "images/products", bytes, file.type);
      console.log("[upload] R2 original.url:", result.variants.original.url);
      try { registerHash(hash, `images/products/${result.variants.original.filename.replace(/\.[^.]+$/, "")}`); }
      catch (e) { console.error("[upload] registerHash failed (non-fatal):", e); }

      return NextResponse.json({
        url: result.variants.original.url,
        ...result.variants,
        avifVariants: result.avifVariants,
        hash,
        sizes: SIZES,
        maxFileSize: MAX_FILE_SIZE,
      });
    }

    return NextResponse.json(
      { error: "Image upload requires R2 (Cloudflare R2 binding not configured)" },
      { status: 503 }
    );
  } catch (e) {
    console.error("Upload failed:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
