import {
  Phone,
  Mail,
  MapPin,
  type LucideIcon,
} from "lucide-react";

// ============================================================
//  EDIT THIS FILE to customize your brand, navigation, footer,
//  contact info, and social media links.
// ============================================================

export const siteConfig = {
  // --- Brand ---
  brand: {
    name: "DEXOREN",
    shortName: "DEXOREN",
    slogan: "Home & General Merchandise Supply Chain | 8,000㎡ Showroom & 30,000+ SKUs",
    sloganZh: "家居百货一站式供应链 | 8,000㎡展厅 · 30,000+单品",
    sloganEs: "Cadena de Suministro de Artículos del Hogar | 8.000 m² Showroom y 30.000+ SKUs",
    description:
      "DEXOREN is a one-stop home & general merchandise supply chain partner. From our 8,000㎡ wholesale showroom and integrated warehouse, we supply 30,000+ household SKUs across stationery, beauty & skincare, fashion accessories, toys, hygiene products, hardware supplies, home appliances, sports & outdoor, plastic products, furniture and lighting. Factory-direct pricing, reliable export logistics, and multilingual support for importers, retailers and B2B buyers worldwide.",
    logo: {
      text: "D",
      image: undefined as string | undefined,
    },
  },

  // --- Media ---
  media: {
    /** Replace with your YouTube/Vimeo embed URL, e.g. "https://www.youtube.com/embed/YOUR_VIDEO_ID" */
    factoryVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },

  // --- Navigation ---
  navigation: [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  // --- Contact ---
  contact: {
    phone: { display: "+86 151 6391 6007", href: "https://wa.me/8615163916007" },
    email: "sales@shenghanindustrial.com",
    address: {
      line1: "Linyi, Shandong, China",
      line1Zh: "中国山东省临沂市",
      line1Es: "Linyi, Shandong, China",
      line2: "Warehouses: SE Asia (Bangkok · Kuala Lumpur) · Middle East (Dubai)",
      line2Zh: "全球仓储网络：东南亚（曼谷 · 吉隆坡） · 中东（迪拜）",
      line2Es: "Almacenes: Sudeste Asiático (Bangkok · Kuala Lumpur) · Medio Oriente (Dubai)",
      line3: "山东省临沂市 · 仓储：东南亚 · 中东",
    },
    hours: {
      weekday: "Fast Reply — Usually Within 12h (GMT+8)",
      weekdayZh: "快速回复 — 通常 12 小时内（GMT+8）",
      weekdayEs: "Respuesta Rápida — Normalmente en 12h (GMT+8)",
      saturday: "Support in EN · 中文 · Español",
      saturdayZh: "支持 英 · 中 · 西 三语",
      saturdayEs: "Soporte en EN · 中文 · Español",
      note: "Global After-Sales Service",
      noteZh: "全球售后服务",
      noteEs: "Servicio Postventa Global",
    },
  },

  // --- Social Media ---
  socialLinks: [
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/henggu",
      icon: "linkedin" as const,
      description: "Follow us on LinkedIn",
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@henggu",
      icon: "youtube" as const,
      description: "Watch product videos",
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/8615163916007",
      icon: "whatsapp" as const,
      description: "Chat on WhatsApp",
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@tony.wang526",
      icon: "tiktok" as const,
      description: "Follow us on TikTok",
    },
    {
      name: "Facebook",
      href: "https://facebook.com/henggu",
      icon: "facebook" as const,
      description: "Like our page",
    },
  ],

  // --- Statistics (shown in Hero + StatsCounter) ---
  stats: [
    { value: 30000, suffix: "+", label: "Home Goods SKUs" },
    { value: 8000, suffix: " m²", label: "Wholesale Showroom" },
    { value: 30, suffix: "+", label: "Export Markets" },
  ],

  // --- Footer ---
  footer: {
    tagline:
      "DEXOREN — your one-stop home & general merchandise supply chain partner. 8,000㎡ wholesale showroom, 30,000+ SKUs, factory-direct pricing and reliable export logistics for B2B buyers worldwide.",
    taglineZh:
      "DEXOREN——您的家居百货一站式供应链合作伙伴。8,000㎡批发展厅、30,000+单品、工厂直供价格与可靠出口物流，服务全球B2B采购商。",
    taglineEs:
      "DEXOREN — su socio integral de la cadena de suministro de artículos del hogar. Showroom mayorista de 8.000 m², más de 30.000 SKUs, precios directos de fábrica y logística de exportación confiable para compradores B2B en todo el mundo.",
    column1Title: "Products",
    column1Links: [
      { label: "Home & General Merchandise", href: "/products" },
      { label: "Kitchen & Dining", href: "/products" },
      { label: "Cleaning & Storage", href: "/products" },
      { label: "Home Textiles & Décor", href: "/products" },
      { label: "Furniture", href: "/products" },
      { label: "Lighting & Hardware", href: "/products" },
    ],
    column2Title: "Company",
    column2Links: [
      { label: "About Us", href: "/about" },
      { label: "Certifications", href: "/certifications" },
      { label: "Trade Terms", href: "/trade-terms" },
      { label: "Contact", href: "/contact" },
    ],
    legalLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
} as const;

// --- Helper: get icon component for social links ---
export function getContactIcon(icon: string): LucideIcon {
  const map: Record<string, LucideIcon> = {
    phone: Phone,
    mail: Mail,
    map: MapPin,
  };
  return map[icon] ?? Phone;
}
