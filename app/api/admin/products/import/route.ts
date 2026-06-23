import { NextResponse } from "next/server";
import { categories } from "@/data/categories";
import { kvGetJSON, kvPutJSON } from "@/lib/kv-storage";
import { requirePermission } from "@/lib/auth";


// ── generateProduct (unchanged logic, adds Phase 2 fields) ──
function generateProduct(
  name: string, nameZh: string, category: string, subCategory: string,
  image: string, price: string, notes: string
) {
  const id = (category + "-" + (subCategory || "product") + "-" + name)
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  const esName = name + " — " + subCategory;

  const subZhMap: Record<string, string> = {
    Sofas: "沙发", Beds: "床", Cabinets: "柜子",
    Adhesives: "胶粘剂", Panels: "板材", Fasteners: "紧固件",
    "Door & Window": "门窗配件", Bathroom: "卫浴配件",
    Fans: "电风扇", Heaters: "取暖器", Kitchen: "厨房小家电",
    "Desk Lamps": "台灯", "Pendant Lights": "吊灯", "Floor Lamps": "落地灯",
  };
  const subZh = subZhMap[subCategory] || subCategory;
  const catZhMap: Record<string, string> = {
    Furniture: "家具", "Building Materials": "建材", Hardware: "五金",
    Appliances: "家电", Lighting: "灯具", Others: "其他",
  };

  const featTemplates: Record<string, { en: string[]; zh: string[] }> = {
    Furniture: {
      en: ["Premium materials and expert workmanship", "ISO-certified production process", "Custom specifications available", "Export-standard packaging"],
      zh: ["优质材料与精湛工艺", "ISO认证生产流程", "支持定制规格", "出口标准包装"],
    },
    Lighting: {
      en: ["Energy-efficient LED technology", "Long lifespan and low maintenance", "Multiple color temperature options", "IP-rated for durability"],
      zh: ["高效节能LED技术", "长寿命低维护", "多色温可选", "IP防护等级持久耐用"],
    },
    Hardware: {
      en: ["Corrosion-resistant materials", "Precision engineering", "TÜV-tested quality standards", "Industrial-grade durability"],
      zh: ["耐腐蚀材质", "精密工艺", "TÜV检测品质标准", "工业级耐用性"],
    },
    "Building Materials": {
      en: ["High-performance formulation", "Weather-resistant and durable", "Meets international standards", "Professional-grade quality"],
      zh: ["高性能配方", "耐候持久", "符合国际标准", "专业级品质"],
    },
    Appliances: {
      en: ["Energy-efficient design", "Safety-certified components", "User-friendly operation", "Modern aesthetic"],
      zh: ["节能设计", "安全认证组件", "人性化操作", "现代美学外观"],
    },
    Others: {
      en: ["Factory direct quality", "Reliable performance", "Competitive pricing", "Bulk supply available"],
      zh: ["工厂直供品质", "性能可靠", "价格竞争力", "大宗供应"],
    },
  };

  const ft = featTemplates[category] || featTemplates.Others;
  const zhName = nameZh || name + " — " + subZh;

  const now = new Date().toISOString();

  return {
    id,
    name: { en: name, zh: zhName, es: esName },
    subtitle: { en: subCategory + " — factory direct quality", zh: subZh + " — 工厂直供品质", es: subCategory + " — calidad directa de fábrica" },
    category,
    subCategory: subCategory || undefined,
    description: {
      en: notes
        ? `${notes}. ${subCategory} — ${name}. Factory direct from Shengyu Industrial.`
        : `Shengyu Industrial ${subCategory?.toLowerCase() || ""} — ${name}. Manufactured in our own facilities.`,
      zh: notes
        ? `${notes}。${subZh} — ${zhName}。盛煜实业工厂直供。`
        : `盛煜实业 ${subZh} — ${zhName}。自有工厂制造，严格品控。`,
      es: notes
        ? `${notes}. ${subCategory} — ${esName}. Directo de fábrica de Shengyu Industrial.`
        : `Shengyu Industrial ${subCategory?.toLowerCase() || ""} — ${esName}. Fabricado en nuestras propias instalaciones.`,
    },
    features: { en: ft.en, zh: ft.zh, es: ft.en.map(f => f) },
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
    image: image || "/images/product-1.svg",
    price: price || "",
    partnerId: "shenghan-industrial",
    // Phase 2 fields
    sku: `SY-${category.slice(0, 2).toUpperCase()}-${id.slice(0, 8).toUpperCase()}`,
    slug: id,
    status: "published" as const,
    gallery: [image || "/images/product-1.svg"],
    tags: [category, subCategory],
    createdAt: now,
    updatedAt: now,
  };
}

