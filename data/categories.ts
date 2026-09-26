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
  /** optional: group acts as a sub-category for product association */
  productSubCategory?: string;
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
  // Home & General Merchandise 家居百货 — aligned with 七夕优品汇 mini-program categories
  "Stationery Supplies": "STA",
  "Beauty & Skincare": "BSK",
  "Fashion Accessories": "FAC",
  "Toys & Entertainment": "TEN",
  "Hygiene Products": "HYG",
  "Hardware Supplies": "HWP",
  "Home Appliances": "HAP",
  "Sports & Outdoor": "SPO",
  "Plastic Products": "PLP",
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

// Category-level 2-letter prefix (keyed by productCategory)
export const CATEGORY_PREFIX: Record<string, string> = {
  // Home & General Merchandise 家居百货 — 11 peer categories (same level as Furniture/Lighting)
  "Stationery Supplies": "ST",
  "Beauty & Skincare": "BS", "Fashion Accessories": "FA", "Toys & Entertainment": "TE",
  "Hygiene Products": "HY", "Hardware Supplies": "HW", "Home Appliances": "HA",
  "Sports & Outdoor": "SO", "Plastic Products": "PL",
  // Legacy categories
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
  // ── 七夕优品汇 mini-program categories (9 non-liquid, strict order) ──
  {
    id: "stationery-supplies",
    name: "Stationery Supplies",
    nameZh: "文具用品",
    nameEs: "Papelería",
    productCategory: "Stationery Supplies",
    children: [],
  },
  {
    id: "beauty-skincare",
    name: "Beauty & Skincare",
    nameZh: "美妆护肤",
    nameEs: "Belleza y Cuidado de la Piel",
    productCategory: "Beauty & Skincare",
    children: [],
  },
  {
    id: "fashion-accessories",
    name: "Fashion Accessories",
    nameZh: "时尚饰品",
    nameEs: "Accesorios de Moda",
    productCategory: "Fashion Accessories",
    children: [],
  },
  {
    id: "toys-entertainment",
    name: "Toys & Entertainment",
    nameZh: "玩具文娱",
    nameEs: "Juguetes y Entretenimiento",
    productCategory: "Toys & Entertainment",
    children: [],
  },
  {
    id: "hygiene-products",
    name: "Hygiene Products",
    nameZh: "卫生用品",
    nameEs: "Productos de Higiene",
    productCategory: "Hygiene Products",
    children: [],
  },
  {
    id: "hardware-supplies",
    name: "Hardware Supplies",
    nameZh: "五金用品",
    nameEs: "Ferretería",
    productCategory: "Hardware Supplies",
    children: [],
  },
  {
    id: "quality-appliances",
    name: "Home Appliances",
    nameZh: "品质家电",
    nameEs: "Electrodomésticos",
    productCategory: "Home Appliances",
    children: [],
  },
  {
    id: "sports-outdoor",
    name: "Sports & Outdoor",
    nameZh: "运动户外",
    nameEs: "Deportes y Exterior",
    productCategory: "Sports & Outdoor",
    children: [],
  },
  {
    id: "plastic-products",
    name: "Plastic Products",
    nameZh: "塑料制品",
    nameEs: "Productos de Plástico",
    productCategory: "Plastic Products",
    children: [],
  },
  // ── Supplementary categories (kept, NOT in mini-program) ──
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
