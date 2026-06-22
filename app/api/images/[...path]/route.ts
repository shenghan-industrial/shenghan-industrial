import { NextResponse } from "next/server";
import { getR2 } from "@/lib/kv-storage";

export const runtime = "edge";

const CONTENT_TYPES: Record<string, string> = {
  webp: "image/webp",
  avif: "image/avif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  gif: "image/gif",
};

export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const r2Key = segments.join("/");

  const r2 = getR2();
  if (!r2) {
    return NextResponse.json({ error: "R2 not available" }, { status: 503 });
  }

  try {
    const object = await r2.get(r2Key);
    if (!object || !object.body) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const ext = r2Key.split(".").pop()?.toLowerCase() || "";
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    object.writeHttpMetadata(headers);

    return new Response(object.body, { headers });
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
