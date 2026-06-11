// ============================================================
// About Page Data — Pure B2B, English-first, 3-language support
// ============================================================

export interface TimelineItem {
  year: string;
  title: Record<string, string>;
  desc: Record<string, string>;
}

export interface ValueItem {
  icon: string; // lucide icon name
  title: Record<string, string>;
  desc: Record<string, string>;
}

export interface CertItem {
  title: Record<string, string>;
  desc: Record<string, string>;
}

export interface TeamRole {
  icon: string;
  title: Record<string, string>;
  desc: Record<string, string>;
}

export interface RDCapability {
  title: Record<string, string>;
  desc: Record<string, string>;
}

// ── Timeline ──────────────────────────────────────────────
export const timeline: TimelineItem[] = [
  {
    year: "2002",
    title: { en: "Brand Founded", zh: "品牌创立", es: "Fundación de la Marca" },
    desc: {
      en: "Established in Guangzhou with our first standardized production line. Began exporting engineering building materials to global markets.",
      zh: "在广州创立品牌，搭建首条标准化生产线，开启基础工程建材外贸出口业务。",
      es: "Establecida en Guangzhou con nuestra primera línea de producción estandarizada. Comenzamos a exportar materiales de construcción a mercados globales."
    }
  },
  {
    year: "2008",
    title: { en: "Production Expansion", zh: "产能扩张", es: "Expansión Productiva" },
    desc: {
      en: "Expanded production parks. Built full-range product matrix covering building materials, commercial furniture and cleaning supplies.",
      zh: "扩建生产园区，完善全品类产品矩阵，覆盖建材、商用家居、清洁耗材三大核心品类。",
      es: "Ampliamos los parques de producción. Construimos una matriz completa de productos cubriendo materiales de construcción, muebles comerciales y productos de limpieza."
    }
  },
  {
    year: "2013",
    title: { en: "R&D Lab Established", zh: "研发实验室成立", es: "Laboratorio de I+D" },
    desc: {
      en: "Established independent R&D laboratory. Launched climate-adaptive technology and eco-friendly formula research. Applied for multiple national and international patents.",
      zh: "成立独立研发实验室，启动气候适配技术与环保配方专项研发，同步申请国内外多项技术专利。",
      es: "Establecimos un laboratorio independiente de I+D. Lanzamos investigación en tecnología de adaptación climática y fórmulas ecológicas. Solicitamos múltiples patentes nacionales e internacionales."
    }
  },
  {
    year: "2018",
    title: { en: "Global Compliance Upgrade", zh: "全球合规升级", es: "Actualización de Cumplimiento Global" },
    desc: {
      en: "Achieved full coverage of global mainstream certifications. Built dedicated compliance team to track import regulations and environmental policies worldwide.",
      zh: "完成全球主流国际认证全覆盖，搭建专职合规团队，实时追踪各国进口法规与环保政策。",
      es: "Logramos cobertura completa de certificaciones globales. Construimos un equipo dedicado de cumplimiento para seguir regulaciones de importación y políticas ambientales mundiales."
    }
  },
  {
    year: "2022",
    title: { en: "Global Logistics Network", zh: "全球物流网络", es: "Red Logística Global" },
    desc: {
      en: "Launched overseas warehouses in Europe, Southeast Asia and Russian-speaking regions. Built multi-channel global logistics network for door-to-door delivery.",
      zh: "布局欧洲、东南亚、俄语区海外仓，搭建多渠道全球物流网络，实现门到门一站式交付。",
      es: "Lanzamos almacenes en el extranjero en Europa, Sudeste Asiático y regiones de habla rusa. Construimos una red logística global multicanal para entrega puerta a puerta."
    }
  },
  {
    year: "2025",
    title: { en: "Global Brand Upgrade", zh: "全球化品牌升级", es: "Actualización de Marca Global" },
    desc: {
      en: "Integrated upstream factories into supply chain alliance. Launched comprehensive value-added services: tiered customization, marketing empowerment, framework cooperation. Serving B2B partners across 30+ countries.",
      zh: "整合上游优质工厂形成供应链联盟，推出分层定制、营销赋能、框架合作等全方位增值服务，服务全球30+国家B端合作伙伴。",
      es: "Integramos fábricas asociadas en una alianza de cadena de suministro. Lanzamos servicios integrales de valor agregado: personalización por niveles, empoderamiento de marketing y cooperación marco. Sirviendo a socios B2B en más de 30 países."
    }
  },
];

