export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  subCategory?: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  image: string;
  badge?: string;
}

function placeholder(name: string, cat: string, sub: string, img: string, badge?: string): Product {
  return {
    id: `${cat}-${sub}-${name}`.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    name,
    subtitle: `${sub} — factory direct quality`,
    category: cat,
    subCategory: sub,
    description: `Shenghan Industrial ${sub.toLowerCase()} — ${name}. Manufactured in our own facilities with strict quality control. Suitable for residential, commercial, and export markets.`,
    features: [
      "Premium materials and expert workmanship",
      "ISO-certified production process",
      "Custom specifications available",
      "Export-standard packaging",
    ],
    specs: [
      { label: "Material", value: "Premium grade" },
      { label: "MOQ", value: "Negotiable" },
      { label: "Lead Time", value: "25–35 days" },
      { label: "Customization", value: "Available" },
    ],
    image: img,
    badge,
  };
}

// ======== 家居/家具 (Furniture) ========

// --- 沙发 (Sofas) ---
const sofas: Product[] = Array.from({ length: 15 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    id: `sofa-${n}`,
    name: `Kaidi Feiluo Sofa ${n}`,
    subtitle: "Premium upholstered sofa — factory direct",
    category: "Furniture",
    subCategory: "Sofas",
    description: "Kaidi Feiluo designer sofa with premium fabric/leather upholstery, high-resilience foam, and solid wood frame. Available in custom configurations.",
    features: [
      "High-density foam with premium fabric or genuine leather",
      "Solid hardwood frame with reinforced joinery",
      "Customizable configurations — 2-seater, 3-seater, L-shape",
      "15+ designer colorways available",
    ],
    specs: [
      { label: "Frame Material", value: "Solid hardwood + plywood" },
      { label: "Upholstery", value: "Fabric / PU / Genuine Leather" },
      { label: "Foam Density", value: "≥35 kg/m³ (seat)" },
      { label: "Seat Depth", value: "55–65 cm" },
      { label: "MOQ", value: "10 units per design" },
      { label: "Lead Time", value: "25–35 days" },
    ],
    image: `/images/products/sofas/${i + 1}.png`,
    badge: i === 0 ? "Best Seller" : undefined,
  };
});

// --- 床 (Beds) ---
const beds: Product[] = Array.from({ length: 6 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    id: `bed-${n}`,
    name: `Kaidi Feiluo Bed ${n}`,
    subtitle: "Luxurious upholstered bed — factory direct",
    category: "Furniture",
    subCategory: "Beds",
    description: "Kaidi Feiluo premium soft bed with elegant upholstered headboard and solid wood slatted base. Queen, King, and custom sizes.",
    features: [
      "Soft-touch fabric or leather-upholstered headboard",
      "Solid wood slatted base with center support",
      "Modern minimalist to luxury wingback styles",
      "Tool-free slat assembly",
    ],
    specs: [
      { label: "Sizes", value: "1.5m / 1.8m / 2.0m (custom)" },
      { label: "Headboard", value: "Fabric / PU Leather / Velvet" },
      { label: "Frame", value: "Solid wood + MDF" },
      { label: "Slats", value: "Solid birch, 12 pcs" },
      { label: "MOQ", value: "10 units per design" },
      { label: "Lead Time", value: "30–40 days" },
    ],
    image: `/images/products/beds/${i + 1}.png`,
    badge: i === 0 ? "New" : undefined,
  };
});

// --- 柜子 (Cabinets) ---
const cabinets: Product[] = ["Display Cabinet", "TV Stand Cabinet", "Storage Cabinet"].map((name, i) =>
  placeholder(name, "Furniture", "Cabinets", `/images/product-${i + 6}.svg`, i === 0 ? "New" : undefined)
);

// ======== 建材 (Building Materials) ========

