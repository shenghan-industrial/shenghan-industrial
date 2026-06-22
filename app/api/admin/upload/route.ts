import { NextResponse } from "next/server";
import { hasR2, getR2 } from "@/lib/kv-storage";
import {
  validateImage,
  computeHash,
  findExistingByHash,
  registerHash,
  processImage,
  uploadToR2,
  SIZES,
  MAX_FILE_SIZE,
} from "@/lib/image-service";
import { requirePermission } from "@/lib/auth";

export const runtime = "edge";

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

    const bytes = Buffer.from(await file.arrayBuffer());

    // ── Hash dedup ──────────────────────────────────────────
    const hash = computeHash(bytes);
    const existing = findExistingByHash(hash);
    if (existing) {
      const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
      // `existing` is a prefix like "uploads/products/baseName" (local) or
      // "images/products/baseName" (R2). Construct the correct full URL.
      const dedupFilename = `${existing.split("/").pop()}.${ext}`;

      // Determine URL prefix based on whether R2 is in use
      const urlPrefix = hasR2() ? "/api/images" : "";
      const dedupUrl = `${urlPrefix}/${existing}.${ext}`;

      // Return consistent structure: always include `original` wrapper + top-level `url`
      return NextResponse.json({
        url: dedupUrl,                           // top-level fallback for legacy consumers
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

    // ── Sanitize filename ───────────────────────────────────
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const baseName = `${Date.now()}-${safeName.replace(/\.[^.]+$/, "")}`;

    // ── R2 path ─────────────────────────────────────────────
    if (hasR2()) {
      console.log("[upload] R2 path, buffer.length:", bytes.length);
      const r2 = getR2()!;
      const result = await uploadToR2(r2, "images/products", bytes, file.type);
      console.log("[upload] R2 original.url:", result.variants.original.url);
      try { registerHash(hash, `images/products/${result.variants.original.filename.replace(/\.[^.]+$/, "")}`); }
      catch (e) { console.error("[upload] registerHash failed (non-fatal):", e); }

      return NextResponse.json({
        url: result.variants.original.url,    // top-level for backward compat
        ...result.variants,
        avifVariants: result.avifVariants,
        hash,
        sizes: SIZES,
        maxFileSize: MAX_FILE_SIZE,
      });
    }

    // ── Local fallback (not available in Edge) ──────────────
    return NextResponse.json(
      { error: "Image upload requires R2 (not available without Cloudflare R2 binding)" },
      { status: 503 }
    );
  } catch (e) {
    console.error("Upload failed:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
