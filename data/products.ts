export interface Product {
  id: string;
  name: string;
  nameZh?: string;
  nameEs?: string;
  subtitle: string;
  subtitleZh?: string;
  subtitleEs?: string;
  category: string;
  subCategory?: string;
  description: string;
  descriptionZh?: string;
  descriptionEs?: string;
  features: string[];
  featuresZh?: string[];
  featuresEs?: string[];
  specs: { label: string; value: string }[];
  specsZh?: { label: string; value: string }[];
  specsEs?: { label: string; value: string }[];
  image: string;
  badge?: string;
  badgeZh?: string;
  badgeEs?: string;
  partnerId?: string;
  onPromotion?: boolean;
  monthlyBest?: boolean;
  price?: string;
  weeklySales?: number;
  promoTag?: string;
}

const categoryPartnerMap: Record<string, string> = {
  Furniture: "kaidi-feiluo",
  "Building Materials": "hengda-materials",
  Hardware: "jinying-hardware",
  Appliances: "aolis-home",
  Lighting: "brightlux-lighting",
  Others: "shenghan-industrial",
};

// Subcategory name translations
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

function placeholder(name: string, cat: string, sub: string, img: string, badge?: string): Product {
  const zhName = name + " — " + (subZhMap[sub] || sub);
  const esName = name + " — " + (subEsMap[sub] || sub);
  return {
    id: (cat + "-" + sub + "-" + name).toLowerCase().replace(/[^a-z0-9]/g, "-"),
    name,
    nameZh: zhName,
    nameEs: esName,
    subtitle: sub + " — factory direct quality",
    subtitleZh: (subZhMap[sub] || sub) + " — 工厂直供品质",
    subtitleEs: (subEsMap[sub] || sub) + " — calidad directa de fábrica",
    category: cat,
    subCategory: sub,
    partnerId: categoryPartnerMap[cat] || "shenghan-industrial",
    description: "Shenghan Industrial " + sub.toLowerCase() + " — " + name + ". Manufactured in our own facilities with strict quality control. Suitable for residential, commercial, and export markets.",
    descriptionZh: "盛瀚实业 " + (subZhMap[sub] || sub) + " — " + zhName + "。自有工厂制造，严格品控。适用于住宅、商业及出口市场。",
    descriptionEs: "Shenghan Industrial " + (subEsMap[sub] || sub).toLowerCase() + " — " + esName + ". Fabricado en nuestras propias instalaciones con estricto control de calidad. Adecuado para mercados residenciales, comerciales y de exportación.",
    features: [
      "Premium materials and expert workmanship",
      "ISO-certified production process",
      "Custom specifications available",
      "Export-standard packaging",
    ],
    featuresZh: [
      "优质材料与精湛工艺",
      "ISO认证生产流程",
      "支持定制规格",
      "出口标准包装",
    ],
    featuresEs: [
      "Materiales premium y mano de obra experta",
      "Proceso de producción certificado ISO",
      "Especificaciones personalizadas disponibles",
      "Embalaje estándar de exportación",
    ],
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
    image: img,
    badge,
    badgeZh: badge === "Best Seller" ? "热卖" : badge === "New" ? "新品" : badge,
    badgeEs: badge === "Best Seller" ? "Más Vendido" : badge === "New" ? "Nuevo" : badge,
  };
}

// ======== 家居/家具 (Furniture) ========