// Parse CSV line (handles commas in fields)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === "," && !inQuotes) { result.push(current.trim()); current = ""; continue; }
    current += ch;
  }
  result.push(current.trim());
  return result;
}

// Valid category names
const validCategories = new Set(categories.map(c => c.productCategory));
const validSubs = new Set<string>();
categories.forEach(c => {
  (c.children || c.groups?.flatMap(g => g.children) || []).forEach(child => {
    if (child.productSubCategory) validSubs.add(child.productSubCategory);
  });
});

export async function POST(request: Request) {
  try {
    requirePermission(request, "product:create");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.startsWith("UNAUTHORIZED")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { csv } = await request.json() as { csv: string };
    if (!csv) return NextResponse.json({ imported: 0, errors: ["No CSV data"] }, { status: 400 });

    const lines = csv.split("\n").filter(l => l.trim());
    if (lines.length < 2) return NextResponse.json({ imported: 0, errors: ["CSV must have header + at least one data row"] }, { status: 400 });

    const header = parseCSVLine(lines[0]).map(h => h.trim());
    const nameIdx = header.indexOf("name");
    const nameZhIdx = header.indexOf("nameZh");
    const catIdx = header.indexOf("category");
    const subIdx = header.indexOf("subCategory");
    const imgIdx = header.indexOf("image");
    const priceIdx = header.indexOf("price");
    const notesIdx = header.indexOf("notes");

    if (nameIdx === -1 || catIdx === -1) {
      return NextResponse.json({ imported: 0, errors: ["CSV must have 'name' and 'category' columns"] }, { status: 400 });
    }

    const existing = (await kvGetJSON<{ id: string }[]>("products")) ?? [];
    const existingIds = new Set(existing.map((p: { id: string }) => p.id));

    const errors: string[] = [];
    const newProducts: ReturnType<typeof generateProduct>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      const name = fields[nameIdx]?.trim();
      const nameZh = nameZhIdx >= 0 ? fields[nameZhIdx]?.trim() || "" : "";
      const category = catIdx >= 0 ? fields[catIdx]?.trim() || "" : "";
      const subCategory = subIdx >= 0 ? fields[subIdx]?.trim() || "" : "";
      const image = imgIdx >= 0 ? fields[imgIdx]?.trim() || "" : "";
      const price = priceIdx >= 0 ? fields[priceIdx]?.trim() || "" : "";

      if (!name) { errors.push(`Row ${i}: name is required`); continue; }
      if (!category) { errors.push(`Row ${i}: category is required`); continue; }
      if (!validCategories.has(category)) { errors.push(`Row ${i}: invalid category "${category}"`); continue; }
      if (subCategory && !validSubs.has(subCategory)) { errors.push(`Row ${i}: invalid subCategory "${subCategory}"`); continue; }

      const notes = notesIdx >= 0 ? fields[notesIdx]?.trim() || "" : "";
      const product = generateProduct(name, nameZh, category, subCategory, image, price, notes);
      if (existingIds.has(product.id)) { errors.push(`Row ${i}: duplicate ID "${product.id}" — skipped`); continue; }

      newProducts.push(product);
      existingIds.add(product.id);
    }

    const allProducts = [...existing, ...newProducts];
    await kvPutJSON("products", allProducts);

    return NextResponse.json({ imported: newProducts.length, errors });
  } catch (e) {
    console.error("Import failed:", e);
    return NextResponse.json({ imported: 0, errors: ["Server error"] }, { status: 500 });
  }
}
