import type { MultiLangText } from "./products";

export interface FaqItem {
  q: MultiLangText;
  a: MultiLangText;
}

export interface FaqGroup {
  id: string;
  label: MultiLangText;
  items: FaqItem[];
}

/** Buyer-facing FAQ for a B2B export storefront.
 *  Answers intentionally match the live trade data
 *  (MOQ per product, 25–35 day lead time, T/T + L/C, EXW/FOB/CIF/DDP). */
export const faqGroups: FaqGroup[] = [
  {
    id: "orders",
    label: { en: "Orders & MOQ", zh: "订单与起订量", es: "Pedidos y MOQ" },
    items: [
      {
        q: {
          en: "What is your minimum order quantity (MOQ)?",
          zh: "你们的最低起订量（MOQ）是多少？",
          es: "¿Cuál es su cantidad mínima de pedido (MOQ)?",
        },
        a: {
          en: "MOQ is listed on every product page and varies by category — from 5 pcs for furniture to 500 pcs for hygiene items. If you need a smaller trial order, send us the product link and target quantity and we will confirm what is workable.",
          zh: "起订量在每个产品页均有标注，按品类不同：家具类 5 件起，卫生用品类 500 件起。如需更小的试单，请把产品链接与目标数量发给我们，我们会确认可行的方案。",
          es: "El MOQ figura en cada ficha de producto y varía según la categoría: desde 5 uds para muebles hasta 500 uds para artículos de higiene. Si necesita un pedido de prueba menor, envíenos el enlace del producto y la cantidad objetivo.",
        },
      },
      {
        q: {
          en: "Can I mix different products in one container?",
          zh: "一个集装箱可以混装不同产品吗？",
          es: "¿Puedo mezclar distintos productos en un contenedor?",
        },
        a: {
          en: "Yes. We are a one-stop supplier covering furniture, building materials, hardware, appliances, lighting and general merchandise, so mixed containers are our standard practice. We will help optimise the loading plan to maximise container utilisation.",
          zh: "可以。我们是一站式供应商，覆盖家具、建材、五金、家电、照明及日用百货，混装是常规操作。我们会协助优化装柜方案，最大化利用集装箱空间。",
          es: "Sí. Somos un proveedor integral que cubre muebles, materiales de construcción, ferretería, electrodomésticos, iluminación y artículos generales, por lo que los contenedores mixtos son habituales. Le ayudamos a optimizar la carga.",
        },
      },
      {
        q: {
          en: "Do you accept trial or sample orders?",
          zh: "你们接受试单或样品单吗？",
          es: "¿Aceptan pedidos de prueba o muestras?",
        },
        a: {
          en: "Yes. Sample orders are welcome and the sample fee is normally refunded against your first bulk order. Samples ship by DHL / FedEx / UPS with tracking provided.",
          zh: "接受。欢迎下样品单，样品费通常在首批大货订单中返还。样品通过 DHL / FedEx / UPS 寄出并提供追踪号。",
          es: "Sí. Los pedidos de muestra son bienvenidos y el importe de la muestra suele reembolsarse con su primer pedido al por mayor. Se envían por DHL / FedEx / UPS con seguimiento.",
        },
      },
    ],
  },
  {
    id: "pricing",
    label: { en: "Pricing & Payment", zh: "价格与付款", es: "Precios y pago" },
    items: [
      {
        q: {
          en: "What payment methods do you accept?",
          zh: "你们接受哪些付款方式？",
          es: "¿Qué métodos de pago aceptan?",
        },
        a: {
          en: "T/T bank transfer is standard for bulk orders, and L/C at sight is accepted for larger orders. Trade Assurance / escrow is available for first-time buyers, and PayPal or Western Union for samples and small amounts. Deposit and balance terms are agreed per order.",
          zh: "大宗订单常规采用电汇 T/T；大额订单可接受即期信用证（L/C at sight）。首次合作可用 Trade Assurance / 第三方担保，样品及小额款项可用 PayPal 或西联汇款。定金与尾款条件按订单商定。",
          es: "La transferencia bancaria T/T es habitual para pedidos al por mayor, y se acepta L/C a la vista para pedidos grandes. Trade Assurance / depósito en garantía disponible para nuevos compradores, y PayPal o Western Union para muestras e importes pequeños. El anticipo y el saldo se acuerdan por pedido.",
        },
      },
      {
        q: {
          en: "Which currencies and trade terms do you quote in?",
          zh: "报价使用什么币种和贸易术语？",
          es: "¿En qué moneda y términos comerciales cotizan?",
        },
        a: {
          en: "Quotes are issued in USD by default (EUR available on request). We work under EXW, FOB, CIF and DDP — tell us your destination and we will quote the most suitable term.",
          zh: "默认以美元（USD）报价（可按要求提供欧元报价）。我们支持 EXW、FOB、CIF 与 DDP 术语，请告知目的港，我们会提供最合适的条款报价。",
          es: "Las cotizaciones se emiten en USD por defecto (EUR bajo demanda). Trabajamos con EXW, FOB, CIF y DDP: indíquenos su destino y le cotizaremos el término más adecuado.",
        },
      },
      {
        q: {
          en: "How long is my quotation valid?",
          zh: "报价有效期多久？",
          es: "¿Cuánto tiempo es válida mi cotización?",
        },
        a: {
          en: "Quotations are normally valid for 30 days. For commodities with volatile raw-material costs we will state the validity period explicitly on the quote.",
          zh: "报价通常 30 天内有效。对于原材料价格波动较大的品类，我们会在报价单上明确标注有效期。",
          es: "Las cotizaciones suelen tener una validez de 30 días. Para materias primas volátiles indicamos explícitamente el periodo de validez en la oferta.",
        },
      },
    ],
  },
  {
    id: "production",
    label: { en: "Samples & Production", zh: "打样与生产", es: "Muestras y producción" },
    items: [
      {
        q: {
          en: "What is the standard lead time?",
          zh: "标准交期是多久？",
          es: "¿Cuál es el plazo de entrega habitual?",
        },
        a: {
          en: "Standard production lead time is 25–35 days after deposit and specification confirmation. Custom or heavily configured orders may take 35–45 days. Rush production can be arranged on request.",
          zh: "标准生产交期为收到定金并确认规格后 25–35 天。定制或配置复杂的订单可能需要 35–45 天。可根据要求安排加急生产。",
          es: "El plazo habitual de producción es de 25–35 días tras el anticipo y la confirmación de especificaciones. Los pedidos personalizados pueden tardar 35–45 días. Producción urgente bajo demanda.",
        },
      },
      {
        q: {
          en: "Do you provide OEM / ODM and private labelling?",
          zh: "你们提供 OEM / ODM 和贴牌服务吗？",
          es: "¿Ofrecen OEM / ODM y marca propia?",
        },
        a: {
          en: "Yes. We offer full OEM/ODM: custom dimensions, materials, colours, finishes, packaging artwork and your own brand labelling. Send drawings or a reference sample and our engineering team will evaluate feasibility and tooling.",
          zh: "提供。我们提供完整 OEM/ODM 服务：定制尺寸、材质、颜色、表面处理、包装设计及自有品牌贴牌。请提供图纸或参考样品，工程团队会评估可行性与模具方案。",
          es: "Sí. Ofrecemos OEM/ODM completo: medidas, materiales, colores, acabados, diseño de embalaje y etiquetado con su marca. Envíe planos o una muestra de referencia y evaluaremos viabilidad.",
        },
      },
      {
        q: {
          en: "How long does sampling take?",
          zh: "打样需要多久？",
          es: "¿Cuánto tarda el muestreo?",
        },
        a: {
          en: "Existing items ship within 3–5 business days. New custom samples typically take 7–15 days depending on tooling. Sample costs and freight are quoted before production starts.",
          zh: "现有产品 3–5 个工作日内寄出。新定制样品通常 7–15 天，视模具情况而定。打样费与运费会在开始前先行报价确认。",
          es: "Los artículos existentes se envían en 3–5 días laborables. Las muestras nuevas tardan normalmente 7–15 días según utillaje. El coste y el flete se cotizan antes de empezar.",
        },
      },
    ],
  },
  {
    id: "quality",
    label: { en: "Quality & Compliance", zh: "品质与合规", es: "Calidad y cumplimiento" },
    items: [
      {
        q: {
          en: "What certifications can you provide?",
          zh: "你们能提供哪些认证？",
          es: "¿Qué certificaciones pueden aportar?",
        },
        a: {
          en: "Our factories operate under ISO 9001 quality management, and products can be supplied to CE, RoHS, FCC, UL, REACH, EN71, BSCI and FSC requirements depending on the category and destination market. Certificates are issued per order — see the Certifications page for details.",
          zh: "工厂通过 ISO 9001 质量管理体系认证，产品可按品类与目的市场提供 CE、RoHS、FCC、UL、REACH、EN71、BSCI、FSC 等合规文件。证书按订单出具，详见「资质认证」页面。",
          es: "Nuestras fábricas operan bajo ISO 9001 y los productos pueden suministrarse conforme a CE, RoHS, FCC, UL, REACH, EN71, BSCI y FSC según categoría y mercado. Los certificados se emiten por pedido: consulte la página de Certificaciones.",
        },
      },
      {
        q: {
          en: "How do you control quality?",
          zh: "你们如何管控品质？",
          es: "¿Cómo controlan la calidad?",
        },
        a: {
          en: "We run incoming material inspection, in-process checks and a final pre-shipment inspection against AQL standards, with batch records retained. Third-party inspection (SGS, BV, Intertek) can be arranged at your cost, and we support video factory audits.",
          zh: "我们执行来料检验、过程检验及出货前终检（按 AQL 标准），并保留批次记录。可安排 SGS、BV、Intertek 等第三方验货（费用由买方承担），并支持视频验厂。",
          es: "Realizamos inspección de materiales, controles en proceso e inspección final previa al envío según AQL, con registros de lote. Inspección de terceros (SGS, BV, Intertek) a su cargo, y auditorías de fábrica por vídeo.",
        },
      },
      {
        q: {
          en: "What is your warranty / after-sales policy?",
          zh: "售后与质保政策是什么？",
          es: "¿Cuál es su política de garantía y posventa?",
        },
        a: {
          en: "All shipments are inspected before loading. Report any quality issue within 7 days of receipt with photos or video; confirmed defects are replaced or credited in the next shipment. Claims are handled in English, Chinese or Spanish.",
          zh: "所有货物装柜前均已检验。如收到货后 7 天内发现质量问题，请提供照片或视频；确认属实的缺陷将在下一批次补发或抵扣货款。售后支持中、英、西三语沟通。",
          es: "Todos los envíos se inspeccionan antes de cargar. Notifique cualquier problema de calidad en un plazo de 7 días con fotos o vídeo; los defectos confirmados se reponen o acreditan en el siguiente envío.",
        },
      },
    ],
  },
  {
    id: "logistics",
    label: { en: "Shipping & Logistics", zh: "运输与物流", es: "Envío y logística" },
    items: [
      {
        q: {
          en: "Which ports do you ship from and how long is transit?",
          zh: "从哪个港口发货？运输需要多久？",
          es: "¿Desde qué puerto envían y cuánto tarda el tránsito?",
        },
        a: {
          en: "We ship mainly from Qingdao and Ningbo. Sea transit is typically 15–35 days depending on destination; air and express options are available for urgent or sample shipments. We will advise the best routing for your timeline.",
          zh: "主要从青岛和宁波港出运。海运视目的港通常 15–35 天；紧急或样品货物可选择空运与快递。我们会根据您的时效要求推荐最优路线。",
          es: "Enviamos principalmente desde Qingdao y Ningbo. El tránsito marítimo suele ser de 15–35 días según destino; hay opciones aéreas y exprés para urgencias o muestras.",
        },
      },
      {
        q: {
          en: "Can you handle export documentation?",
          zh: "你们能处理出口单证吗？",
          es: "¿Pueden gestionar la documentación de exportación?",
        },
        a: {
          en: "Yes. We prepare commercial invoice, packing list, bill of lading, certificate of origin (including Form E / FTA where applicable) and any product-specific compliance documents required by your market.",
          zh: "可以。我们提供商业发票、装箱单、提单、原产地证（含 Form E / 自贸协定优惠原产地证，如适用），以及目的市场所需的合规文件。",
          es: "Sí. Preparamos factura comercial, lista de empaque, conocimiento de embarque, certificado de origen (incluido Form E / TLC cuando aplica) y los documentos de cumplimiento que exija su mercado.",
        },
      },
      {
        q: {
          en: "How can I track my shipment?",
          zh: "如何追踪我的货物？",
          es: "¿Cómo puedo seguir mi envío?",
        },
        a: {
          en: "You receive booking confirmation, loading photos and the tracking number once the vessel departs. Your sales representative sends status updates at each milestone until delivery.",
          zh: "订舱确认、装柜照片及开船后的追踪号都会发送给您。销售代表会在每个节点同步进度，直至货物交付。",
          es: "Recibirá la confirmación de reserva, fotos de carga y el número de seguimiento una vez zarpe el buque. Su representante le informará en cada hito hasta la entrega.",
        },
      },
    ],
  },
];

/** Flat list (useful for FAQPage structured data) */
export function allFaqItems(): FaqItem[] {
  return faqGroups.flatMap((g) => g.items);
}