// --- 沙发 (Sofas) ---
const sofas: Product[] = Array.from({ length: 15 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    id: "sofa-" + n,
    name: "Kaidi Feiluo Sofa " + n,
    nameZh: "凯迪斐洛沙发 " + n,
    nameEs: "Kaidi Feiluo Sofá " + n,
    subtitle: "Premium upholstered sofa — factory direct",
    subtitleZh: "高端软体沙发 — 工厂直供",
    subtitleEs: "Sofá tapizado premium — directo de fábrica",
    category: "Furniture",
    subCategory: "Sofas",
    description: "Kaidi Feiluo designer sofa with premium fabric/leather upholstery, high-resilience foam, and solid wood frame. Available in custom configurations.",
    descriptionZh: "凯迪斐洛设计师沙发，采用高端布艺/真皮面料、高回弹海绵和实木框架。支持定制配置。",
    descriptionEs: "Sofá de diseño Kaidi Feiluo con tapizado premium de tela/cuero, espuma de alta resiliencia y estructura de madera maciza. Disponible en configuraciones personalizadas.",
    features: [
      "High-density foam with premium fabric or genuine leather",
      "Solid hardwood frame with reinforced joinery",
      "Customizable configurations — 2-seater, 3-seater, L-shape",
      "15+ designer colorways available",
    ],
    featuresZh: [
      "高密度海绵搭配高端布艺或真皮面料",
      "实木硬木框架，加固榫接工艺",
      "可定制配置 — 双人位、三人位、L型",
      "15+ 设计师配色可选",
    ],
    featuresEs: [
      "Espuma de alta densidad con tela premium o cuero genuino",
      "Estructura de madera dura maciza con carpintería reforzada",
      "Configuraciones personalizables — 2 plazas, 3 plazas, forma L",
      "Más de 15 colores de diseño disponibles",
    ],
    specs: [
      { label: "Frame Material", value: "Solid hardwood + plywood" },
      { label: "Upholstery", value: "Fabric / PU / Genuine Leather" },
      { label: "Foam Density", value: "≥35 kg/m³ (seat)" },
      { label: "Seat Depth", value: "55–65 cm" },
      { label: "MOQ", value: "10 units per design" },
      { label: "Lead Time", value: "25–35 days" },
    ],
    specsZh: [
      { label: "框架材质", value: "实木硬木 + 胶合板" },
      { label: "面料", value: "布艺 / PU / 真皮" },
      { label: "海绵密度", value: "≥35 kg/m³（座面）" },
      { label: "座深", value: "55–65 cm" },
      { label: "起订量", value: "每款10件起" },
      { label: "交期", value: "25–35 天" },
    ],
    specsEs: [
      { label: "Material del Marco", value: "Madera dura maciza + contrachapado" },
      { label: "Tapicería", value: "Tela / PU / Cuero Genuino" },
      { label: "Densidad de Espuma", value: "≥35 kg/m³ (asiento)" },
      { label: "Profundidad de Asiento", value: "55–65 cm" },
      { label: "Cantidad Mínima", value: "10 unidades por diseño" },
      { label: "Plazo de Entrega", value: "25–35 días" },
    ],
    partnerId: "kaidi-feiluo",
    image: "/images/products/sofas/" + (i + 1) + ".webp",
    badge: i === 0 ? "Best Seller" : undefined,
    badgeZh: i === 0 ? "热卖" : undefined,
    badgeEs: i === 0 ? "Más Vendido" : undefined,
  };
});

