export interface SubCategory {
  id: string;
  name: string;
  nameZh: string;
  nameEs?: string;
  /** maps to existing Product.subCategory */
  productSubCategory: string;
  /** maps to existing Product.category */
  productCategory: string;
}

export interface CategoryGroup {
  id: string;
  name: string;
  nameZh: string;
  nameEs?: string;
  children: SubCategory[];
}

export interface Category {
  id: string;
  name: string;
  nameZh: string;
  nameEs?: string;
  icon?: string;
  groups?: CategoryGroup[];
  children?: SubCategory[];
  /** maps to existing Product.category for filtering */
  productCategory: string;
}

// ── Sub-category 3-letter code map ─────────────────────────
// Used for SKU/model generation: SY-{code}-{seq}
export const SUB_CATEGORY_CODES: Record<string, string> = {
  // Furniture 家具
  "Sofas": "SOF", "Beds": "BED", "Mattresses": "MAT",
  // Lighting 灯具 — Outdoor
  "Portable Emergency Rechargeable Light": "PEL",
  "Industrial Mining Lamp": "IML",
  "Floodlight": "FLD",
  "Solar Floodlight": "SFL",
  "Solar Street Light": "SSL",
  // Building Materials 建材
  "Adhesives": "ADH", "Panels": "PNL",
  // Hardware 五金
  "Fasteners": "FAS", "Door & Window": "DRW", "Bathroom": "BTH",
  // Appliances 家电
  "Fans": "FAN", "Heaters": "HTR", "Kitchen": "KIT",
  // Others 其他
  "Others": "OTH",
};

// Category-level 2-letter prefix
export const CATEGORY_PREFIX: Record<string, string> = {
  "Furniture": "JJ", "Lighting": "DJ", "Building Materials": "JC",
  "Hardware": "WJ", "Appliances": "JD", "Others": "QT",
};

/** Get 3-letter sub-category code, falls back to auto-generation */
export function getSubCategoryCode(subCategory: string): string {
  return SUB_CATEGORY_CODES[subCategory] || subCategory.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "X");
}

/** Get model number prefix: SY-{3-letter-code} */
export function getModelPrefix(subCategory: string): string {
  return `SY-${getSubCategoryCode(subCategory)}`;
}

export const categories: Category[] = [
  {
    id: "furniture",
    name: "Furniture",
    nameZh: "家具类",
    nameEs: "Muebles",
    productCategory: "Furniture",
    children: [
      { id: "sofas", name: "Sofas", nameZh: "沙发", nameEs: "Sofás", productSubCategory: "Sofas", productCategory: "Furniture" },
      { id: "beds", name: "Beds", nameZh: "床", nameEs: "Camas", productSubCategory: "Beds", productCategory: "Furniture" },
      { id: "mattresses", name: "Mattresses", nameZh: "床垫", nameEs: "Colchones", productSubCategory: "Mattresses", productCategory: "Furniture" },
    ],
  },
  {
    id: "lighting",
    name: "Lighting",
    nameZh: "灯具类",
    nameEs: "Iluminación",
    productCategory: "Lighting",
    groups: [
      {
        id: "indoor-lighting",
        name: "Indoor Lighting",
        nameZh: "室内灯具",
        nameEs: "Iluminación Interior",
        children: [],
      },
      {
        id: "outdoor-lighting",
        name: "Outdoor Lighting",
        nameZh: "室外灯具",
        nameEs: "Iluminación Exterior",
        children: [
          { id: "portable-emergency", name: "Mobile Emergency Charging Light", nameZh: "移动应急充电灯", nameEs: "Lámpara de emergencia portátil", productSubCategory: "Portable Emergency Rechargeable Light", productCategory: "Lighting" },
          { id: "industrial-mining", name: "Industrial Mining Lamp", nameZh: "工矿灯", nameEs: "Lámpara de Minería Industrial", productSubCategory: "Industrial Mining Lamp", productCategory: "Lighting" },
          { id: "floodlight", name: "Floodlight", nameZh: "投光灯", nameEs: "Lámpara de proyección", productSubCategory: "Floodlight", productCategory: "Lighting" },
          { id: "solar-flood", name: "Solar Floodlight", nameZh: "太阳能投光灯", nameEs: "Lámpara de luz solar", productSubCategory: "Solar Floodlight", productCategory: "Lighting" },
          { id: "solar-street", name: "Solar Street Light", nameZh: "太阳能路灯", nameEs: "Farol de luz solar", productSubCategory: "Solar Street Light", productCategory: "Lighting" },
        ],
      },
    ],
  },
  {
    id: "building-materials",
    name: "Building Materials",
    nameZh: "建材类",
    nameEs: "Materiales de Construcción",
    productCategory: "Building Materials",
    children: [],
  },
  {
    id: "hardware",
    name: "Hardware",
    nameZh: "五金类",
    nameEs: "Ferretería",
    productCategory: "Hardware",
    children: [],
  },
  {
    id: "appliances",
    name: "Home Appliances",
    nameZh: "家电类",
    nameEs: "Electrodomésticos",
    productCategory: "Appliances",
    children: [],
  },
  {
    id: "others",
    name: "Others",
    nameZh: "其他",
    nameEs: "Otros",
    productCategory: "Others",
    children: [],
  },
];

/** Get all products matching a category (including all its sub-categories) */
export function getCategoryProductIds(cat: Category): string[] {
  const ids: string[] = [];
  if (cat.children) {
    for (const child of cat.children) {
      ids.push(...getSubCategoryProductIds(child));
    }
  }
  if (cat.groups) {
    for (const group of cat.groups) {
      for (const child of group.children) {
        ids.push(...getSubCategoryProductIds(child));
      }
    }
  }
  return ids;
}

function getSubCategoryProductIds(sub: SubCategory): string[] {
  if (!sub.productCategory || !sub.productSubCategory) return [];
  return [sub.productCategory, sub.productSubCategory] as any;
}

/** For search: get all subcategory names for suggestions */
export function getAllSearchSuggestions(): { name: string; nameZh: string; category: string; categoryZh: string }[] {
  const suggestions: { name: string; nameZh: string; category: string; categoryZh: string }[] = [];
  for (const cat of categories) {
    if (cat.children) {
      for (const child of cat.children) {
        suggestions.push({ name: child.name, nameZh: child.nameZh, category: cat.name, categoryZh: cat.nameZh });
      }
    }
    if (cat.groups) {
      for (const group of cat.groups) {
        for (const child of group.children) {
          suggestions.push({ name: child.name, nameZh: child.nameZh, category: `${cat.name} - ${group.name}`, categoryZh: `${cat.nameZh}-${group.nameZh}` });
        }
      }
    }
  }
  return suggestions;
}
