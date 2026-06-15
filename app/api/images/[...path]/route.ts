import { NextResponse } from "next/server";
import { getR2 } from "@/lib/kv-storage";

export const runtime = "edge";

export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const r2Key = segments.join("/");

  const r2 = getR2();
  if (!r2) {
    return NextResponse.json({ error: "R2 not available" }, { status: 503 });
  }

  const object = await r2.get(r2Key);
  if (!object || !object.body) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const ext = r2Key.split(".").pop()?.toLowerCase();
  const contentTypes: Record<string, string> = {
    webp: "image/webp",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    gif: "image/gif",
  };

  const headers = new Headers();
  headers.set("Content-Type", contentTypes[ext || ""] || "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  object.writeHttpMetadata(headers);

  return new Response(object.body, { headers });
}
