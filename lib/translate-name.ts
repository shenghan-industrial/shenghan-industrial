/* eslint-disable @typescript-eslint/no-require-imports, no-eval */
// Shared Chinese→English/Spanish translation for product names
// Extracted from app/api/admin/products/quick/route.ts
// Lazy-load pinyin — eval bypasses webpack bundling, skips on Edge/Cloudflare
function getPinyin() {
  try { return eval("require")("pinyin"); } catch { return null; }
}

interface KeywordResult {
  type: string;
  style: string;
  material: string;
}

export function analyzeChineseName(zhName: string): KeywordResult {
  let type = "", style = "", material = "";

  if (zhName.includes("沙发")) type = "Sofa";
  else if (zhName.includes("餐桌")) type = "Dining Table";
  else if (zhName.includes("床垫")) type = "Mattress";
  else if (zhName.includes("床")) type = "Bed";
  else if (zhName.includes("书桌") || zhName.includes("办公桌")) type = "Desk";
  else if (zhName.includes("茶几")) type = "Coffee Table";
  else if (zhName.includes("椅")) type = "Chair";
  else if (zhName.includes("柜")) type = "Cabinet";
  else if (zhName.includes("桌")) type = "Table";
  else if (zhName.includes("凳")) type = "Stool";
  else if (zhName.includes("架") || zhName.includes("货架")) type = "Shelf";
  else if (zhName.includes("镜")) type = "Mirror";
  else if (zhName.includes("帘") || zhName.includes("窗帘")) type = "Curtain";
  else if (zhName.includes("投光灯")) type = "Floodlight";
  else if (zhName.includes("工矿灯")) type = "Industrial Mining Lamp";
  else if (zhName.includes("壁灯")) type = "Wall Lamp";
  else if (zhName.includes("吸顶灯")) type = "Ceiling Light";
  else if (zhName.includes("筒灯")) type = "Downlight";
  else if (zhName.includes("射灯")) type = "Spotlight";
  else if (zhName.includes("轨道灯")) type = "Track Light";
  else if (zhName.includes("泛光灯")) type = "Floodlight";
  else if (zhName.includes("路灯")) type = "Street Light";
  else if (zhName.includes("庭院灯")) type = "Garden Light";
  else if (zhName.includes("地插灯")) type = "Ground Light";
  else if (zhName.includes("水底灯") || zhName.includes("水下灯")) type = "Underwater Light";
  else if (zhName.includes("洗墙灯")) type = "Wall Washer";
  else if (zhName.includes("线条灯") || zhName.includes("线形灯")) type = "Linear Light";
  else if (zhName.includes("面板灯")) type = "Panel Light";
  else if (zhName.includes("三防灯")) type = "Tri-proof Light";
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
  else if (zhName.includes("门窗") || zhName.includes("门")) type = "Door & Window";
  else if (zhName.includes("锁")) type = "Lock";
  else if (zhName.includes("把手")) type = "Handle";
  else if (zhName.includes("螺丝") || zhName.includes("螺栓")) type = "Fastener";
  else if (zhName.includes("厨房")) type = "Kitchen Appliance";

  // Style keywords (accumulative — multiple can match)
  const styles: string[] = [];
  if (zhName.includes("现代")) styles.push("Modern");
  if (zhName.includes("北欧")) styles.push("Nordic");
  if (zhName.includes("简约")) styles.push("Minimalist");
  if (zhName.includes("豪华") || zhName.includes("轻奢")) styles.push("Luxury");
  if (zhName.includes("欧式")) styles.push("European");
  if (zhName.includes("移动") || zhName.includes("便携")) styles.push("Portable");
  if (zhName.includes("应急")) styles.push("Emergency");
  if (zhName.includes("充电") || zhName.includes("可充")) styles.push("Rechargeable");
  if (zhName.includes("太阳能")) styles.push("Solar");
  if (zhName.includes("LED")) styles.push("LED");
  if (zhName.includes("工业")) styles.push("Industrial");
  if (zhName.includes("户外")) styles.push("Outdoor");
  if (zhName.includes("室内")) styles.push("Indoor");
  style = styles.join(" ");

  if (zhName.includes("真皮") || zhName.includes("牛皮")) material = "Genuine Leather";
  else if (zhName.includes("布艺") || zhName.includes("布")) material = "Fabric";
  else if (zhName.includes("实木") || zhName.includes("白橡") || zhName.includes("橡木") || zhName.includes("木")) material = "Solid Wood";
  else if (zhName.includes("不锈钢")) material = "Stainless Steel";
  else if (zhName.includes("铝合金")) material = "Aluminum";
  else if (zhName.includes("大理石") || zhName.includes("石材")) material = "Marble";

  return { type, style, material };
}

async function translateWithAI(zhName: string): Promise<{ en: string; es: string }> {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zhName }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { en: "", es: "" };
    return (await res.json()) as { en: string; es: string };
  } catch { return { en: "", es: "" }; }
}

