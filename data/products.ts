export type ProductStatus = "draft" | "published" | "archived";

// ── Phase 3: Multi-language types ─────────────────────────
export interface MultiLangText { en: string; zh: string; es: string; }
export interface MultiLangArray { en: string[]; zh: string[]; es: string[]; }
export interface MultiLangSpecs {
  en: { label: string; value: string }[];
  zh: { label: string; value: string }[];
  es: { label: string; value: string }[];
}

// ── Product Interface (Phase 3: object-based i18n) ────────
export interface Product {
  id: string;
  name: MultiLangText;
  subtitle: MultiLangText;
  category: string;
  subCategory?: string;
  description: MultiLangText;
  features: MultiLangArray;
  specs: MultiLangSpecs;
  image: string;
  images?: string[];
  badge?: MultiLangText;
  partnerId?: string;
  onPromotion?: boolean;
  monthlyBest?: boolean;
  price?: string;
  weeklySales?: number;
  promoTag?: string;
  notes?: string;
  model?: string;
  sku?: string;
  slug?: string;
  status?: ProductStatus;
  seoTitle?: MultiLangText;
  seoDescription?: MultiLangText;
  seoKeywords?: MultiLangText;
  downloads?: { name: string; url: string }[];
  tags?: string[];
  gallery?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ── Migration: old flat format → new MultiLang format ──
interface OldProduct {
  name: string; nameZh?: string; nameEs?: string;
  subtitle: string; subtitleZh?: string; subtitleEs?: string;
  description: string; descriptionZh?: string; descriptionEs?: string;
  features: string[]; featuresZh?: string[]; featuresEs?: string[];
  specs: { label: string; value: string }[];
  specsZh?: { label: string; value: string }[];
  specsEs?: { label: string; value: string }[];
  badge?: string; badgeZh?: string; badgeEs?: string;
  seoTitle?: string; seoDescription?: string; seoKeywords?: string;
  [key: string]: unknown;
}

function mlv(flat: unknown, zh?: string, es?: string): MultiLangText {
  if (flat && typeof flat === "object" && "en" in (flat as Record<string, unknown>)) {
    return flat as MultiLangText;
  }
  const en = typeof flat === "string" ? flat : "";
  return { en: en || "", zh: zh || en || "", es: es || en || "" };
}

function mlav(flat: unknown, zh?: string[], es?: string[]): MultiLangArray {
  if (Array.isArray(flat) && flat.length > 0 && typeof flat[0] === "object") {
    return flat as unknown as MultiLangArray;
  }
  const en = Array.isArray(flat) ? flat : [];
  return { en, zh: zh || en, es: es || en };
}

function mlsv(flat: unknown, zh?: { label: string; value: string }[], es?: { label: string; value: string }[]): MultiLangSpecs {
  if (Array.isArray(flat) && flat.length > 0 && flat[0] && "en" in (flat[0] as Record<string, unknown>)) {
    return flat as unknown as MultiLangSpecs;
  }
  const en = Array.isArray(flat) ? flat : [];
  return { en, zh: zh || en, es: es || en };
}

function isOldFormat(p: Record<string, unknown>): boolean {
  return typeof p.name === "string";
}

/** Migrate an old-format product to new MultiLang format */
export function migrateProduct(raw: Record<string, unknown>): Product {
  if (!isOldFormat(raw)) return raw as unknown as Product;
  const p = raw as unknown as OldProduct;
  const now = new Date().toISOString();
  return {
    id: p.id as string,
    name: mlv(p.name, p.nameZh, p.nameEs),
    subtitle: mlv(p.subtitle, p.subtitleZh, p.subtitleEs),
    category: (p.category as string) || "",
    subCategory: p.subCategory as string | undefined,
    description: mlv(p.description, p.descriptionZh, p.descriptionEs),
    features: mlav(p.features, p.featuresZh, p.featuresEs),
    specs: mlsv(p.specs, p.specsZh, p.specsEs),
    image: (p.image as string) || "",
    images: p.images as string[] | undefined,
    badge: p.badge ? mlv(p.badge, p.badgeZh, p.badgeEs) : undefined,
    partnerId: p.partnerId as string | undefined,
    onPromotion: p.onPromotion as boolean | undefined,
    monthlyBest: p.monthlyBest as boolean | undefined,
    price: p.price as string | undefined,
    weeklySales: p.weeklySales as number | undefined,
    promoTag: p.promoTag as string | undefined,
    notes: p.notes as string | undefined,
    model: p.model as string | undefined,
    sku: (p.sku as string) || undefined,
    slug: (p.slug as string) || undefined,
    status: (p.status as ProductStatus) || undefined,
    seoTitle: mlv(p.seoTitle),
    seoDescription: mlv(p.seoDescription),
    seoKeywords: mlv(p.seoKeywords),
    downloads: p.downloads as { name: string; url: string }[] | undefined,
    tags: p.tags as string[] | undefined,
    gallery: p.gallery as string[] | undefined,
    createdAt: (p.createdAt as string) || now,
    updatedAt: (p.updatedAt as string) || now,
  };
}

// ── Static seed data (old format, migrated at runtime) ──
import productsJson from "./products.json";

const categoryPartnerMap: Record<string, string> = {
  Furniture: "kaidi-feiluo", "Building Materials": "hengda-materials",
  Hardware: "jinying-hardware", Appliances: "aolis-home",
  Lighting: "brightlux-lighting", Others: "shenghan-industrial",
};

const subZhMap: Record<string, string> = {
  Sofas: "沙发", Beds: "床", Cabinets: "柜子",
  Adhesives: "胶粘剂", Panels: "板材", Fasteners: "紧固件",
  "Door & Window": "门窗配件", Bathroom: "卫浴配件",
  Fans: "电风扇", Heaters: "取暖器", Kitchen: "厨房小家电",
  "Desk Lamps": "台灯", "Pendant Lights": "吊灯", "Floor Lamps": "落地灯",
};
const subEsMap: Record<string, string> = {
  Sofas: "Sofás", Beds: "Camas", Cabinets: "Armarios",
  Adhesives: "Adhesivos", Panels: "Paneles", Fasteners: "Sujetadores",
  "Door & Window": "Puertas y Ventanas", Bathroom: "Accesorios de Baño",
  Fans: "Ventiladores", Heaters: "Calefactores", Kitchen: "Electrodomésticos de Cocina",
  "Desk Lamps": "Lámparas de Escritorio", "Pendant Lights": "Lámparas Colgantes", "Floor Lamps": "Lámparas de Pie",
};

// Legacy placeholder (generates old-format records, migrated later)
function legacyPlaceholder(name: string, cat: string, sub: string, img: string, badge?: string): Record<string, unknown> {
  const zhName = name + " — " + (subZhMap[sub] || sub);
  const esName = name + " — " + (subEsMap[sub] || sub);
  return {
    id: (cat + "-" + sub + "-" + name).toLowerCase().replace(/[^a-z0-9]/g, "-"),
    name, nameZh: zhName, nameEs: esName,
    subtitle: sub + " — factory direct quality",
    subtitleZh: (subZhMap[sub] || sub) + " — 工厂直供品质",
    subtitleEs: (subEsMap[sub] || sub) + " — calidad directa de fábrica",
    category: cat, subCategory: sub,
    partnerId: categoryPartnerMap[cat] || "shenghan-industrial",
    description: "Shengyu Industrial " + sub.toLowerCase() + " — " + name + ". Manufactured in our own facilities.",
    descriptionZh: "盛煜实业 " + (subZhMap[sub] || sub) + " — " + zhName + "。自有工厂制造。",
    descriptionEs: "Shengyu Industrial " + (subEsMap[sub] || sub).toLowerCase() + " — " + esName + ". Fabricado en nuestras propias instalaciones.",
    features: ["Premium materials", "ISO-certified", "Custom specs available", "Export packaging"],
    featuresZh: ["优质材料", "ISO认证", "支持定制", "出口包装"],
    featuresEs: ["Materiales premium", "Certificado ISO", "Especificaciones personalizadas", "Embalaje de exportación"],
    specs: [
      { label: "Material", value: "Premium grade" },
      { label: "MOQ", value: "Negotiable" },
      { label: "Lead Time", value: "25–35 days" },
      { label: "Customization", value: "Available" },
    ],
    specsZh: [
      { label: "材质", value: "优质等级" }, { label: "起订量", value: "可协商" },
      { label: "交期", value: "25–35 天" }, { label: "定制", value: "支持" },
    ],
    specsEs: [
      { label: "Material", value: "Grado premium" }, { label: "Cantidad Mínima", value: "Negociable" },
      { label: "Plazo de Entrega", value: "25–35 días" }, { label: "Personalización", value: "Disponible" },
    ],
    image: img, badge, badgeZh: badge === "Best Seller" ? "热卖" : badge === "New" ? "新品" : badge,
    badgeEs: badge === "Best Seller" ? "Más Vendido" : badge === "New" ? "Nuevo" : badge,
  };
}

// Static products in legacy format
const sofas: Record<string, unknown>[] = Array.from({ length: 15 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    id: "sofa-" + n, name: "Shengyu Sofa " + n, nameZh: "盛煜沙发 " + n, nameEs: "Shengyu Sofá " + n,
    subtitle: "Premium upholstered sofa — factory direct",
    subtitleZh: "高端软体沙发 — 工厂直供", subtitleEs: "Sofá tapizado premium — directo de fábrica",
    category: "Furniture", subCategory: "Sofas",
    description: "Shengyu designer sofa with premium fabric/leather upholstery, high-resilience foam, and solid wood frame.",
    descriptionZh: "盛煜设计师沙发，采用高端布艺/真皮面料、高回弹海绵和实木框架。",
    descriptionEs: "Sofá de diseño Shengyu con tapizado premium, espuma de alta resiliencia y estructura de madera maciza.",
    features: [
      "High-density foam with premium fabric or genuine leather",
      "Solid hardwood frame with reinforced joinery",
      "Customizable — 2-seater, 3-seater, L-shape", "15+ designer colorways",
    ],
    featuresZh: ["高密度海绵搭配高端布艺或真皮面料", "实木硬木框架，加固榫接工艺", "可定制 — 双人位、三人位、L型", "15+ 设计师配色可选"],
    featuresEs: ["Espuma de alta densidad con tela premium o cuero genuino", "Estructura de madera dura maciza", "Configuraciones personalizables", "Más de 15 colores de diseño"],
    specs: [
      { label: "Frame Material", value: "Solid hardwood + plywood" },
      { label: "Upholstery", value: "Fabric / PU / Genuine Leather" },
      { label: "Foam Density", value: "≥35 kg/m³" }, { label: "MOQ", value: "10 units" },
    ],
    specsZh: [
      { label: "框架材质", value: "实木硬木 + 胶合板" }, { label: "面料", value: "布艺 / PU / 真皮" },
      { label: "海绵密度", value: "≥35 kg/m³" }, { label: "起订量", value: "每款10件起" },
    ],
    specsEs: [
      { label: "Material del Marco", value: "Madera dura maciza" }, { label: "Tapicería", value: "Tela / PU / Cuero" },
      { label: "Densidad de Espuma", value: "≥35 kg/m³" }, { label: "Cantidad Mínima", value: "10 unidades" },
    ],
    image: "/images/products/sofas/" + (i + 1) + ".webp",
    badge: i === 0 ? "Best Seller" : undefined, badgeZh: i === 0 ? "热卖" : undefined,
    badgeEs: i === 0 ? "Más Vendido" : undefined,
  };
});

