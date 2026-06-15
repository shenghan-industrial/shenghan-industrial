import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PRODUCTS_JSON = path.join(process.cwd(), "data", "products.json");

// Keyword extraction: find the core type word in Chinese name
// e.g. "现代L型真皮沙发" → type="沙发", style="现代", material="真皮"
function analyzeChineseName(zhName: string): { type: string; style: string; material: string } {
  let type = "", style = "", material = "";

  if (zhName.includes("沙发")) type = "Sofa";
  else if (zhName.includes("餐桌")) type = "Dining Table";
  else if (zhName.includes("床")) type = "Bed";
  else if (zhName.includes("书桌") || zhName.includes("办公桌")) type = "Desk";
  else if (zhName.includes("茶几")) type = "Coffee Table";
  else if (zhName.includes("椅子")) type = "Chair";
  else if (zhName.includes("柜")) type = "Cabinet";
  else if (zhName.includes("台灯")) type = "Desk Lamp";
  else if (zhName.includes("吊灯")) type = "Pendant Light";
  else if (zhName.includes("落地灯")) type = "Floor Lamp";
  else if (zhName.includes("灯")) type = "Light";
  else if (zhName.includes("风扇")) type = "Fan";
  else if (zhName.includes("取暖器")) type = "Heater";
  else if (zhName.includes("水槽")) type = "Sink";
  else if (zhName.includes("龙头")) type = "Faucet";
  else if (zhName.includes("胶")) type = "Adhesive";
  else if (zhName.includes("板")) type = "Panel";

  if (zhName.includes("现代")) style = "Modern";
  else if (zhName.includes("北欧")) style = "Nordic";
  else if (zhName.includes("简约")) style = "Minimalist";
  else if (zhName.includes("豪华")) style = "Luxury";
  else if (zhName.includes("欧式")) style = "European";

  if (zhName.includes("真皮") || zhName.includes("牛皮")) material = "Genuine Leather";
  else if (zhName.includes("布艺") || zhName.includes("布")) material = "Fabric";
  else if (zhName.includes("实木") || zhName.includes("白橡") || zhName.includes("橡木")) material = "Solid Wood";
  else if (zhName.includes("不锈钢")) material = "Stainless Steel";
  else if (zhName.includes("铝合金")) material = "Aluminum";
  else if (zhName.includes("大理石")) material = "Marble";

  return { type, style, material };
}

function genEnName(zhName: string, subCat: string): string {
  const { type, style, material } = analyzeChineseName(zhName);
  const parts = [style, material, type || subCat || "Product"].filter(Boolean);
  // If no keywords extracted, use subcategory + descriptive
  if (parts.length <= 1) {
    return "Premium " + (subCat || "Product") + " — " + zhName.substring(0, 20);
  }
  return parts.join(" ") + " — " + zhName.substring(0, 15);
}

function genEsName(zhName: string, enName: string): string {
  return enName;
}

function genEnDesc(notesZh: string, zhName: string, enName: string, subCat: string): string {
  const { type, style, material } = analyzeChineseName(zhName);
  const descParts: string[] = [];

  // Build description from extracted keywords
  if (type) descParts.push(type);
  if (style) descParts.push(style + " style");
  if (material) descParts.push("crafted with " + material.toLowerCase());

  let desc = descParts.join(", ");
  if (notesZh) desc += ". Key features: " + notesZh.substring(0, 100);
  desc += ". " + (subCat || "") + " — " + enName + ". Factory direct from Shengyu Industrial, custom orders welcome.";

  return desc;
}

function genZhDesc(notesZh: string, zhName: string, catZh: string): string {
  if (notesZh) {
    return notesZh + "。" + zhName + "。盛煜实业工厂直供，支持定制。";
  }
  return zhName + "。盛煜实业自有工厂制造，严格品控，支持来样定制。";
}

function genEsDesc(notesZh: string, enName: string, subCat: string): string {
  return enName + ". " + (subCat || "") + " — Directo de fábrica de Shengyu Industrial. " +
    (notesZh ? "Características: " + notesZh.substring(0, 80) + "." : "Pedidos personalizados disponibles.");
}

// Category → Chinese
const catZhMap: Record<string, string> = {
  Furniture: "家具", "Building Materials": "建材", Hardware: "五金",
  Appliances: "家电", Lighting: "灯具", Others: "其他",
};

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

    // Generate names
    const enName = genEnName(nameZh, sub);
    const esName = genEsName(nameZh, enName);
    const zhName = nameZh + (sub ? " — " + sub : "");

    // Descriptions
    const enDesc = genEnDesc(notesZh || "", nameZh, enName, sub);
    const zhDesc = genZhDesc(notesZh || "", zhName, catZh);
    const esDesc = genEsDesc(notesZh || "", enName, sub);

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
    const existing = JSON.parse(fs.readFileSync(PRODUCTS_JSON, "utf8"));
    if (existing.find((p: { id: string }) => p.id === product.id)) {
      return NextResponse.json({ error: "产品ID重复，请重试" }, { status: 409 });
    }
    existing.push(product);
    fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(existing, null, 2), "utf8");

    return NextResponse.json({ success: true, id: product.id, name: enName, nameEs: esName });
  } catch (e) {
    console.error("Quick add failed:", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
