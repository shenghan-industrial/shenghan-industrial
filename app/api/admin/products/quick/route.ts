import { NextResponse } from "next/server";
import { kvGetJSON, kvPutJSON } from "@/lib/kv-storage";
import { genEnName, genEsName, catZhMap } from "@/lib/translate-name";

export const runtime = "edge";

export async function POST(request: Request) {
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

    // Use shared translation
    const enName = genEnName(nameZh, sub);
    const esName = genEsName(nameZh, enName);
    const zhName = nameZh + (sub ? " — " + sub : "");

    // Descriptions
    const enDesc = notesZh
      ? `${notesZh}. ${sub} — ${enName}. Factory direct from Shengyu Industrial, custom orders welcome.`
      : `${sub} — ${enName}. Factory direct from Shengyu Industrial, custom orders welcome.`;
    const zhDesc = notesZh
      ? `${notesZh}。${zhName}。盛煜实业工厂直供，支持定制。`
      : `${zhName}。盛煜实业自有工厂制造，严格品控。`;
    const esDesc = notesZh
      ? `${notesZh}. ${sub} — ${esName}. Directo de fábrica de Shengyu Industrial.`
      : `${esName}. ${sub} — Directo de fábrica de Shengyu Industrial. Pedidos personalizados disponibles.`;

    // Unique ID
    const baseId = (category + "-" + (sub || "product") + "-" + nameZh)
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const id = baseId.substring(0, 40) + "-" + Date.now().toString(36);

    // Image
    const imgPrefix = imagePrefix || "/images/products/";
    const image = imgPrefix + id + ".webp";

    const product = {
      id, name: enName, nameZh: zhName, nameEs: esName,
      subtitle: (sub || category) + " — Shengyu Industrial",
      subtitleZh: (sub || catZh) + " — 盛煜实业",
      subtitleEs: (sub || category) + " — Shengyu Industrial",
      category, subCategory: sub || undefined,
      description: enDesc,
      descriptionZh: zhDesc,
      descriptionEs: esDesc,
      features: ["Premium quality", "Factory direct pricing", "Custom orders available", "Export packaging"],
      featuresZh: ["优质品质", "工厂直供价格", "支持定制", "出口包装"],
      featuresEs: ["Calidad premium", "Precio directo de fábrica", "Pedidos personalizados", "Embalaje de exportación"],
      specs: [
        { label: "Material", value: "Premium grade" },
        { label: "MOQ", value: "Negotiable" },
        { label: "Lead Time", value: "25–35 days" },
        { label: "Customization", value: "Available" },
      ],
      specsZh: [
        { label: "材质", value: "优质等级" },
        { label: "起订量", value: "可协商" },
        { label: "交期", value: "25–35 天" },
        { label: "定制", value: "支持" },
      ],
      specsEs: [
        { label: "Material", value: "Grado premium" },
        { label: "Cantidad Mínima", value: "Negociable" },
        { label: "Plazo de Entrega", value: "25–35 días" },
        { label: "Personalización", value: "Disponible" },
      ],
      image, price: price || "",
      partnerId: "shenghan-industrial",
    };

    // Save
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