const beds: Record<string, unknown>[] = Array.from({ length: 6 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    id: "bed-" + n, name: "Shengyu Bed " + n, nameZh: "盛煜床 " + n, nameEs: "Shengyu Cama " + n,
    subtitle: "Luxurious upholstered bed — factory direct",
    subtitleZh: "豪华软体床 — 工厂直供", subtitleEs: "Cama tapizada de lujo — directo de fábrica",
    category: "Furniture", subCategory: "Beds",
    description: "Shengyu premium soft bed with elegant upholstered headboard and solid wood slatted base.",
    descriptionZh: "盛煜高端软床，优雅布艺/皮革床头板搭配实木排骨架底座。",
    descriptionEs: "Cama suave premium Shengyu con elegante cabecero tapizado y base de listones de madera maciza.",
    features: ["Soft-touch fabric headboard", "Solid wood slatted base", "Modern to luxury styles", "Tool-free assembly"],
    featuresZh: ["亲肤面料软包床头板", "实木排骨架底座", "现代至奢华款式", "免工具安装"],
    featuresEs: ["Cabecero tapizado en tela suave", "Base de listones de madera maciza", "Estilos modernos a lujo", "Montaje sin herramientas"],
    specs: [
      { label: "Sizes", value: "1.5m / 1.8m / 2.0m" }, { label: "Headboard", value: "Fabric / PU Leather / Velvet" },
      { label: "Frame", value: "Solid wood + MDF" }, { label: "MOQ", value: "10 units" },
    ],
    specsZh: [
      { label: "尺寸", value: "1.5m / 1.8m / 2.0m" }, { label: "床头材质", value: "布艺 / PU皮革 / 丝绒" },
      { label: "框架", value: "实木 + MDF" }, { label: "起订量", value: "每款10件起" },
    ],
    specsEs: [
      { label: "Tamaños", value: "1.5m / 1.8m / 2.0m" }, { label: "Cabecero", value: "Tela / Cuero PU / Terciopelo" },
      { label: "Estructura", value: "Madera maciza + MDF" }, { label: "Cantidad Mínima", value: "10 unidades" },
    ],
    image: "/images/products/beds/" + (i + 1) + ".webp",
    badge: i === 0 ? "New" : undefined, badgeZh: i === 0 ? "新品" : undefined, badgeEs: i === 0 ? "Nuevo" : undefined,
  };
});