// ── Core Values ───────────────────────────────────────────
export const values: ValueItem[] = [
  {
    icon: "Factory",
    title: { en: "Mission", zh: "品牌使命", es: "Misión" },
    desc: {
      en: "To provide cost-effective, fully compliant building materials and integrated supply chain solutions for global importers, contractors and distributors.",
      zh: "为全球进口商、工程承包商、分销商提供高性价比、全域合规的建材产品与一体化供应链解决方案。",
      es: "Proporcionar materiales de construcción rentables y totalmente compatibles, y soluciones integradas de cadena de suministro para importadores, contratistas y distribuidores globales."
    }
  },
  {
    icon: "Eye",
    title: { en: "Vision", zh: "品牌愿景", es: "Visión" },
    desc: {
      en: "To become a trusted long-term strategic partner for global home and building materials buyers — a brand known for reliability, compliance and innovation.",
      zh: "成为全球家居建材采购商值得信赖的长期战略合作伙伴——以可靠品质、全域合规、持续创新享誉业界。",
      es: "Convertirnos en un socio estratégico de confianza a largo plazo para compradores globales de materiales para el hogar y la construcción — una marca reconocida por su fiabilidad, cumplimiento e innovación."
    }
  },
  {
    icon: "Shield",
    title: { en: "Core Values", zh: "核心价值观", es: "Valores Fundamentales" },
    desc: {
      en: "Quality First — every product meets strict brand standards. Compliance First — full global certifications. Service First — 24/7 multilingual support. Win-win Cooperation — long-term partnership over short-term profit.",
      zh: "品质为基——每件产品严守品牌标准；合规为先——全域认证覆盖全球；服务为本——7×24小时多语种支持；长期共赢——追求长期合作而非短期利润。",
      es: "Calidad Primero — cada producto cumple estrictos estándares de marca. Cumplimiento Primero — certificaciones globales completas. Servicio Primero — soporte multilingüe 24/7. Cooperación Ganar-Ganar — asociación a largo plazo sobre ganancias a corto plazo."
    }
  },
  {
    icon: "TrendingUp",
    title: { en: "Core Competency", zh: "核心竞争力", es: "Competencia Central" },
    desc: {
      en: "Self-owned production bases with scaled capacity. Independent R&D with patented technologies. Full-chain quality control with traceability. Global compliance and logistics network.",
      zh: "自有生产基地规模化产能，自主研发专利技术，全链路品控溯源体系，全球化合规与物流网络。",
      es: "Bases de producción propias con capacidad escalada. I+D independiente con tecnologías patentadas. Control de calidad de cadena completa con trazabilidad. Red global de cumplimiento y logística."
    }
  },
];

// ── Certifications ────────────────────────────────────────
export const certs: CertItem[] = [
  { title: { en: "ISO 9001:2015", zh: "ISO 9001:2015", es: "ISO 9001:2015" }, desc: { en: "Quality Management System", zh: "质量管理体系认证", es: "Sistema de Gestión de Calidad" } },
  { title: { en: "ISO 14001:2015", zh: "ISO 14001:2015", es: "ISO 14001:2015" }, desc: { en: "Environmental Management System", zh: "环境管理体系认证", es: "Sistema de Gestión Ambiental" } },
  { title: { en: "CE Marking", zh: "CE 认证", es: "Marcado CE" }, desc: { en: "European Conformity — EU Market Access", zh: "欧盟市场准入认证", es: "Conformidad Europea — Acceso al Mercado de la UE" } },
  { title: { en: "UKCA", zh: "UKCA 认证", es: "UKCA" }, desc: { en: "UK Conformity Assessed — Great Britain Market", zh: "英国市场准入认证", es: "Conformidad Evaluada del Reino Unido" } },
  { title: { en: "RoHS", zh: "RoHS 认证", es: "RoHS" }, desc: { en: "Restriction of Hazardous Substances", zh: "有害物质限制指令", es: "Restricción de Sustancias Peligrosas" } },
  { title: { en: "REACH", zh: "REACH 法规", es: "REACH" }, desc: { en: "EU Chemical Registration & Compliance", zh: "欧盟化学品注册与合规", es: "Registro y Cumplimiento Químico de la UE" } },
  { title: { en: "EAC", zh: "EAC 认证", es: "EAC" }, desc: { en: "Eurasian Conformity — Russia & CIS Markets", zh: "俄语区及独联体市场准入", es: "Conformidad Euroasiática — Rusia y Mercados CIS" } },
  { title: { en: "FDA", zh: "FDA 认证", es: "FDA" }, desc: { en: "US Food Contact Safety Compliance", zh: "美国食品接触安全合规", es: "Cumplimiento de Seguridad de Contacto Alimentario de EE.UU." } },
  { title: { en: "SABER", zh: "SABER 认证", es: "SABER" }, desc: { en: "Saudi Product Safety — Middle East Market", zh: "沙特产品安全认证——中东市场", es: "Seguridad de Productos Saudí — Mercado de Medio Oriente" } },
  { title: { en: "PFAS-Free", zh: "无PFAS认证", es: "Libre de PFAS" }, desc: { en: "Free of Perfluoroalkyl Substances — Global Eco Standard", zh: "无全氟化合物——全球环保标准", es: "Libre de Sustancias Perfluoroalquiladas — Estándar Ecológico Global" } },
  { title: { en: "CNAS Lab", zh: "CNAS 认可实验室", es: "Laboratorio Acreditado CNAS" }, desc: { en: "China National Accreditation Service — In-house Testing Lab", zh: "中国合格评定国家认可——自有检测实验室", es: "Servicio Nacional de Acreditación de China — Laboratorio de Pruebas Interno" } },
  { title: { en: "MSDS", zh: "MSDS 报告", es: "MSDS" }, desc: { en: "Material Safety Data Sheet — Chemical Products", zh: "化学品安全技术说明书", es: "Ficha de Datos de Seguridad de Materiales — Productos Químicos" } },
];

