export const runtime = "edge";
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  validateImage,
  computeHash,
  SIZES,
  MAX_FILE_SIZE,
} from "@/lib/image-service";
import { requirePermission } from "@/lib/auth";

export async function POST(request: Request) {
  // RBAC check
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
    const hash = await computeHash(bytes);

    // ── Upload to Cloudinary ─────────────────────────────────
    const result = await uploadToCloudinary(file);

    return NextResponse.json({
      url: result.url,
      original: result.original,
      thumbnail: result.thumbnail,
      medium: result.medium,
      large: result.large,
      hash,
      sizes: SIZES,
      maxFileSize: MAX_FILE_SIZE,
    });
  } catch (e) {
    console.error("Upload failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 500 }
    );
  }
}
