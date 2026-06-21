/**
 * Add SEO fields to all products in products.json.
 * Run: npx tsx scripts/add-seo.ts
 */
import fs from "fs";
import path from "path";

const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf-8")) as Record<string, unknown>[];

// SEO templates per category
const seoTemplates: Record<string, { title: string; desc: string; keywords: string[] }> = {
  Furniture: {
    title: "Factory Direct {name} — Custom {subcategory} Manufacturer | Shengyu Industrial",
    desc: "Premium {name} manufactured by Shengyu Industrial. {subcategory} factory direct pricing, OEM/ODM available, ISO-certified production. Global shipping.",
    keywords: ["{name}", "{subcategory}", "furniture manufacturer", "factory direct furniture", "OEM furniture", "wholesale furniture", "China furniture factory"],
  },
  "Building Materials": {
    title: "Wholesale {name} — {subcategory} Supplier | Shengyu Industrial",
    desc: "High-performance {name} from Shengyu Industrial. {subcategory} factory direct, ISO-certified, bulk supply available. Global logistics.",
    keywords: ["{name}", "{subcategory}", "building materials supplier", "construction materials", "wholesale building materials", "China building materials"],
  },
  Hardware: {
    title: "{name} — {subcategory} Factory Direct | Shengyu Industrial",
    desc: "Industrial-grade {name} by Shengyu Industrial. {subcategory} corrosion-resistant, TUV-tested, precision engineering. Factory direct pricing.",
    keywords: ["{name}", "{subcategory}", "hardware supplier", "industrial hardware", "China hardware", "fasteners", "door hardware"],
  },
  Appliances: {
    title: "{name} — Energy-Efficient {subcategory} | Shengyu Industrial",
    desc: "{name} manufactured by Shengyu Industrial. {subcategory} energy-efficient design, safety-certified, bulk supply. Factory direct from China.",
    keywords: ["{name}", "{subcategory}", "home appliances", "kitchen appliances", "China appliances factory", "OEM appliances"],
  },
  Lighting: {
    title: "{name} — LED {subcategory} Manufacturer | Shengyu Industrial",
    desc: "Energy-efficient {name} by Shengyu Industrial. {subcategory} 150 lm/W, IP65 rated, long lifespan. Factory direct LED lighting from China.",
    keywords: ["{name}", "{subcategory}", "LED lighting", "industrial lighting", "China LED factory", "commercial lighting"],
  },
  Others: {
    title: "{name} — Industrial Grade {category} | Shengyu Industrial",
    desc: "{name} from Shengyu Industrial. Professional-grade {category}, factory direct pricing, bulk supply, global shipping available.",
    keywords: ["{name}", "{category}", "industrial products", "China manufacturer", "bulk supply", "factory direct"],
  },
};

const subNameMap: Record<string, string> = {
  Sofas: "Sofas", Beds: "Beds", Cabinets: "Cabinets",
  Adhesives: "Adhesives & Sealants", Panels: "Engineered Panels",
  Fasteners: "Fasteners", "Door & Window": "Door & Window Hardware", Bathroom: "Bathroom Hardware",
  Fans: "Fans", Heaters: "Heaters", Kitchen: "Kitchen Appliances",
  "Desk Lamps": "Desk Lamps", "Pendant Lights": "Pendant Lights", "Floor Lamps": "Floor Lamps",
};

function fill(template: string, product: Record<string, unknown>): string {
  const name = (product.name as string) || (product.nameZh as string) || "";
  const cat = (product.category as string) || "";
  const sub = (product.subCategory as string) || cat;
  const subName = subNameMap[sub] || sub;
  return template.replace(/\{name\}/g, name).replace(/\{subcategory\}/g, subName).replace(/\{category\}/g, cat);
}