const cabinets = ["Display Cabinet", "TV Stand Cabinet", "Storage Cabinet"].map((name, i) =>
  legacyPlaceholder(name, "Furniture", "Cabinets", "/images/product-" + (i + 6) + ".svg", i === 0 ? "New" : undefined));

const adhesives = [
  {
    id: "silicone-sealant-sg9000", name: "Shengyu SG-9000 Silicone Structural Sealant",
    nameZh: "盛煜 SG-9000 硅酮结构密封胶", nameEs: "Shengyu SG-9000 Sellador Estructural de Silicona",
    subtitle: "For high-rise curtain wall structural bonding",
    category: "Building Materials", subCategory: "Adhesives",
    description: "Two-component silicone structural sealant for high-rise building curtain walls.",
    features: ["Tensile strength ≥ 1.2 MPa", "50-year design life", "Two-component fast-cure", "Zero VOC"],
    specs: [
      { label: "Tensile Strength", value: "≥1.2 MPa" }, { label: "Elongation at Break", value: "≥400%" },
      { label: "Service Temperature", value: "-50°C ~ +150°C" }, { label: "Color", value: "Black / White / Grey" },
    ],
    image: "/images/product-2.svg", badge: "Best Seller", badgeZh: "热卖", badgeEs: "Más Vendido",
  },
  ...["Weatherproof Sealant WS-7000", "Epoxy Stone Adhesive SA-5000"].map((name, i) =>
    legacyPlaceholder(name, "Building Materials", "Adhesives", "/images/product-" + (i + 3) + ".svg")),
];