// ── Team ──────────────────────────────────────────────────
export const teamRoles: TeamRole[] = [
  {
    icon: "FlaskConical",
    title: { en: "R&D Engineers", zh: "研发工程师", es: "Ingenieros de I+D" },
    desc: {
      en: "Our R&D team focuses on climate-adaptive material formulas and eco-friendly innovations. With patented technologies for moisture-proof, frost-resistant and high-temperature resistant products, we ensure superior performance for diverse global environments.",
      zh: "研发团队专注气候适配材料配方与环保创新，拥有防潮、防冻、耐高温等多项专利技术，确保产品在全球不同环境下性能卓越。",
      es: "Nuestro equipo de I+D se enfoca en fórmulas de materiales adaptativas al clima e innovaciones ecológicas. Con tecnologías patentadas para productos resistentes a la humedad, heladas y altas temperaturas, garantizamos un rendimiento superior."
    }
  },
  {
    icon: "Microscope",
    title: { en: "QC Specialists", zh: "质检工程师", es: "Especialistas en CC" },
    desc: {
      en: "Executing our 9-step full-chain quality control system from raw material inspection to outbound registration. Every batch carries a unique traceability code. We support third-party on-site inspection for large-scale projects.",
      zh: "执行九步全链路品控体系，从原料检测到出库登记。每批次配备唯一溯源码，支持第三方驻厂验货，满足大型工程严苛标准。",
      es: "Ejecutamos nuestro sistema de control de calidad de 9 pasos, desde la inspección de materias primas hasta el registro de salida. Cada lote lleva un código de trazabilidad único. Apoyamos la inspección in situ por terceros."
    }
  },
  {
    icon: "Globe",
    title: { en: "Global Business Team", zh: "全球商务团队", es: "Equipo Comercial Global" },
    desc: {
      en: "Multilingual business managers fluent in 7 major languages. We provide localized communication, market insights and end-to-end project coordination for importers, contractors and distributors worldwide.",
      zh: "七大语种商务经理，提供本地化沟通、市场洞察和端到端项目协调，服务全球进口商、工程承包商和分销商。",
      es: "Gerentes comerciales multilingües en 7 idiomas principales. Proporcionamos comunicación localizada, conocimientos de mercado y coordinación de proyectos de extremo a extremo para importadores, contratistas y distribuidores globales."
    }
  },
  {
    icon: "Truck",
    title: { en: "Logistics & Customs Team", zh: "物流清关团队", es: "Equipo de Logística y Aduanas" },
    desc: {
      en: "Dedicated logistics coordinators and customs clearance specialists. We manage FCL/LCL/Air/Rail shipments and provide complete documentation packages for smooth customs clearance at all destination ports.",
      zh: "专职物流协调员与清关专员，管理整柜/拼箱/空运/铁路多渠道货运，提供完整单证包确保各国目的港顺利清关。",
      es: "Coordinadores logísticos y especialistas en despacho aduanero dedicados. Gestionamos envíos FCL/LCL/Aéreo/Ferroviario y proporcionamos paquetes completos de documentación para un despacho aduanero sin problemas."
    }
  },
];
