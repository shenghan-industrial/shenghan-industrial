import { NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/products-db";
import { requirePermission } from "@/lib/auth";


import { cookies } from "next/headers";
import { verifyJWT, getCookieName } from "@/lib/auth";

// GET — public read, authenticated gets all, public gets published only
export async function GET() {
  try {
    const products = await getAllProducts();
    // Check if admin (authenticated request)
    const token = (await cookies()).get(getCookieName())?.value;
    const isAdmin = token ? !!(await verifyJWT(token)) : false;

    return NextResponse.json(
      isAdmin ? products : products.filter((p) => p.status !== "draft")
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    requirePermission(request, "product:create");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.startsWith("UNAUTHORIZED")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body.id || !body.name || !body.category || !body.image) {
      return NextResponse.json({ error: "id, name, category, image are required" }, { status: 400 });
    }
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