const panels = ["MDF Board", "Plywood Panel", "Particle Board"].map((name, i) =>
  legacyPlaceholder(name, "Building Materials", "Panels", "/images/product-" + (i + 8) + ".svg"));

const fasteners = [
  {
    id: "anchor-kit-hw500", name: "Shengyu Heavy-Duty Anchor Fastener Kit HW-500",
    nameZh: "盛煜 重型锚固套件 HW-500", nameEs: "Shengyu Kit de Anclaje de Alta Resistencia HW-500",
    subtitle: "Professional anchoring for concrete and masonry",
    category: "Hardware", subCategory: "Fasteners",
    description: "High-strength AISI 304 stainless steel anchor fastener kit.",
    features: ["AISI 304 stainless steel", "6 anchor sizes M6–M20", "Wedge, sleeve, drop-in types", "TÜV-tested load ratings"],
    specs: [
      { label: "Material", value: "AISI 304 Stainless Steel" }, { label: "Size Range", value: "M6–M20" },
      { label: "Tensile Load", value: "Up to 45 kN" }, { label: "MOQ", value: "100 kits" },
    ],
    image: "/images/product-4.svg", badge: "New", badgeZh: "新品", badgeEs: "Nuevo",
  },
  ...["Self-Tapping Screw Set", "Expansion Bolt Kit"].map((name, i) =>
    legacyPlaceholder(name, "Hardware", "Fasteners", "/images/product-" + (i + 11) + ".svg")),
];

