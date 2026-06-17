// Shared Chinese→English/Spanish translation for product names
// Extracted from app/api/admin/products/quick/route.ts

interface KeywordResult {
  type: string;
  style: string;
  material: string;
}

export function analyzeChineseName(zhName: string): KeywordResult {
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
  else if (zhName.includes("轻奢")) style = "Luxury";

  if (zhName.includes("真皮") || zhName.includes("牛皮")) material = "Genuine Leather";
  else if (zhName.includes("布艺") || zhName.includes("布")) material = "Fabric";
  else if (zhName.includes("实木") || zhName.includes("白橡") || zhName.includes("橡木") || zhName.includes("木")) material = "Solid Wood";
  else if (zhName.includes("不锈钢")) material = "Stainless Steel";
  else if (zhName.includes("铝合金")) material = "Aluminum";
  else if (zhName.includes("大理石") || zhName.includes("石材")) material = "Marble";

  return { type, style, material };
}

export function genEnName(zhName: string, subCat: string): string {
  const { type, style, material } = analyzeChineseName(zhName);
  const parts = [style, material, type || subCat || "Product"].filter(Boolean);
  if (parts.length <= 1) {
    return "Premium " + (subCat || "Product") + " — " + zhName.substring(0, 20);
  }
  return parts.join(" ") + " — " + zhName.substring(0, 15);
}

export function genEsName(zhName: string, enName: string): string {
  // Simple ES name generation — mirrors EN structure with Spanish keywords
  const { type, style, material } = analyzeChineseName(zhName);
  const typeEsMap: Record<string, string> = {
    Sofa: "Sofá", "Dining Table": "Mesa de Comedor", Bed: "Cama", Desk: "Escritorio",
    "Coffee Table": "Mesa de Centro", Chair: "Silla", Cabinet: "Armario",
    "Desk Lamp": "Lámpara de Escritorio", "Pendant Light": "Lámpara Colgante",
    "Floor Lamp": "Lámpara de Pie", Light: "Lámpara", Fan: "Ventilador",
    Heater: "Calefactor", Sink: "Fregadero", Faucet: "Grifo",
    Adhesive: "Adhesivo", Panel: "Panel",
  };
  const styleEsMap: Record<string, string> = {
    Modern: "Moderno", Nordic: "Nórdico", Minimalist: "Minimalista",
    Luxury: "Lujo", European: "Europeo",
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
  const name = catEnFromZh[zh] || zh.replace(/\s+/g, "").substring(0, 30);
  const nameEs = catEsMap[name] || name;
  let productCategory = name.replace(/[^a-zA-Z0-9]/g, "");
  if (!productCategory) productCategory = zh.replace(/\s+/g, "").substring(0, 30);
  return { name, nameEs, productCategory };
}

const catEsMap: Record<string, string> = {
  Furniture: "Muebles", Lighting: "Iluminación", "Building Materials": "Materiales de Construcción",
  Hardware: "Ferretería", Appliances: "Electrodomésticos", Others: "Otros",
};

/** Auto-translate subcategory: Chinese name → { name, nameZh, nameEs, productSubCategory } */
export function translateSubCategory(zh: string, catProductCategory: string): { name: string; nameEs: string; productSubCategory: string } {
  const name = subEnFromZh[zh] || zh.replace(/[^\x00-\x7F]/g, "").replace(/\s+/g, " ").trim().substring(0, 30) || zh.replace(/\s+/g, "").substring(0, 30);
  const subEsMap: Record<string, string> = {
    Sofas: "Sofás", Beds: "Camas", Cabinets: "Armarios",
    Adhesives: "Adhesivos y Selladores", Panels: "Paneles de Ingeniería",
    Fasteners: "Sujetadores", "Door & Window": "Puertas y Ventanas",
    Bathroom: "Accesorios de Baño", Fans: "Ventiladores", Heaters: "Calefactores",
    Kitchen: "Electrodomésticos de Cocina", "Desk Lamps": "Lámparas de Escritorio",
    "Pendant Lights": "Lámparas Colgantes", "Floor Lamps": "Lámparas de Pie",
  };
  const nameEs = subEsMap[name] || name;
  let productSubCategory = name.replace(/[^a-zA-Z0-9& ]/g, "").trim();
  if (!productSubCategory) productSubCategory = zh.replace(/\s+/g, "").substring(0, 30);
  return { name, nameEs, productSubCategory };
}
