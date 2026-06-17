import { NextResponse } from "next/server";
import {
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories-db";

export const runtime = "edge";

// PUT: update category or subcategory
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Subcategory update
    if (body.subId) {
      const { subId, ...updates } = body;
      const ok = await updateSubCategory(id, subId, updates);
      if (!ok) return NextResponse.json({ error: "子品类未找到" }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    // Category update
    const ok = await updateCategory(id, body);
    if (!ok) return NextResponse.json({ error: "品类未找到" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PUT category failed:", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// POST: add subcategory to a category
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const ok = await addSubCategory(id, body);
    if (!ok) return NextResponse.json({ error: "品类未找到" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("POST subcategory failed:", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// DELETE: delete category (with ?subId=) or subcategory
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: catId } = await params;
    const { searchParams } = new URL(request.url);
    const subId = searchParams.get("subId");

    if (subId) {
      const ok = await deleteSubCategory(catId, subId);
      if (!ok) return NextResponse.json({ error: "子品类未找到" }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    // Delete the whole category
    const ok = await deleteCategory(catId);
    if (!ok) return NextResponse.json({ error: "品类未找到" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE failed:", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