const doorWindowHw = ["Door Handle Set", "Window Hinge Kit"].map((name, i) =>
  legacyPlaceholder(name, "Hardware", "Door & Window", "/images/product-" + (i + 13) + ".svg"));

const bathroomHw = ["Towel Rack Set", "Shower Hinge Kit"].map((name, i) =>
  legacyPlaceholder(name, "Hardware", "Bathroom", "/images/product-" + (i + 15) + ".svg"));

const fans = ["Industrial Stand Fan", "Wall-Mounted Fan"].map((name, i) =>
  legacyPlaceholder(name, "Appliances", "Fans", "/images/product-" + (i + 17) + ".svg"));

const heaters = ["Infrared Heater", "Oil-Filled Radiator"].map((name, i) =>
  legacyPlaceholder(name, "Appliances", "Heaters", "/images/product-" + (i + 19) + ".svg"));

const kitchenApps = ["Electric Kettle", "Blender Set"].map((name, i) =>
  legacyPlaceholder(name, "Appliances", "Kitchen", "/images/product-" + (i + 21) + ".svg"));

const deskLamps = ["LED Desk Lamp", "Architect Task Lamp"].map((name, i) =>
  legacyPlaceholder(name, "Lighting", "Desk Lamps", "/images/product-" + (i + 23) + ".svg"));

const pendantLights = [
  {
    id: "led-highbay-lt200", name: "Shengyu LED High Bay Light LT-200", nameZh: "盛煜 LED 高棚灯 LT-200",
    nameEs: "Shengyu Luz LED de Alta Bahía LT-200", subtitle: "Energy-efficient industrial lighting",
    category: "Lighting", subCategory: "Pendant Lights",
    description: "High-efficiency LED industrial pendant/high bay light delivering 150 lm/W. IP65-rated.",
    features: ["150 lm/W efficiency", "IP65 dustproof/waterproof", "Flicker-free 0-10V dimming", "50,000-hour lifespan"],
    specs: [
      { label: "Power", value: "100W / 150W / 200W" }, { label: "Efficacy", value: "150 lm/W" },
      { label: "CCT", value: "3000K–6500K" }, { label: "IP Rating", value: "IP65" },
    ],
    image: "/images/product-3.svg",
  },
  ...["Crystal Pendant Light", "Modern Dome Pendant"].map((name, i) =>
    legacyPlaceholder(name, "Lighting", "Pendant Lights", "/images/product-" + (i + 25) + ".svg")),
];

const floorLamps = ["Tripod Floor Lamp", "Arc Floor Lamp"].map((name, i) =>
  legacyPlaceholder(name, "Lighting", "Floor Lamps", "/images/product-" + (i + 27) + ".svg"));

const others = [{
  id: "industrial-degreaser-cc300", name: "Shengyu Industrial Multi-Surface Degreaser CC-300",
  nameZh: "盛煜 工业多表面除油剂 CC-300", nameEs: "Shengyu Industrial Desengrasante Multiuso CC-300",
  subtitle: "Heavy-duty cleaning for commercial and industrial use",
  category: "Others",
  description: "Professional-grade water-based degreaser. Biodegradable and phosphate-free.",
  features: ["Water-based, non-corrosive", "Rapid penetration <3 min", "Biodegradable — EU Ecolabel", "Dilutable 1:20"],
  specs: [
    { label: "pH", value: "12.5 ± 0.5" }, { label: "Dilution", value: "1:5 to 1:20" },
    { label: "Dwell Time", value: "2–3 min" }, { label: "Shelf Life", value: "24 months" },
  ],
  image: "/images/product-5.svg",
}];

// Assemble all static products (legacy format)
const staticProductsRaw: Record<string, unknown>[] = [
  ...sofas, ...beds, ...cabinets, ...adhesives, ...panels,
  ...fasteners, ...doorWindowHw, ...bathroomHw, ...fans, ...heaters,
  ...kitchenApps, ...deskLamps, ...pendantLights, ...floorLamps, ...others,
];

