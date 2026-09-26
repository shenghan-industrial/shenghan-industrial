import type { Locale } from "@/lib/localizeProduct";
import type { MultiLangText } from "./products";

/**
 * Locale-keyed text where th / ms / fr are optional — legacy entries only
 * carry en / zh / es and the UI falls back to English.
 */
type LocalizedText = MultiLangText | Record<Locale, string>;

export interface Certification {
  id: string;
  /** Short badge name, e.g. "CE" */
  code: string;
  name: MultiLangText;
  fullName: MultiLangText;
  desc: MultiLangText;
  region: MultiLangText;
  appliesTo: MultiLangText;
  /** key into the page iconMap */
  icon: string;
}

export const certifications: Certification[] = [
  {
    id: "iso9001",
    code: "ISO 9001",
    name: {
      en: "ISO 9001",
      zh: "ISO 9001",
      es: "ISO 9001",
    },
    fullName: {
      en: "ISO 9001:2015 — Quality Management System",
      zh: "ISO 9001:2015 — 质量管理体系",
      es: "ISO 9001:2015 — Sistema de Gestión de Calidad",
    },
    desc: {
      en: "The world's most recognized quality management standard. It guarantees consistent product quality and continuous improvement across every production line.",
      zh: "全球最权威的质量管理体系标准，确保每条产线产品品质稳定一致，并持续改进。",
      es: "El estándar de gestión de calidad más reconocido del mundo. Garantiza calidad constante y mejora continua en cada línea de producción.",
    },
    region: { en: "Global", zh: "全球", es: "Global" },
    appliesTo: {
      en: "All product categories",
      zh: "全部产品类目",
      es: "Todas las categorías",
    },
    icon: "award",
  },
  {
    id: "iso14001",
    code: "ISO 14001",
    name: {
      en: "ISO 14001",
      zh: "ISO 14001",
      es: "ISO 14001",
    },
    fullName: {
      en: "ISO 14001:2015 — Environmental Management",
      zh: "ISO 14001:2015 — 环境管理体系",
      es: "ISO 14001:2015 — Gestión Ambiental",
    },
    desc: {
      en: "Demonstrates our commitment to minimizing environmental impact through systematic resource management and pollution prevention.",
      zh: "以体系化的资源管理与污染预防，践行对环境影响的持续削减承诺。",
      es: "Demuestra nuestro compromiso de minimizar el impacto ambiental mediante gestión sistemática de recursos y prevención de la contaminación.",
    },
    region: { en: "Global", zh: "全球", es: "Global" },
    appliesTo: {
      en: "All product categories",
      zh: "全部产品类目",
      es: "Todas las categorías",
    },
    icon: "leaf",
  },
  {
    id: "ce",
    code: "CE",
    name: {
      en: "CE Marking",
      zh: "CE 认证",
      es: "Marcado CE",
    },
    fullName: {
      en: "CE — EU Conformity Marking",
      zh: "CE — 欧盟符合性标志",
      es: "CE — Marcado de Conformidad UE",
    },
    desc: {
      en: "Mandatory conformity marking for the European Economic Area, certifying compliance with EU health, safety and environmental protection standards.",
      zh: "进入欧洲经济区的强制符合性标志，证明产品符合欧盟健康、安全与环保法规要求。",
      es: "Marcado obligatorio para el Espacio Económico Europeo que certifica el cumplimiento de normas de salud, seguridad y protección ambiental de la UE.",
    },
    region: { en: "European Union", zh: "欧盟", es: "Unión Europea" },
    appliesTo: {
      en: "Appliances, Lighting, Electronics, Toys",
      zh: "家电 · 灯具 · 电子 · 玩具",
      es: "Electrodomésticos, Iluminación, Electrónica, Juguetes",
    },
    icon: "shield",
  },
  {
    id: "rohs",
    code: "RoHS",
    name: {
      en: "RoHS",
      zh: "RoHS",
      es: "RoHS",
    },
    fullName: {
      en: "RoHS — Restriction of Hazardous Substances",
      zh: "RoHS — 有害物质限制指令",
      es: "RoHS — Restricción de Sustancias Peligrosas",
    },
    desc: {
      en: "Restricts the use of specific hazardous materials in electrical and electronic equipment for safer products and a cleaner environment.",
      zh: "限制电子电气设备中有害物质的使用，让产品更安全、环境更清洁。",
      es: "Restringe el uso de sustancias peligrosas en equipos eléctricos y electrónicos para productos más seguros.",
    },
    region: { en: "EU / Global", zh: "欧盟 / 全球", es: "UE / Global" },
    appliesTo: {
      en: "Appliances, Lighting, Electronics",
      zh: "家电 · 灯具 · 电子",
      es: "Electrodomésticos, Iluminación, Electrónica",
    },
    icon: "recycle",
  },
  {
    id: "fcc",
    code: "FCC",
    name: {
      en: "FCC",
      zh: "FCC",
      es: "FCC",
    },
    fullName: {
      en: "FCC — Electromagnetic Compatibility",
      zh: "FCC — 电磁兼容认证",
      es: "FCC — Compatibilidad Electromagnética",
    },
    desc: {
      en: "Certifies that electronic products meet US Federal Communications Commission standards for electromagnetic interference.",
      zh: "证明电子产品符合美国联邦通信委员会的电磁干扰标准。",
      es: "Certifica que los productos electrónicos cumplen las normas de interferencia electromagnética de la FCC de EE. UU.",
    },
    region: { en: "United States", zh: "美国", es: "Estados Unidos" },
    appliesTo: {
      en: "Appliances, Lighting, Electronics",
      zh: "家电 · 灯具 · 电子",
      es: "Electrodomésticos, Iluminación, Electrónica",
    },
    icon: "radio",
  },
  {
    id: "ul",
    code: "UL",
    name: {
      en: "UL",
      zh: "UL",
      es: "UL",
    },
    fullName: {
      en: "UL — Safety Certification",
      zh: "UL — 安全认证",
      es: "UL — Certificación de Seguridad",
    },
    desc: {
      en: "Recognized North-American safety standard for electrical and fire-risk products, validated through rigorous independent testing.",
      zh: "北美广泛认可的电工与防火安全认证，经严苛第三方测试验证。",
      es: "Estándar de seguridad norteamericano para productos eléctricos y de riesgo de incendio, validado por pruebas rigurosas.",
    },
    region: { en: "United States / Canada", zh: "美国 / 加拿大", es: "EE. UU. / Canadá" },
    appliesTo: {
      en: "Appliances, Lighting",
      zh: "家电 · 灯具",
      es: "Electrodomésticos, Iluminación",
    },
    icon: "badge",
  },
  {
    id: "reach",
    code: "REACH",
    name: {
      en: "REACH",
      zh: "REACH",
      es: "REACH",
    },
    fullName: {
      en: "EU REACH — Chemical Regulation",
      zh: "欧盟 REACH — 化学品法规",
      es: "REACH UE — Regulación Química",
    },
    desc: {
      en: "Registration, Evaluation, Authorisation and Restriction of Chemicals — ensures substances in our beauty, personal-care and plastic products are safe.",
      zh: "化学品注册、评估、授权与限制法规，确保美妆、个护与塑料制品中的化学物质安全合规。",
      es: "Registro, Evaluación y Autorización de Sustancias Químicas — garantiza la seguridad de los productos de belleza, cuidado personal y plástico.",
    },
    region: { en: "European Union", zh: "欧盟", es: "Unión Europea" },
    appliesTo: {
      en: "Beauty & Skincare, Plastic Products",
      zh: "美妆护肤 · 塑料制品",
      es: "Belleza, Productos de Plástico",
    },
    icon: "flask",
  },
  {
    id: "bsci",
    code: "BSCI",
    name: {
      en: "BSCI / Sedex",
      zh: "BSCI / Sedex",
      es: "BSCI / Sedex",
    },
    fullName: {
      en: "BSCI / Sedex — Social Compliance",
      zh: "BSCI / Sedex — 社会责任合规",
      es: "BSCI / Sedex — Cumplimiento Social",
    },
    desc: {
      en: "Social compliance audits confirming fair labor practices, safe working conditions and ethical supply-chain management.",
      zh: "社会责任审核，确认公平用工、安全工作环境与合规的道德供应链管理。",
      es: "Auditorías de cumplimiento social que confirman prácticas laborales justas y gestión ética de la cadena de suministro.",
    },
    region: { en: "Global", zh: "全球", es: "Global" },
    appliesTo: {
      en: "All supplied products",
      zh: "全部供货产品",
      es: "Todos los productos",
    },
    icon: "globe",
  },
  {
    id: "fsc",
    code: "FSC",
    name: {
      en: "FSC®",
      zh: "FSC®",
      es: "FSC®",
    },
    fullName: {
      en: "FSC® — Chain of Custody",
      zh: "FSC® — 产销监管链",
      es: "FSC® — Cadena de Custodia",
    },
    desc: {
      en: "Forest Stewardship Council certification for responsibly sourced wood and paper-based products.",
      zh: "森林管理委员会认证，确保木材与纸基产品来自负责任采购。",
      es: "Certificación del Forest Stewardship Council para productos de madera y papel de origen responsable.",
    },
    region: { en: "Global", zh: "全球", es: "Global" },
    appliesTo: {
      en: "Stationery, Furniture, Packaging",
      zh: "文具 · 家具 · 包装",
      es: "Papelería, Muebles, Embalaje",
    },
    icon: "certificate",
  },
];
