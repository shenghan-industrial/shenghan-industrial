import { NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/products-db";

export const runtime = "edge";

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.name || !body.category || !body.image) {
      return NextResponse.json({ error: "id, name, category, image are required" }, { status: 400 });
    }
    const product = createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
