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
    name: "Shenghan Industrial",
    shortName: "Shenghan",
    slogan: "Professional Building Materials & Adhesive Solutions",
    description:
      "Shenghan Industrial specializes in high-performance building materials and structural adhesives, delivering reliable solutions for construction projects worldwide.",
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
    phone: { display: "15163916007", href: "tel:15163916007" },
    email: "17861629313@163.com",
    address: {
      line1: "山东省临沂市河东区",
      line2: "Shandong, China",
    },
    hours: {
      weekday: "Mon – Fri: 9:00 AM – 6:00 PM",
      saturday: "Sat: 9:00 AM – 12:00 PM",
      note: "Closed Sundays & public holidays",
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
      name: "X (Twitter)",
      href: "https://x.com/henggu",
      icon: "twitter" as const,
      description: "Follow us on X",
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
      "High-performance building materials and structural adhesives — reliable solutions for global construction projects.",
    column1Title: "Products",
    column1Links: [
      { label: "Silicone Sealants", href: "/products" },
      { label: "Weather Sealants", href: "/products" },
      { label: "Stone Adhesives", href: "/products" },
      { label: "IG Sealants", href: "/products" },
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