// Cache AI translations to avoid repeated API calls
const aiCache: Record<string, string> = {};

export function genEnName(zhName: string, subCat: string): string {
  // Try keyword-based first, fall back to subCat generic
  const { type, style, material } = analyzeChineseName(zhName);
  const parts = [style, material, type].filter(Boolean);
  if (parts.length <= 1) {
    return "Premium " + (type || subCat || "Product") + " — " + zhName;
  }
  return parts.join(" ") + " — " + zhName;
}

export function genEsName(zhName: string, enName: string): string {
  const { type, style, material } = analyzeChineseName(zhName);
  const typeEsMap: Record<string, string> = {
    Sofa: "Sofá", "Dining Table": "Mesa de Comedor", Bed: "Cama", Desk: "Escritorio",
    "Coffee Table": "Mesa de Centro", Chair: "Silla", Cabinet: "Armario",
    "Desk Lamp": "Lámpara de Escritorio", "Pendant Light": "Lámpara Colgante",
    "Industrial Mining Lamp": "Lámpara de Minería Industrial",
    "Floor Lamp": "Lámpara de Pie", Light: "Lámpara", Fan: "Ventilador",
    Heater: "Calefactor", Sink: "Fregadero", Faucet: "Grifo",
    Adhesive: "Adhesivo", Panel: "Panel",
  };
  const styleEsMap: Record<string, string> = {
    Modern: "Moderno", Nordic: "Nórdico", Minimalist: "Minimalista",
    Luxury: "Lujo", European: "Europeo",
    Portable: "Portátil", Emergency: "Emergencia", Rechargeable: "Recargable",
    Solar: "Solar", LED: "LED", Industrial: "Industrial",
    Outdoor: "Exterior", Indoor: "Interior",
  };
  const materialEsMap: Record<string, string> = {
    "Genuine Leather": "Cuero Genuino", Fabric: "Tela", "Solid Wood": "Madera Maciza",
    "Stainless Steel": "Acero Inoxidable", Aluminum: "Aluminio", Marble: "Mármol",
  };
  const esType = typeEsMap[type] || type;
  const esParts = [styleEsMap[style] || style, materialEsMap[material] || material, esType].filter(Boolean);
  if (esParts.length <= 1) return enName;
  return esParts.join(" ");
}

/** AI-powered translation — call this for better results */
export async function translateWithAIFallback(zhName: string): Promise<{ en: string; es: string }> {
  const cacheKey = `ai:${zhName}`;
  if (aiCache[cacheKey]) return JSON.parse(aiCache[cacheKey]) as { en: string; es: string };

  const result = await translateWithAI(zhName);
  const fallback = {
    en: result.en || genEnName(zhName, ""),
    es: result.es || genEsName(zhName, result.en || ""),
  };
  aiCache[cacheKey] = JSON.stringify(fallback);
  return fallback;
}

export const catZhMap: Record<string, string> = {
  Furniture: "家具", "Building Materials": "建材", Hardware: "五金",
  Appliances: "家电", Lighting: "灯具", Others: "其他",
};

export const catEnFromZh: Record<string, string> = {
  "家具": "Furniture", "建材": "Building Materials", "五金": "Hardware",
  "家电": "Appliances", "灯具": "Lighting", "其他": "Others",
};

export const subZhMap: Record<string, string> = {
  Sofas: "沙发", Beds: "床", Mattresses: "床垫", Cabinets: "柜子",
  Adhesives: "胶粘剂", Panels: "板材", Fasteners: "紧固件",
  "Door & Window": "门窗配件", Bathroom: "卫浴配件",
  Fans: "电风扇", Heaters: "取暖器", Kitchen: "厨房小家电",
  "Desk Lamps": "台灯", "Pendant Lights": "吊灯", "Floor Lamps": "落地灯",
};

// Reverse maps: Chinese → English
const subEnFromZh: Record<string, string> = {};
for (const [en, zh] of Object.entries(subZhMap)) subEnFromZh[zh] = en;
for (const [en, zh] of Object.entries(catZhMap)) { if (!catEnFromZh[zh]) catEnFromZh[zh] = en; }

/** Auto-translate category: Chinese name → { name, nameZh, nameEs, productCategory } */
export function translateCategory(zh: string): { name: string; nameEs: string; productCategory: string } {
  // 1. Dictionary match
  let name = catEnFromZh[zh];

  // 2. Extract keywords from Chinese
  if (!name) {
    const { type, style, material } = analyzeChineseName(zh);
    const parts = [style, material, type].filter(Boolean);
    if (parts.length > 0) {
      name = parts.join(" ");
    } else {
      // 3. Pinyin fallback
      const py = getPinyin();
      name = py ? py(zh, { style: py.STYLE_NORMAL, heteronym: false })
        .map((item: string[]) => item[0].charAt(0).toUpperCase() + item[0].slice(1))
        .join("") : zh;
    }
  }

  const nameEs = catEsMap[name] || name;
  let productCategory = name.replace(/[^a-zA-Z0-9]/g, "");
  if (!productCategory) productCategory = zh;
  return { name, nameEs, productCategory };
}