// --- 床 (Beds) ---
const beds: Product[] = Array.from({ length: 6 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    id: "bed-" + n,
    name: "Kaidi Feiluo Bed " + n,
    nameZh: "凯迪斐洛床 " + n,
    nameEs: "Kaidi Feiluo Cama " + n,
    subtitle: "Luxurious upholstered bed — factory direct",
    subtitleZh: "豪华软体床 — 工厂直供",
    subtitleEs: "Cama tapizada de lujo — directo de fábrica",
    category: "Furniture",
    subCategory: "Beds",
    description: "Kaidi Feiluo premium soft bed with elegant upholstered headboard and solid wood slatted base. Queen, King, and custom sizes.",
    descriptionZh: "凯迪斐洛高端软床，优雅布艺/皮革床头板搭配实木排骨架底座。支持1.5m/1.8m/2.0m及定制尺寸。",
    descriptionEs: "Cama suave premium Kaidi Feiluo con elegante cabecero tapizado y base de listones de madera maciza. Tamaños Queen, King y personalizados.",
    features: [
      "Soft-touch fabric or leather-upholstered headboard",
      "Solid wood slatted base with center support",
      "Modern minimalist to luxury wingback styles",
      "Tool-free slat assembly",
    ],
    featuresZh: [
      "亲肤面料或皮革软包床头板",
      "实木排骨架底座，带中心支撑",
      "现代简约至奢华翼背款式",
      "免工具安装排骨架",
    ],
    featuresEs: [
      "Cabecero tapizado en tela suave o cuero",
      "Base de listones de madera maciza con soporte central",
      "Estilos desde minimalista moderno hasta wingback de lujo",
      "Montaje de listones sin herramientas",
    ],
    specs: [
      { label: "Sizes", value: "1.5m / 1.8m / 2.0m (custom)" },
      { label: "Headboard", value: "Fabric / PU Leather / Velvet" },
      { label: "Frame", value: "Solid wood + MDF" },
      { label: "Slats", value: "Solid birch, 12 pcs" },
      { label: "MOQ", value: "10 units per design" },
      { label: "Lead Time", value: "30–40 days" },
    ],
    specsZh: [
      { label: "尺寸", value: "1.5m / 1.8m / 2.0m（可定制）" },
      { label: "床头材质", value: "布艺 / PU皮革 / 丝绒" },
      { label: "框架", value: "实木 + MDF" },
      { label: "排骨架", value: "桦木实木，12根" },
      { label: "起订量", value: "每款10件起" },
      { label: "交期", value: "30–40 天" },
    ],
    specsEs: [
      { label: "Tamaños", value: "1.5m / 1.8m / 2.0m (personalizado)" },
      { label: "Cabecero", value: "Tela / Cuero PU / Terciopelo" },
      { label: "Estructura", value: "Madera maciza + MDF" },
      { label: "Listones", value: "Abedul macizo, 12 uds" },
      { label: "Cantidad Mínima", value: "10 unidades por diseño" },
      { label: "Plazo de Entrega", value: "30–40 días" },
    ],
    partnerId: "kaidi-feiluo",
    image: "/images/products/beds/" + (i + 1) + ".webp",
    badge: i === 0 ? "New" : undefined,
    badgeZh: i === 0 ? "新品" : undefined,
    badgeEs: i === 0 ? "Nuevo" : undefined,
  };
});

// --- 柜子 (Cabinets) ---
const cabinets: Product[] = ["Display Cabinet", "TV Stand Cabinet", "Storage Cabinet"].map((name, i) =>
  placeholder(name, "Furniture", "Cabinets", "/images/product-" + (i + 6) + ".svg", i === 0 ? "New" : undefined)
);

// ======== 建材 (Building Materials) ========

// --- 胶 (Adhesives) ---
const adhesives: Product[] = [
  {
    id: "silicone-sealant-sg9000",
    name: "Shenghan SG-9000 Silicone Structural Sealant",
    nameZh: "盛瀚 SG-9000 硅酮结构密封胶",
    nameEs: "Shenghan SG-9000 Sellador Estructural de Silicona",
    partnerId: "hengda-materials",
    subtitle: "For high-rise curtain wall structural bonding",
    category: "Building Materials",
    subCategory: "Adhesives",
    description: "Two-component silicone structural sealant for high-rise building curtain walls. Exceptional weather resistance and structural strength.",
    features: [
      "Tensile strength ≥ 1.2 MPa for structural applications",
      "50-year design life with superior UV/aging resistance",
      "Two-component fast-cure system",
      "Zero VOC emissions",
    ],
    specs: [
      { label: "Tensile Strength", value: "≥1.2 MPa" },
      { label: "Elongation at Break", value: "≥400%" },
      { label: "Tack-free Time", value: "≤45 min" },
      { label: "Service Temperature", value: "-50°C ~ +150°C" },
      { label: "Packaging", value: "Part A 20L / Part B 200L" },
      { label: "Color", value: "Black / White / Grey / Custom" },
    ],
    image: "/images/product-2.svg",
    badge: "Best Seller",
    badgeZh: "热卖",
    badgeEs: "Más Vendido",
  },
  ...["Weatherproof Sealant WS-7000", "Epoxy Stone Adhesive SA-5000"].map((name, i) =>
    placeholder(name, "Building Materials", "Adhesives", "/images/product-" + (i + 3) + ".svg")
  ),
];

