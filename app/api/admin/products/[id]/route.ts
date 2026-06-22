import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/products-db";
import { requirePermission } from "@/lib/auth";
import { hasR2, getR2 } from "@/lib/kv-storage";
import { deleteFromR2, deleteLocalImages } from "@/lib/image-service";

export const runtime = "edge";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(request, "product:edit");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.startsWith("UNAUTHORIZED")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await updateProduct(id, body);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

/** Extract image keys/names from a product to clean up on delete */
async function deleteProductImages(product: { image: string; images?: string[]; gallery?: string[] }): Promise<void> {
  const urls = new Set<string>();
  urls.add(product.image);
  if (product.images) product.images.forEach((u) => urls.add(u));
  if (product.gallery) product.gallery.forEach((u) => urls.add(u));

  for (const url of urls) {
    if (!url) continue;
    try {
      // R2: extract key prefix from /api/images/products/{timestamp}-{name}
      if (url.startsWith("/api/images/")) {
        const key = url.replace("/api/images/", "");
        const prefix = key.replace(/-[^.]+\.\w+$/, ""); // strip -size.ext suffix
        if (hasR2()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await deleteFromR2(getR2()! as any, `images/products/${prefix}`);
        }
      }
      // Local: delete files matching prefix
      if (url.startsWith("/uploads/")) {
        const filename = url.replace("/uploads/products/", "");
        const prefix = filename.replace(/-[^.]+\.\w+$/, "");
        deleteLocalImages(`${process.cwd()}/public/uploads/products`, prefix);
      }
    } catch { /* best effort */ }
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    requirePermission(request, "product:delete");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.startsWith("UNAUTHORIZED")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Fetch product first to clean up images
  const product = await getProductById(id);
  if (product) {
    await deleteProductImages(product);
  }

  const ok = await deleteProduct(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
