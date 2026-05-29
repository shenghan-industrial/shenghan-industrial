export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  image: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "silicone-sealant-9000",
    name: "Shenghan SG-9000 Silicone Structural Sealant",
    subtitle: "For super high-rise curtain wall applications",
    category: "Silicone Structural Sealant",
    description:
      "Two-component silicone structural sealant designed for super high-rise building curtain walls. Exceptional weather resistance and structural strength, certified for building sealant applications worldwide. Ideal for glass, aluminum, and stone curtain wall structural bonding.",
    features: [
      "Ultra-high tensile strength ≥ 1.2 MPa",
      "50-year design life with superior aging resistance",
      "Two-component curing system — 30% faster installation",
      "Zero VOC emissions, environmentally friendly",
    ],
    specs: [
      { label: "Tensile Strength", value: "≥1.2 MPa" },
      { label: "Elongation at Break", value: "≥400%" },
      { label: "Tack-free Time", value: "≤45 min" },
      { label: "Service Temperature", value: "-50°C ~ +150°C" },
      { label: "Packaging", value: "Part A 20L / Part B 200L" },
      { label: "Color", value: "Black/White/Grey/Custom" },
    ],
    image: "/images/product-1.svg",
    badge: "Best Seller",
  },
  {
    id: "weather-sealant-7000",
    name: "Shenghan WS-7000 Weatherproof Sealant",
    subtitle: "Professional joint sealing for building envelopes",
    category: "Weatherproof Sealant",
    description:
      "One-component RTV silicone weatherproof sealant designed for building joint sealing. Outstanding weather resistance and ±50% joint movement capability. Widely used in precast concrete, metal curtain walls, and glass curtain wall joint sealing.",
    features: [
      "±50% movement capability for extreme deformation",
      "One-component, ready to use — no mixing required",
      "Excellent UV and weathering resistance",
      "Primerless adhesion to most substrates",
    ],
    specs: [
      { label: "Movement Capability", value: "±50%" },
      { label: "Tensile Strength", value: "≥0.8 MPa" },
      { label: "Tack-free Time", value: "≤30 min" },
      { label: "Service Temperature", value: "-40°C ~ +120°C" },
      { label: "Packaging", value: "300ml / 500ml cartridges" },
      { label: "Color", value: "Black/White/Grey/Brown" },
    ],
    image: "/images/product-2.svg",
  },
  {
    id: "stone-adhesive-5000",
    name: "Shenghan SA-5000 Epoxy Stone Adhesive",
    subtitle: "For stone curtain wall anchoring systems",
    category: "Stone Adhesive",
    description:
      "Two-component epoxy resin structural adhesive designed for stone curtain wall anchoring systems. High bond strength with excellent water and chemical resistance — the preferred choice for stone cladding installation.",
    features: [
      "Shear strength ≥ 12 MPa, far exceeding industry standards",
      "Water, acid, and alkali resistant for wet environments",
      "Thixotropic — no sagging during application",
      "Curing shrinkage below 0.1%",
    ],
    specs: [
      { label: "Shear Strength", value: "≥12 MPa" },
      { label: "Pot Life", value: "≥30 min" },
      { label: "Cure Time", value: "24h @ 25°C" },
      { label: "HDT", value: "≥80°C" },
      { label: "Mix Ratio", value: "A:B = 2:1 (by weight)" },
      { label: "Color", value: "Cream/Grey" },
    ],
    image: "/images/product-3.svg",
    badge: "New Launch",
  },
  {
    id: "insulating-glass-8000",
    name: "Shenghan IG-8000 Insulating Glass Sealant",
    subtitle: "Secondary seal for insulating glass units",
    category: "IG Sealant",
    description:
      "Two-component silicone insulating glass sealant designed as secondary seal for IG units. Extremely low moisture vapor transmission and excellent gas tightness ensure long-term performance stability of insulating glass.",
    features: [
      "Ultra-low MVTR for stable dew point performance",
      "Chemical cure — no shrinkage, reliable long-term seal",
      "Excellent compatibility with PIB primary seal",
      "EN 1279-4 certified for European markets",
    ],
    specs: [
      { label: "MVTR", value: "≤15 g/m²·d" },
      { label: "Tensile Strength", value: "≥0.6 MPa" },
      { label: "Pot Life", value: "≥20 min" },
      { label: "Hardness", value: "30-45 Shore A" },
      { label: "Packaging", value: "Part A 20L / Part B 20L" },
      { label: "Color", value: "Black/Grey" },
    ],
    image: "/images/product-4.svg",
  },
];

export const productCategories = [
  "All Products",
  "Silicone Structural Sealant",
  "Weatherproof Sealant",
  "Stone Adhesive",
  "IG Sealant",
];