// --- 板材 (Panels) ---
const panels: Product[] = ["MDF Board", "Plywood Panel", "Particle Board"].map((name, i) =>
  placeholder(name, "Building Materials", "Panels", "/images/product-" + (i + 8) + ".svg")
);

// ======== 五金 (Hardware) ========

// --- 紧固件 (Fasteners) ---
const fasteners: Product[] = [
  {
    id: "anchor-kit-hw500",
    name: "Shenghan Heavy-Duty Anchor Fastener Kit HW-500",
    nameZh: "盛瀚 重型锚固套件 HW-500",
    nameEs: "Shenghan Kit de Anclaje de Alta Resistencia HW-500",
    partnerId: "jinying-hardware",
    subtitle: "Professional anchoring for concrete and masonry",
    category: "Hardware",
    subCategory: "Fasteners",
    description: "High-strength AISI 304 stainless steel anchor fastener kit for structural anchoring in concrete, brick, and masonry.",
    features: [
      "AISI 304 stainless steel — corrosion resistant",
      "6 anchor sizes from M6 to M20",
      "Wedge, sleeve, and drop-in types",
      "TÜV-tested load ratings with 4× safety factor",
    ],
    specs: [
      { label: "Material", value: "AISI 304 Stainless Steel" },
      { label: "Size Range", value: "M6 / M8 / M10 / M12 / M16 / M20" },
      { label: "Tensile Load", value: "Up to 45 kN" },
      { label: "Types", value: "Wedge / Sleeve / Drop-in" },
      { label: "Packaging", value: "200 pcs per kit" },
      { label: "MOQ", value: "100 kits" },
    ],
    image: "/images/product-4.svg",
    badge: "New",
    badgeZh: "新品",
    badgeEs: "Nuevo",
  },
  ...["Self-Tapping Screw Set", "Expansion Bolt Kit"].map((name, i) =>
    placeholder(name, "Hardware", "Fasteners", "/images/product-" + (i + 11) + ".svg")
  ),
];

// --- 门窗配件 (Door & Window Hardware) ---
const doorWindowHw: Product[] = ["Door Handle Set", "Window Hinge Kit"].map((name, i) =>
  placeholder(name, "Hardware", "Door & Window", "/images/product-" + (i + 13) + ".svg")
);

// --- 卫浴配件 (Bathroom Accessories) ---
const bathroomHw: Product[] = ["Towel Rack Set", "Shower Hinge Kit"].map((name, i) =>
  placeholder(name, "Hardware", "Bathroom", "/images/product-" + (i + 15) + ".svg")
);

// ======== 家电 (Appliances) ========

// --- 电风扇 (Fans) ---
const fans: Product[] = ["Industrial Stand Fan", "Wall-Mounted Fan"].map((name, i) =>
  placeholder(name, "Appliances", "Fans", "/images/product-" + (i + 17) + ".svg")
);

// --- 取暖器 (Heaters) ---
const heaters: Product[] = ["Infrared Heater", "Oil-Filled Radiator"].map((name, i) =>
  placeholder(name, "Appliances", "Heaters", "/images/product-" + (i + 19) + ".svg")
);

// --- 厨房小家电 (Kitchen Appliances) ---
const kitchenApps: Product[] = ["Electric Kettle", "Blender Set"].map((name, i) =>
  placeholder(name, "Appliances", "Kitchen", "/images/product-" + (i + 21) + ".svg")
);

// ======== 照明 (Lighting) ========

