export interface Partner {
  id: string;
  name: string;
  nameZh: string;
  nameEs?: string;
  logo?: string;
  description: string;
  descriptionZh?: string;
  descriptionEs?: string;
  location: string;
  locationZh?: string;
  locationEs?: string;
  specialties: string[];
  specialtiesZh?: string[];
  specialtiesEs?: string[];
  yearFounded?: number;
  certifications: string[];
  images: string[];
  videoUrl?: string;
  productIds: string[];
}

export const partners: Partner[] = [
  {
    id: "kaidi-feiluo",
    name: "Kaidi Feiluo Furniture Co., Ltd.",
    nameZh: "凯迪斐洛家具有限公司",
    nameEs: "Kaidi Feiluo Muebles Co., Ltd.",
    description:
      "Specializing in residential and commercial furniture manufacturing for over 15 years. Kaidi Feiluo operates a 20,000 sqm production facility with advanced CNC machinery and a dedicated R&D team. Their sofa and bed collections are exported to over 30 countries across Europe, North America, and the Middle East.",
    location: "Linyi, Shandong, China",
    specialties: ["Sofas", "Beds", "Cabinets", "Custom Upholstery"],
    yearFounded: 2010,
    certifications: ["ISO 9001", "BSCI", "FSC"],
    images: ["/images/partners/placeholder.svg"],
    videoUrl: "",
    productIds: [],
  },
  {
    id: "hengda-materials",
    name: "Hengda Building Materials Co., Ltd.",
    nameZh: "恒达建材有限公司",
    nameEs: "Hengda Materiales de Construcción Co., Ltd.",
    descriptionZh: "领先的建筑胶粘剂、密封胶和工程板材制造商。恒达为东南亚和非洲的重大建筑项目提供产品。产品符合ASTM和EN标准，月产能5,000吨。",
    descriptionEs: "Fabricante líder de adhesivos para construcción, selladores y paneles de ingeniería. Hengda suministra a importantes proyectos de construcción en el sudeste asiático y África. Sus productos cumplen con las normas ASTM y EN, con una capacidad de producción mensual de 5.000 toneladas.",
    locationZh: "中国山东临沂",
    locationEs: "Linyi, Shandong, China",
    specialtiesZh: ["胶粘剂", "密封胶", "工程板材", "保温材料"],
    specialtiesEs: ["Adhesivos", "Selladores", "Paneles de Ingeniería", "Aislamiento"],
    description:
      "A leading manufacturer of construction adhesives, sealants, and engineered panels. Hengda supplies major construction projects across Southeast Asia and Africa. Their products meet ASTM and EN standards, with a monthly output capacity of 5,000 tons.",
    location: "Linyi, Shandong, China",
    specialties: ["Adhesives", "Sealants", "Engineered Panels", "Insulation"],
    yearFounded: 2008,
    certifications: ["ISO 9001", "ISO 14001", "CE"],
    images: ["/images/partners/placeholder.svg"],
    videoUrl: "",
    productIds: [],
  },
  {
    id: "jinying-hardware",
    name: "Jinying Hardware Products Co., Ltd.",
    nameZh: "金鹰五金制品有限公司",
    nameEs: "Jinying Productos de Ferretería Co., Ltd.",
    descriptionZh: "精密五金制造商，专注于紧固件、门窗配件和卫浴配件。金鹰采用自动化生产线，保持99.2%的质量合格率。产品广泛应用于建筑、家具组装和工业领域。",
    descriptionEs: "Fabricante de ferretería de precisión especializado en sujetadores, herrajes para puertas y ventanas, y accesorios de baño. Jinying utiliza líneas de producción automatizadas y mantiene una tasa de aprobación de calidad del 99,2%. Los productos se utilizan ampliamente en construcción, ensamblaje de muebles y aplicaciones industriales.",
    locationZh: "中国浙江永康",
    locationEs: "Yongkang, Zhejiang, China",
    specialtiesZh: ["紧固件", "门窗五金", "卫浴配件"],
    specialtiesEs: ["Sujetadores", "Herrajes para Puertas y Ventanas", "Accesorios de Baño"],
    description:
      "Precision hardware manufacturer specializing in fasteners, door & window fittings, and bathroom accessories. Jinying uses automated production lines and maintains a 99.2% quality pass rate. Products are widely used in construction, furniture assembly, and industrial applications.",
    location: "Yongkang, Zhejiang, China",
    specialties: ["Fasteners", "Door & Window Hardware", "Bathroom Fittings"],
    yearFounded: 2012,
    certifications: ["ISO 9001", "BSCI"],
    images: ["/images/partners/placeholder.svg"],
    videoUrl: "",
    productIds: [],
  },
  {
    id: "aolis-home",
    name: "Aolis Home Appliance Co., Ltd.",
    nameZh: "奥利斯家电有限公司",
    nameEs: "Aolis Electrodomésticos Co., Ltd.",
    descriptionZh: "家用及工业电器制造商，产品涵盖通风扇、取暖器和厨房设备。奥利斯拥有15,000平方米工厂，配备自主电机生产和安全测试实验室。产品通过CE、RoHS和CB认证。",
    descriptionEs: "Fabricante de electrodomésticos e industriales que incluyen ventiladores, calefactores y equipos de cocina. Aolis tiene una fábrica de 15.000 m² con producción propia de motores y laboratorios de pruebas de seguridad. Los productos cuentan con certificaciones CE, RoHS y CB.",
    locationZh: "中国广东佛山",
    locationEs: "Foshan, Guangdong, China",
    specialtiesZh: ["风扇", "取暖器", "厨房电器"],
    specialtiesEs: ["Ventiladores", "Calefactores", "Electrodomésticos de Cocina"],
    description:
      "Manufacturer of household and industrial appliances including ventilation fans, space heaters, and kitchen equipment. Aolis has a 15,000 sqm factory with in-house motor production and safety testing labs. Products carry CE, RoHS, and CB certifications.",
    location: "Foshan, Guangdong, China",
    specialties: ["Fans", "Heaters", "Kitchen Appliances"],
    yearFounded: 2014,
    certifications: ["ISO 9001", "CE", "RoHS", "CB"],
    images: ["/images/partners/placeholder.svg"],
    videoUrl: "",
    productIds: [],
  },
  {
    id: "brightlux-lighting",
    name: "Brightlux Lighting Co., Ltd.",
    nameZh: "明悦灯饰有限公司",
    nameEs: "Brightlux Iluminación Co., Ltd.",
    descriptionZh: "专业LED照明制造商，产品涵盖台灯、吊灯和落地灯，适用于住宅、商业和酒店项目。明悦拥有自主设计团队，为国际买家提供灵活的OEM/ODM服务。",
    descriptionEs: "Fabricante profesional de iluminación LED que cubre lámparas de escritorio, lámparas colgantes y lámparas de pie para proyectos residenciales, comerciales y de hostelería. Brightlux cuenta con un equipo de diseño interno y ofrece servicios OEM/ODM con cantidades mínimas flexibles para compradores internacionales.",
    locationZh: "中国广东中山",
    locationEs: "Zhongshan, Guangdong, China",
    specialtiesZh: ["台灯", "吊灯", "落地灯", "定制灯具"],
    specialtiesEs: ["Lámparas de Escritorio", "Lámparas Colgantes", "Lámparas de Pie", "Iluminación Personalizada"],
    description:
      "Professional LED lighting manufacturer covering desk lamps, pendant lights, and floor lamps for residential, commercial, and hospitality projects. Brightlux has an in-house design team and offers OEM/ODM services with flexible MOQs for international buyers.",
    location: "Zhongshan, Guangdong, China",
    specialties: ["Desk Lamps", "Pendant Lights", "Floor Lamps", "Custom Lighting"],
    yearFounded: 2016,
    certifications: ["ISO 9001", "CE", "RoHS", "UL"],
    images: ["/images/partners/placeholder.svg"],
    videoUrl: "",
    productIds: [],
  },
  {
    id: "shenghan-industrial",
    name: "Shengyu Industrial",
    nameZh: "盛煜实业",
    nameEs: "Shengyu Industrial",
    descriptionZh: "盛煜实业经营工业清洁产品、特种化学品和综合商品。作为母公司，我们为全球买家采购、质检并出口各类工业消耗品。",
    descriptionEs: "Shengyu Industrial maneja productos de limpieza industrial, productos químicos especializados y mercancía general. Como empresa matriz, obtenemos, verificamos la calidad y exportamos una amplia gama de consumibles industriales para compradores globales.",
    locationZh: "中国山东临沂",
    locationEs: "Linyi, Shandong, China",
    specialtiesZh: ["工业清洁剂", "化学品", "综合商品"],
    specialtiesEs: ["Limpiadores Industriales", "Productos Químicos", "Mercancía General"],
    description:
      "Shengyu Industrial handles industrial cleaning products, specialty chemicals, and general merchandise. As the parent trading company, we source, quality-check, and export a wide range of industrial consumables for global buyers.",
    location: "Linyi, Shandong, China",
    specialties: ["Industrial Cleaners", "Chemicals", "General Merchandise"],
    yearFounded: 2017,
    certifications: ["ISO 9001"],
    images: ["/images/partners/placeholder.svg"],
    videoUrl: "",
    productIds: [],
  },
];

export function getPartnerById(id: string): Partner | undefined {
  return partners.find((p) => p.id === id);
}

export function getProductsByPartner(partnerId: string, products: { id: string; partnerId?: string }[]): string[] {
  return products.filter((p) => p.partnerId === partnerId).map((p) => p.id);
}
