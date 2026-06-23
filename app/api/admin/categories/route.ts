import { NextResponse } from "next/server";
import { getAllCategories, saveAllCategories, createCategory } from "@/lib/categories-db";
import { requirePermission } from "@/lib/auth";


export async function GET() {
  try {
    const cats = await getAllCategories();
    return NextResponse.json(cats);
  } catch (e) {
    console.error("GET categories failed:", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    requirePermission(request, "category:manage");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.startsWith("UNAUTHORIZED")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();

    // If array, save all (batch sync) — requires product:edit permission
    if (Array.isArray(body)) {
      await saveAllCategories(body);
      return NextResponse.json({ success: true });
    }

    // Otherwise create a new top-level category
    const { id, name, nameZh, nameEs, productCategory } = body;
    if (!id || !name || !nameZh || !productCategory) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }
    const cat = await createCategory({ id, name, nameZh, nameEs, productCategory, children: [] });
    return NextResponse.json({ success: true, category: cat });
  } catch (e) {
    console.error("POST categories failed:", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