const catEsMap: Record<string, string> = {
  Furniture: "Muebles", Lighting: "Iluminación", "Building Materials": "Materiales de Construcción",
  Hardware: "Ferretería", Appliances: "Electrodomésticos", Others: "Otros",
};

/** Auto-translate subcategory: Chinese name → { name, nameZh, nameEs, productSubCategory } */
export function translateSubCategory(zh: string, catProductCategory: string): { name: string; nameEs: string; productSubCategory: string } {
  // 1. Exact dictionary match
  let name = subEnFromZh[zh];

  // 2. Extract known keywords from Chinese
  if (!name) {
    const { type, style, material } = analyzeChineseName(zh);
    const parts = [style, material, type].filter(Boolean);
    if (parts.length > 0) {
      name = parts.join(" ");
    } else {
      // 3. Pinyin fallback — convert Chinese to readable English
      const py = getPinyin();
      name = py ? py(zh, { style: py.STYLE_NORMAL, heteronym: false })
        .map((item: string[]) => item[0].charAt(0).toUpperCase() + item[0].slice(1))
        .join("") : zh;
    }
  }

  const subEsMap: Record<string, string> = {
    Sofas: "Sofás", Beds: "Camas", Mattresses: "Colchones", Mattress: "Colchón",
    Cabinets: "Armarios", Cabinet: "Armario", Bed: "Cama", Sofa: "Sofá",
    "Dining Table": "Mesa de Comedor", "Coffee Table": "Mesa de Centro",
    Desk: "Escritorio", Chair: "Silla", Table: "Mesa", Stool: "Taburete",
    Shelf: "Estante", Mirror: "Espejo", Curtain: "Cortina",
    Light: "Lámpara", Floodlight: "Reflector", "Industrial Mining Lamp": "Lámpara de Minería Industrial",
    "Wall Lamp": "Lámpara de Pared", "Ceiling Light": "Lámpara de Techo",
    Downlight: "Downlight", Spotlight: "Foco", "Track Light": "Riel de Luz",
    "Street Light": "Farola", "Garden Light": "Lámpara de Jardín",
    "Ground Light": "Lámpara de Suelo", "Underwater Light": "Lámpara Subacuática",
    "Wall Washer": "Bañador de Pared", "Linear Light": "Luz Lineal",
    "Panel Light": "Panel LED", "Tri-proof Light": "Luz Tri-proof",
    "Desk Lamp": "Lámpara de Escritorio",
    "Pendant Light": "Lámpara Colgante", "Floor Lamp": "Lámpara de Pie",
    Fan: "Ventilador", Heater: "Calefactor", Sink: "Fregadero", Faucet: "Grifo",
    Adhesive: "Adhesivo", Panel: "Panel", Fastener: "Sujetador",
    "Door & Window": "Puertas y Ventanas", Lock: "Cerradura", Handle: "Manija",
    Bathroom: "Accesorios de Baño", "Kitchen Appliance": "Electrodoméstico de Cocina",
    Adhesives: "Adhesivos y Selladores", Panels: "Paneles de Ingeniería",
    Fasteners: "Sujetadores", Fans: "Ventiladores", Heaters: "Calefactores",
    Kitchen: "Electrodomésticos de Cocina",
    "Pendant Lights": "Lámparas Colgantes", "Floor Lamps": "Lámparas de Pie",
  };
  const nameEs = subEsMap[name] || name;
  let productSubCategory = name.replace(/[^a-zA-Z0-9& ]/g, "").trim();
  if (!productSubCategory) productSubCategory = zh;
  return { name, nameEs, productSubCategory };
}

/** AI-powered category translation — best quality, use this for new categories */
export async function translateCategoryAI(zh: string): Promise<{ name: string; nameEs: string; productCategory: string }> {
  const { en, es } = await translateWithAIFallback(zh);
  const name = en || catEnFromZh[zh] || zh;
  const nameEs = es || name;
  const productCategory = name.replace(/[^a-zA-Z0-9]/g, "") || zh;
  return { name, nameEs, productCategory };
}

/** AI-powered subcategory translation */
export async function translateSubCategoryAI(zh: string): Promise<{ name: string; nameEs: string; productSubCategory: string }> {
  const { en, es } = await translateWithAIFallback(zh);
  const name = en || zh;
  const nameEs = es || name;
  const productSubCategory = name.replace(/[^a-zA-Z0-9& ]/g, "").trim() || zh;
  return { name, nameEs, productSubCategory };
}
