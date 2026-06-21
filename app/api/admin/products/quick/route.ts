import { NextResponse } from "next/server";
import { kvGetJSON, kvPutJSON } from "@/lib/kv-storage";
import { genEnName, genEsName, catZhMap } from "@/lib/translate-name";
import { requirePermission } from "@/lib/auth";

// export const runtime = "edge";

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
    const { nameZh, notesZh, category, subCategory, imagePrefix, price } = body as {
      nameZh: string; notesZh?: string; category: string; subCategory?: string;
      imagePrefix?: string; price?: string;
    };

    if (!nameZh || !category) {
      return NextResponse.json({ error: "中文名称和品类为必填" }, { status: 400 });
    }

    const catZh = catZhMap[category] || category;
    const sub = subCategory || "";

    const enName = genEnName(nameZh, sub);
    const esName = genEsName(nameZh, enName);
    const zhName = nameZh + (sub ? " — " + sub : "");

    const enDesc = notesZh
      ? `${notesZh}. ${sub} — ${enName}. Factory direct from Shengyu Industrial, custom orders welcome.`
      : `${sub} — ${enName}. Factory direct from Shengyu Industrial, custom orders welcome.`;
    const zhDesc = notesZh
      ? `${notesZh}。${zhName}。盛煜实业工厂直供，支持定制。`
      : `${zhName}。盛煜实业自有工厂制造，严格品控。`;
    const esDesc = notesZh
      ? `${notesZh}. ${sub} — ${esName}. Directo de fábrica de Shengyu Industrial.`
      : `${esName}. ${sub} — Directo de fábrica de Shengyu Industrial. Pedidos personalizados disponibles.`;

    const baseId = (category + "-" + (sub || "product") + "-" + nameZh)
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const id = baseId.substring(0, 40) + "-" + Date.now().toString(36);

    const imgPrefix = imagePrefix || "/images/products/";
    const image = imgPrefix + id + ".webp";
    const now = new Date().toISOString();

    const product = {
      id,
      name: { en: enName, zh: zhName, es: esName },
      subtitle: { en: (sub || category) + " — Shengyu Industrial", zh: (sub || catZh) + " — 盛煜实业", es: (sub || category) + " — Shengyu Industrial" },
      category, subCategory: sub || undefined,
      description: { en: enDesc, zh: zhDesc, es: esDesc },
      features: {
        en: ["Premium quality", "Factory direct pricing", "Custom orders available", "Export packaging"],
        zh: ["优质品质", "工厂直供价格", "支持定制", "出口包装"],
        es: ["Calidad premium", "Precio directo de fábrica", "Pedidos personalizados", "Embalaje de exportación"],
      },
      specs: {
        en: [
          { label: "Material", value: "Premium grade" },
          { label: "MOQ", value: "Negotiable" },
          { label: "Lead Time", value: "25–35 days" },
          { label: "Customization", value: "Available" },
        ],
        zh: [
          { label: "材质", value: "优质等级" },
          { label: "起订量", value: "可协商" },
          { label: "交期", value: "25–35 天" },
          { label: "定制", value: "支持" },
        ],
        es: [
          { label: "Material", value: "Grado premium" },
          { label: "Cantidad Mínima", value: "Negociable" },
          { label: "Plazo de Entrega", value: "25–35 días" },
          { label: "Personalización", value: "Disponible" },
        ],
      },
      image, price: price || "",
      partnerId: "shenghan-industrial",
      // Phase 2 fields
      sku: `SY-${category.slice(0, 2).toUpperCase()}-${id.slice(0, 8).toUpperCase()}`,
      slug: id,
      status: "published" as const,
      gallery: [image],
      tags: [category, sub].filter(Boolean),
      createdAt: now,
      updatedAt: now,
    };

    const existing = (await kvGetJSON<{ id: string }[]>("products")) ?? [];
    if (existing.find((p: { id: string }) => p.id === product.id)) {
      return NextResponse.json({ error: "产品ID重复，请重试" }, { status: 409 });
    }
    existing.push(product);
    await kvPutJSON("products", existing);

    return NextResponse.json({ success: true, id: product.id, name: enName, nameEs: esName });
  } catch (e) {
    console.error("Quick add failed:", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
