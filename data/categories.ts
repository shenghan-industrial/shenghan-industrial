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
// Furniture has special series+material encoding
export const SUB_CATEGORY_CODES: Record<string, string> = {
  // Furniture 家具
  "Sofas": "SOF", "Beds": "BED", "Cabinets": "CAB",
  // Lighting 灯具
  "Desk Lamps": "DSK", "Pendant Lights": "PEN", "Floor Lamps": "FLR",
  "Portable Lights": "PTL", "Industrial Lights": "IND", "Floodlights": "FLD",
  "Solar Lights": "SOL", "Street Lights": "STL",
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
      { id: "cabinets", name: "Cabinets", nameZh: "柜子", nameEs: "Armarios", productSubCategory: "Cabinets", productCategory: "Furniture" },
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
        children: [
          { id: "desk-lamps", name: "Desk Lamps", nameZh: "台灯", nameEs: "Lámparas de Escritorio", productSubCategory: "Desk Lamps", productCategory: "Lighting" },
          { id: "pendant-lights", name: "Pendant Lights", nameZh: "吊灯", nameEs: "Lámparas Colgantes", productSubCategory: "Pendant Lights", productCategory: "Lighting" },
          { id: "floor-lamps", name: "Floor Lamps", nameZh: "落地灯", nameEs: "Lámparas de Pie", productSubCategory: "Floor Lamps", productCategory: "Lighting" },
        ],
      },
      {
        id: "outdoor-lighting",
        name: "Outdoor Lighting",
        nameZh: "室外灯具",
        nameEs: "Iluminación Exterior",
        children: [],
      },
    ],
  },
  {
    id: "building-materials",
    name: "Building Materials",
    nameZh: "建材类",
    nameEs: "Materiales de Construcción",
    productCategory: "Building Materials",
    children: [
      { id: "adhesives", name: "Adhesives & Sealants", nameZh: "胶粘剂", nameEs: "Adhesivos y Selladores", productSubCategory: "Adhesives", productCategory: "Building Materials" },
      { id: "panels", name: "Engineered Panels", nameZh: "板材", nameEs: "Paneles de Ingeniería", productSubCategory: "Panels", productCategory: "Building Materials" },
    ],
  },
  {
    id: "hardware",
    name: "Hardware",
    nameZh: "五金类",
    nameEs: "Ferretería",
    productCategory: "Hardware",
    children: [
      { id: "fasteners", name: "Fasteners", nameZh: "紧固件", nameEs: "Sujetadores", productSubCategory: "Fasteners", productCategory: "Hardware" },
      { id: "door-window", name: "Door & Window", nameZh: "门窗五金", nameEs: "Puertas y Ventanas", productSubCategory: "Door & Window", productCategory: "Hardware" },
      { id: "bathroom", name: "Bathroom", nameZh: "卫浴五金", nameEs: "Accesorios de Baño", productSubCategory: "Bathroom", productCategory: "Hardware" },
    ],
  },
  {
    id: "appliances",
    name: "Home Appliances",
    nameZh: "家电类",
    nameEs: "Electrodomésticos",
    productCategory: "Appliances",
    children: [
      { id: "fans", name: "Fans", nameZh: "风扇", nameEs: "Ventiladores", productSubCategory: "Fans", productCategory: "Appliances" },
      { id: "heaters", name: "Heaters", nameZh: "取暖器", nameEs: "Calefactores", productSubCategory: "Heaters", productCategory: "Appliances" },
      { id: "kitchen", name: "Kitchen Appliances", nameZh: "厨房电器", nameEs: "Electrodomésticos de Cocina", productSubCategory: "Kitchen", productCategory: "Appliances" },
    ],
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