// --- 台灯 (Desk Lamps) ---
const deskLamps: Product[] = ["LED Desk Lamp", "Architect Task Lamp"].map((name, i) =>
  placeholder(name, "Lighting", "Desk Lamps", "/images/product-" + (i + 23) + ".svg")
);

// --- 吊灯 (Pendant Lights) ---
const pendantLights: Product[] = [
  {
    id: "led-highbay-lt200",
    name: "Shenghan LED High Bay Light LT-200",
    nameZh: "盛瀚 LED 高棚灯 LT-200",
    nameEs: "Shenghan Luz LED de Alta Bahía LT-200",
    partnerId: "brightlux-lighting",
    subtitle: "Energy-efficient industrial lighting",
    category: "Lighting",
    subCategory: "Pendant Lights",
    description: "High-efficiency LED industrial pendant/high bay light delivering 150 lm/W. IP65-rated for harsh environments.",
    features: [
      "150 lm/W ultra-high efficiency",
      "IP65 dustproof and waterproof",
      "Flicker-free driver with 0-10V dimming",
      "50,000-hour rated lifespan",
    ],
    specs: [
      { label: "Power", value: "100W / 150W / 200W" },
      { label: "Efficacy", value: "150 lm/W" },
      { label: "CCT", value: "3000K / 4000K / 5000K / 6500K" },
      { label: "CRI", value: "Ra ≥ 80" },
      { label: "Beam Angle", value: "90° / 120°" },
      { label: "IP Rating", value: "IP65" },
    ],
    image: "/images/product-3.svg",
  },
  ...["Crystal Pendant Light", "Modern Dome Pendant"].map((name, i) =>
    placeholder(name, "Lighting", "Pendant Lights", "/images/product-" + (i + 25) + ".svg")
  ),
];

// --- 落地灯 (Floor Lamps) ---
const floorLamps: Product[] = ["Tripod Floor Lamp", "Arc Floor Lamp"].map((name, i) =>
  placeholder(name, "Lighting", "Floor Lamps", "/images/product-" + (i + 27) + ".svg")
);

// ======== 其他 (Others) ========
const others: Product[] = [
  {
    id: "industrial-degreaser-cc300",
    name: "Shenghan Industrial Multi-Surface Degreaser CC-300",
    nameZh: "盛瀚 工业多表面除油剂 CC-300",
    nameEs: "Shenghan Industrial Desengrasante Multiuso CC-300",
    partnerId: "shenghan-industrial",
    subtitle: "Heavy-duty cleaning for commercial and industrial use",
    category: "Others",
    description: "Professional-grade water-based degreaser for heavy-duty cleaning. Biodegradable and phosphate-free.",
    features: [
      "Water-based, non-corrosive formula",
      "Rapid penetration — under 3 minutes",
      "Biodegradable — meets EU Ecolabel",
      "Dilutable concentrate up to 1:20",
    ],
    specs: [
      { label: "pH", value: "12.5 ± 0.5" },
      { label: "Dilution", value: "1:5 to 1:20" },
      { label: "Dwell Time", value: "2–3 min" },
      { label: "Packaging", value: "1L / 5L / 25L" },
      { label: "Shelf Life", value: "24 months" },
      { label: "Certification", value: "EU Ecolabel / SGS" },
    ],
    image: "/images/product-5.svg",
  },
];

// ======== 全部产品 ========
export const products: Product[] = [
  ...sofas,
  ...beds,
  ...cabinets,
  ...adhesives,
  ...panels,
  ...fasteners,
  ...doorWindowHw,
  ...bathroomHw,
  ...fans,
  ...heaters,
  ...kitchenApps,
  ...deskLamps,
  ...pendantLights,
  ...floorLamps,
  ...others,
];

