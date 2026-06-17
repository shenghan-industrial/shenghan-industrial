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
    name: "Shengyu Industrial",
    shortName: "Shengyu",
    slogan: "Global Home & Building Materials Manufacturer | One-stop Supply Chain Partner",
    sloganZh: "全球家居建材制造商 | 一站式供应链合作伙伴",
    sloganEs: "Fabricante Global de Materiales para el Hogar y Construcción | Socio de Cadena de Suministro Integral",
    description:
      "Shengyu Industrial is a global manufacturer and one-stop supply chain partner. Factory direct pricing, reliable logistics, full compliance, and global after-sales — serving importers, contractors, and B2B buyers worldwide.",
    logo: {
      text: "S", // fallback letter if no image logo
      /** Set to a path like "/images/logo.svg" to use an image logo */
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
    phone: { display: "+86 138 0013 8000", href: "https://wa.me/8613800138000" },
    email: "shenghanind@163.com",
    address: {
      line1: "Linyi, Shandong, China",
      line1Zh: "中国山东省临沂市",
      line1Es: "Linyi, Shandong, China",
      line2: "Global Warehouses: Europe · SE Asia · CIS",
      line2Zh: "全球仓储网络：欧洲 · 东南亚 · 独联体",
      line2Es: "Almacenes Globales: Europa · Sudeste Asiático · CEI",
      line3: "山东省临沂市 · 全球仓储：欧洲·东南亚·独联体",
    },
    hours: {
      weekday: "24/7 Multilingual Support",
      weekdayZh: "24小时多语言支持",
      weekdayEs: "Soporte Multilingüe 24/7",
      saturday: "7 Languages · No Time Zone Gaps",
      saturdayZh: "7种语言 · 无时差服务",
      saturdayEs: "7 Idiomas · Sin Brechas Horarias",
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
      href: "https://wa.me/8613800138000",
      icon: "whatsapp" as const,
      description: "Chat on WhatsApp",
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
    { value: 25, suffix: "+", label: "Certifications" },
    { value: 3200, suffix: "+", label: "Projects Completed" },
    { value: 50000, suffix: " tons", label: "Annual Capacity" },
  ],

  // --- Footer ---
  footer: {
    tagline:
      "Global Home & Building Materials Manufacturer | One-stop Supply Chain Partner — factory direct pricing, reliable logistics, and full after-sales support for B2B buyers worldwide.",
    taglineZh:
      "全球家居建材制造商 | 一站式供应链合作伙伴 — 工厂直供价格、可靠物流、完善的售后服务，服务全球B2B采购商。",
    taglineEs:
      "Fabricante Global de Materiales para el Hogar y Construcción | Socio de Cadena de Suministro Integral — precios directos de fábrica, logística confiable y soporte postventa completo para compradores B2B en todo el mundo.",
    column1Title: "Products",
    column1Links: [
      { label: "Furniture", href: "/products" },
      { label: "Building Materials", href: "/products" },
      { label: "Hardware", href: "/products" },
      { label: "Appliances", href: "/products" },
      { label: "Lighting", href: "/products" },
      { label: "Others", href: "/products" },
    ],
    column2Title: "Company",
    column2Links: [
      { label: "About Us", href: "/about" },
      { label: "Certifications", href: "/about" },
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