let added = 0;
for (const p of products) {
  if (!p.id) continue;
  const cat = (p.category as string) || "Others";
  const tpl = seoTemplates[cat] || seoTemplates.Others;

  // Add seoTitle
  if (!p.seoTitle) {
    p.seoTitle = fill(tpl.title, p) + " | Shengyu Industrial";
    // Limit to ~60 chars for SEO
    const title = p.seoTitle as string;
    if (title.length > 65) p.seoTitle = title.slice(0, 62) + "...";
    added++;
  }

  // Add seoDescription
  if (!p.seoDescription) {
    p.seoDescription = fill(tpl.desc, p);
    const desc = p.seoDescription as string;
    if (desc.length > 160) p.seoDescription = desc.slice(0, 157) + "...";
  }

  // Add seoKeywords
  if (!p.seoKeywords) {
    p.seoKeywords = tpl.keywords.map((k) => fill(k, p)).slice(0, 10);
  }
}

// Also fill in featuresEs and specsEs for products missing them
const defaultFeaturesEs: Record<string, string[]> = {
  Furniture: ["Materiales premium y mano de obra experta", "Proceso de producción certificado ISO", "Especificaciones personalizadas disponibles", "Embalaje estándar de exportación"],
  "Building Materials": ["Formulación de alto rendimiento", "Resistente a la intemperie y duradero", "Cumple con estándares internacionales", "Calidad de grado profesional"],
  Hardware: ["Materiales resistentes a la corrosión", "Ingeniería de precisión", "Estándares de calidad probados por TUV", "Durabilidad de grado industrial"],
  Appliances: ["Diseño de eficiencia energética", "Componentes con certificación de seguridad", "Operación fácil de usar", "Estética moderna"],
  Lighting: ["Tecnología LED de bajo consumo", "Larga vida útil y bajo mantenimiento", "Múltiples opciones de temperatura de color", "Clasificación IP para durabilidad"],
  Others: ["Calidad directa de fábrica", "Rendimiento confiable", "Precios competitivos", "Suministro al por mayor disponible"],
};

const defaultSpecsEs: Record<string, { label: string; value: string }[]> = {
  Furniture: [
    { label: "Material", value: "Grado premium" }, { label: "Cantidad Mínima", value: "Negociable" },
    { label: "Plazo de Entrega", value: "25-35 días" }, { label: "Personalización", value: "Disponible" },
  ],
  "Building Materials": [
    { label: "Material", value: "Grado premium" }, { label: "Cantidad Mínima", value: "Negociable" },
    { label: "Plazo de Entrega", value: "20-30 días" }, { label: "Personalización", value: "Disponible" },
  ],
  Hardware: [
    { label: "Material", value: "Acero inoxidable" }, { label: "Cantidad Mínima", value: "100 kits" },
    { label: "Plazo de Entrega", value: "25-35 días" }, { label: "Personalización", value: "Disponible" },
  ],
  Appliances: [
    { label: "Material", value: "Grado premium" }, { label: "Cantidad Mínima", value: "Negociable" },
    { label: "Plazo de Entrega", value: "25-35 días" }, { label: "Personalización", value: "Disponible" },
  ],
  Lighting: [
    { label: "Material", value: "Grado premium" }, { label: "Cantidad Mínima", value: "Negociable" },
    { label: "Plazo de Entrega", value: "20-30 días" }, { label: "Personalización", value: "Disponible" },
  ],
  Others: [
    { label: "Material", value: "Grado premium" }, { label: "Cantidad Mínima", value: "Negociable" },
    { label: "Plazo de Entrega", value: "25-35 días" }, { label: "Personalización", value: "Disponible" },
  ],
};

for (const p of products) {
  const cat = (p.category as string) || "Others";
  if (!p.featuresEs || (p.featuresEs as string[]).length === 0) {
    p.featuresEs = defaultFeaturesEs[cat] || defaultFeaturesEs.Others;
  }
  if (!p.specsEs || (p.specsEs as unknown[]).length === 0) {
    p.specsEs = defaultSpecsEs[cat] || defaultSpecsEs.Others;
  }
}

fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
console.log(`Done: ${added} SEO titles added, featuresEs/specsEs filled for all ${products.length} products`);