// Apply promotion, monthly best seller flags, price, sales data
(function applyFlags() {
  const byId = (id: string) => products.find((p) => p.id === id);

  const promoIds = [
    "sofa-01", "sofa-03", "bed-01",
    "silicone-sealant-sg9000", "anchor-kit-hw500",
    "led-highbay-lt200",
    "appliances-fans-industrial-stand-fan",
    "lighting-pendant-lights-crystal-pendant-light",
  ];
  promoIds.forEach((id) => {
    const p = byId(id);
    if (p) p.onPromotion = true;
  });

  const bestIds = [
    "sofa-01", "silicone-sealant-sg9000", "bed-01",
    "anchor-kit-hw500", "led-highbay-lt200", "sofa-02",
    "industrial-degreaser-cc300",
    "building-materials-panels-mdf-board",
    "sofa-05",
    "hardware-door-&-window-door-handle-set",
  ];
  bestIds.forEach((id) => {
    const p = byId(id);
    if (p) p.monthlyBest = true;
  });

  const priceData: Record<string, { price: string; sales: number; tag?: string }> = {
    "sofa-01": { price: "$89", sales: 2847, tag: "热卖" },
    "sofa-02": { price: "$76", sales: 2103, tag: "热卖" },
    "sofa-03": { price: "$95", sales: 1892 },
    "sofa-04": { price: "$68", sales: 1654 },
    "sofa-05": { price: "$112", sales: 1521, tag: "新品" },
    "sofa-06": { price: "$83", sales: 1356 },
    "sofa-07": { price: "$79", sales: 1201 },
    "sofa-08": { price: "$91", sales: 1045 },
    "sofa-09": { price: "$74", sales: 987 },
    "sofa-10": { price: "$88", sales: 845 },
    "sofa-11": { price: "$67", sales: 723 },
    "sofa-12": { price: "$99", sales: 612 },
    "sofa-13": { price: "$82", sales: 534 },
    "sofa-14": { price: "$93", sales: 456 },
    "sofa-15": { price: "$71", sales: 389 },
    "bed-01": { price: "$156", sales: 1934, tag: "热卖" },
    "bed-02": { price: "$138", sales: 1456 },
    "bed-03": { price: "$172", sales: 1203 },
    "bed-04": { price: "$145", sales: 987 },
    "bed-05": { price: "$198", sales: 756 },
    "bed-06": { price: "$163", sales: 621 },
    "silicone-sealant-sg9000": { price: "$12/L", sales: 4521, tag: "爆款" },
    "anchor-kit-hw500": { price: "$28/kit", sales: 3210, tag: "热卖" },
    "led-highbay-lt200": { price: "$45", sales: 2678, tag: "新品" },
    "industrial-degreaser-cc300": { price: "$8/L", sales: 1890 },
  };

  for (const [id, data] of Object.entries(priceData)) {
    const p = byId(id);
    if (p) {
      p.price = data.price;
      p.weeklySales = data.sales;
      if (data.tag) p.promoTag = data.tag;
    }
  }

  const salesOptions = [1890, 1456, 2341, 987, 1654, 2103, 756, 1320, 2890, 654, 1123, 876, 1543, 1987, 723, 432];
  let si = 0;
  const defaultPrices: Record<string, string> = {
    Furniture: "$85", "Building Materials": "$15", Hardware: "$22",
    Appliances: "$35", Lighting: "$28", Others: "$18",
  };
  for (const p of products) {
    if (!p.price) p.price = defaultPrices[p.category] || "$30";
    if (!p.weeklySales) {
      p.weeklySales = salesOptions[si % salesOptions.length];
      si++;
    }
  }
})();

// ======== 分类体系 ========
export const productCategories = [
  "All Products",
  "Furniture",
  "Building Materials",
  "Hardware",
  "Appliances",
  "Lighting",
  "Others",
];

// 二级分类映射
export const subCategoryMap: Record<string, string[]> = {
  "Furniture": ["Sofas", "Beds", "Cabinets"],
  "Building Materials": ["Adhesives", "Panels"],
  "Hardware": ["Fasteners", "Door & Window", "Bathroom"],
  "Appliances": ["Fans", "Heaters", "Kitchen"],
  "Lighting": ["Desk Lamps", "Pendant Lights", "Floor Lamps"],
};