// --- 胶 (Adhesives) ---
const adhesives: Product[] = [
  {
    id: "silicone-sealant-sg9000",
    name: "Shenghan SG-9000 Silicone Structural Sealant",
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
  },
  ...["Weatherproof Sealant WS-7000", "Epoxy Stone Adhesive SA-5000"].map((name, i) =>
    placeholder(name, "Building Materials", "Adhesives", `/images/product-${i + 3}.svg`)
  ),
];

// --- 板材 (Panels) ---
const panels: Product[] = ["MDF Board", "Plywood Panel", "Particle Board"].map((name, i) =>
  placeholder(name, "Building Materials", "Panels", `/images/product-${i + 8}.svg`)
);

// ======== 五金 (Hardware) ========

// --- 紧固件 (Fasteners) ---
const fasteners: Product[] = [
  {
    id: "anchor-kit-hw500",
    name: "Shenghan Heavy-Duty Anchor Fastener Kit HW-500",
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
  },
  ...["Self-Tapping Screw Set", "Expansion Bolt Kit"].map((name, i) =>
    placeholder(name, "Hardware", "Fasteners", `/images/product-${i + 11}.svg`)
  ),
];

// --- 门窗配件 (Door & Window Hardware) ---
const doorWindowHw: Product[] = ["Door Handle Set", "Window Hinge Kit"].map((name, i) =>
  placeholder(name, "Hardware", "Door & Window", `/images/product-${i + 13}.svg`)
);

// --- 卫浴配件 (Bathroom Accessories) ---
const bathroomHw: Product[] = ["Towel Rack Set", "Shower Hinge Kit"].map((name, i) =>
  placeholder(name, "Hardware", "Bathroom", `/images/product-${i + 15}.svg`)
);

// ======== 家电 (Appliances) ========

// --- 电风扇 (Fans) ---
const fans: Product[] = ["Industrial Stand Fan", "Wall-Mounted Fan"].map((name, i) =>
  placeholder(name, "Appliances", "Fans", `/images/product-${i + 17}.svg`)
);

// --- 取暖器 (Heaters) ---
const heaters: Product[] = ["Infrared Heater", "Oil-Filled Radiator"].map((name, i) =>
  placeholder(name, "Appliances", "Heaters", `/images/product-${i + 19}.svg`)
);

// --- 厨房小家电 (Kitchen Appliances) ---
const kitchenApps: Product[] = ["Electric Kettle", "Blender Set"].map((name, i) =>
  placeholder(name, "Appliances", "Kitchen", `/images/product-${i + 21}.svg`)
);

// ======== 照明 (Lighting) ========

// --- 台灯 (Desk Lamps) ---
const deskLamps: Product[] = ["LED Desk Lamp", "Architect Task Lamp"].map((name, i) =>
  placeholder(name, "Lighting", "Desk Lamps", `/images/product-${i + 23}.svg`)
);

// --- 吊灯 (Pendant Lights) ---
const pendantLights: Product[] = [
  {
    id: "led-highbay-lt200",
    name: "Shenghan LED High Bay Light LT-200",
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
    placeholder(name, "Lighting", "Pendant Lights", `/images/product-${i + 25}.svg`)
  ),
];

// --- 落地灯 (Floor Lamps) ---
const floorLamps: Product[] = ["Tripod Floor Lamp", "Arc Floor Lamp"].map((name, i) =>
  placeholder(name, "Lighting", "Floor Lamps", `/images/product-${i + 27}.svg`)
);

// ======== 其他 (Others) ========
const others: Product[] = [
  {
    id: "industrial-degreaser-cc300",
    name: "Shenghan Industrial Multi-Surface Degreaser CC-300",
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

// 二级分类映射（key 为父分类，value 为子分类列表）
export const subCategoryMap: Record<string, string[]> = {
  "Furniture": ["Sofas", "Beds", "Cabinets"],
  "Building Materials": ["Adhesives", "Panels"],
  "Hardware": ["Fasteners", "Door & Window", "Bathroom"],
  "Appliances": ["Fans", "Heaters", "Kitchen"],
  "Lighting": ["Desk Lamps", "Pendant Lights", "Floor Lamps"],
};