// Merge with products.json overrides
function mergeLegacyProducts(base: Record<string, unknown>[], overrides: Record<string, unknown>[]): Record<string, unknown>[] {
  const map = new Map<string, Record<string, unknown>>();
  for (const p of base) map.set(p.id as string, p);
  for (const p of overrides) map.set(p.id as string, p);
  return [...map.values()];
}

const productsRaw: Record<string, unknown>[] = mergeLegacyProducts(staticProductsRaw, productsJson as Record<string, unknown>[]);

// Apply promotion/bestseller flags to static products
(function applyFlags() {
  const promoIds = new Set(["sofa-01","sofa-03","bed-01","silicone-sealant-sg9000","anchor-kit-hw500","led-highbay-lt200","appliances-fans-industrial-stand-fan","lighting-pendant-lights-crystal-pendant-light"]);
  const bestIds = new Set(["sofa-01","silicone-sealant-sg9000","bed-01","anchor-kit-hw500","led-highbay-lt200","sofa-02","industrial-degreaser-cc300","building-materials-panels-mdf-board","sofa-05","hardware-door-&-window-door-handle-set"]);
  const priceData: Record<string, { price: string; sales: number; tag?: string }> = {
    "sofa-01":{price:"$89",sales:2847,tag:"热卖"},"sofa-02":{price:"$76",sales:2103,tag:"热卖"},"sofa-03":{price:"$95",sales:1892},
    "sofa-04":{price:"$68",sales:1654},"sofa-05":{price:"$112",sales:1521,tag:"新品"},"sofa-06":{price:"$83",sales:1356},
    "sofa-07":{price:"$79",sales:1201},"sofa-08":{price:"$91",sales:1045},"sofa-09":{price:"$74",sales:987},
    "sofa-10":{price:"$88",sales:845},"sofa-11":{price:"$67",sales:723},"sofa-12":{price:"$99",sales:612},
    "sofa-13":{price:"$82",sales:534},"sofa-14":{price:"$93",sales:456},"sofa-15":{price:"$71",sales:389},
    "bed-01":{price:"$156",sales:1934,tag:"热卖"},"bed-02":{price:"$138",sales:1456},"bed-03":{price:"$172",sales:1203},
    "bed-04":{price:"$145",sales:987},"bed-05":{price:"$198",sales:756},"bed-06":{price:"$163",sales:621},
    "silicone-sealant-sg9000":{price:"$12/L",sales:4521,tag:"爆款"},"anchor-kit-hw500":{price:"$28/kit",sales:3210,tag:"热卖"},
    "led-highbay-lt200":{price:"$45",sales:2678,tag:"新品"},"industrial-degreaser-cc300":{price:"$8/L",sales:1890},
  };
  const salesOpts = [1890,1456,2341,987,1654,2103,756,1320,2890,654,1123,876,1543,1987,723,432];
  let si = 0;
  const defaults: Record<string, string> = {Furniture:"$85","Building Materials":"$15",Hardware:"$22",Appliances:"$35",Lighting:"$28",Others:"$18"};
  for (const p of staticProductsRaw) {
    if (promoIds.has(p.id as string)) p.onPromotion = true;
    if (bestIds.has(p.id as string)) p.monthlyBest = true;
    const pd = priceData[p.id as string];
    if (pd) { p.price = pd.price; p.weeklySales = pd.sales; if (pd.tag) p.promoTag = pd.tag; }
    if (!p.price) p.price = defaults[p.category as string] || "$30";
    if (!p.weeklySales) { p.weeklySales = salesOpts[si % salesOpts.length]; si++; }
  }
})();

// ── Exports ──────────────────────────────────────────────
/** Legacy-format static products (will be migrated at runtime) */
export const products = productsRaw;

/** Export for kvSeedIfEmpty */
export { staticProductsRaw as staticProducts };

export const productCategories = [
  "All Products", "Furniture", "Building Materials", "Hardware", "Appliances", "Lighting", "Others",
];

export const subCategoryMap: Record<string, string[]> = {
  "Furniture": ["Sofas", "Beds", "Cabinets"],
  "Building Materials": ["Adhesives", "Panels"],
  "Hardware": ["Fasteners", "Door & Window", "Bathroom"],
  "Appliances": ["Fans", "Heaters", "Kitchen"],
  "Lighting": ["Desk Lamps", "Pendant Lights", "Floor Lamps"],
};
