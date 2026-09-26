import type { Locale } from "@/lib/localizeProduct";
import type { MultiLangText } from "./products";

export interface TradeTermItem {
  code: string;
  name: MultiLangText;
  desc: MultiLangText;
}

export interface PaymentItem {
  code: string;
  name: MultiLangText;
  desc: MultiLangText;
}

export interface LogisticsItem {
  code: string;
  name: MultiLangText;
  desc: MultiLangText;
}

export const incoterms: TradeTermItem[] = [
  {
    code: "EXW",
    name: { en: "EXW — Ex Works", zh: "EXW — 工厂交货", es: "EXW — En Fábrica" },
    desc: {
      en: "Buyer collects goods from our factory and handles all transport, export clearance and costs. Best for buyers with their own freight forwarder in China.",
      zh: "买方自行到工厂提货，并承担全部运输、出口报关及费用。适合在中国已有货代资源的买家。",
      es: "El comprador retira la mercancía en nuestra fábrica y asume todo el transporte, despacho de exportación y costos. Ideal si ya tiene agente de carga en China.",
    },
  },
  {
    code: "FOB",
    name: { en: "FOB — Free On Board", zh: "FOB — 船上交货", es: "FOB — Franco a Bordo" },
    desc: {
      en: "We deliver goods to the named port of shipment and clear export customs. Buyer pays ocean freight and insurance. Our most common term.",
      zh: "我方负责将货物运至指定装运港并完成出口报关，买方支付海运费与保险。我们最常用的条款。",
      es: "Entregamos la mercancía en el puerto de embarque y gestionamos la aduana de exportación. El comprador paga flete marítimo y seguro. Nuestro término más común.",
    },
  },
  {
    code: "CIF",
    name: { en: "CIF — Cost, Insurance & Freight", zh: "CIF — 成本加保险费加运费", es: "CIF — Costo, Seguro y Flete" },
    desc: {
      en: "We cover ocean freight and insurance to the destination port. Buyer handles import clearance and last-mile delivery.",
      zh: "我方承担至目的港的海运费与保险费，买方负责进口清关与末端配送。",
      es: "Cubrimos flete marítimo y seguro hasta el puerto de destino. El comprador gestiona el despacho de importación y la entrega final.",
    },
  },
  {
    code: "DAP",
    name: { en: "DAP — Delivered At Place", zh: "DAP — 目的地交货", es: "DAP — Entregado en Lugar" },
    desc: {
      en: "We deliver to your named address (warehouse / port) including all transport. Import duties are paid by the buyer.",
      zh: "我方将货物送达指定地址（仓库/港口），含全程运输；进口关税由买方承担。",
      es: "Entregamos en su dirección indicada (almacén / puerto) incluyendo todo el transporte. Los aranceles de importación los paga el comprador.",
    },
  },
  {
    code: "DDP",
    name: { en: "DDP — Delivered Duty Paid", zh: "DDP — 完税后交货", es: "DDP — Entregado con Arancel Pagado" },
    desc: {
      en: "We handle everything — freight, insurance and import duties — delivering cleared goods to your door. Simplest for the buyer.",
      zh: "我方包办运费、保险与进口关税，将已清关货物送到您门口。对买方最为省心。",
      es: "Gestionamos todo — flete, seguro y aranceles de importación — entregando la mercancía despachada en su puerta. Lo más sencillo para el comprador.",
    },
  },
];

export const payments: PaymentItem[] = [
  {
    code: "T/T",
    name: { en: "T/T — Telegraphic Transfer", zh: "T/T — 电汇", es: "T/T — Transferencia Telegráfica" },
    desc: {
      en: "Bank transfer for bulk orders — deposit and balance schedule agreed per order. Our preferred and fastest method.",
      zh: "大宗订单采用电汇结算，定金与尾款安排按订单商定。我们首选且最快的方式。",
      es: "Transferencia bancaria para pedidos al por mayor — el calendario de anticipo y saldo se acuerda por pedido. Nuestro método preferido y más rápido.",
    },
  },
  {
    code: "L/C",
    name: { en: "L/C at Sight", zh: "L/C — 即期信用证", es: "L/C a la Vista" },
    desc: {
      en: "Irrevocable Letter of Credit at sight, typically for orders above USD 20,000 or first-time cooperation — security for both parties.",
      zh: "不可撤销即期信用证，通常用于 2 万美元以上订单或首次合作，保障双方权益。",
      es: "Carta de crédito irrevocable a la vista, típicamente para pedidos superiores a USD 20.000 o primera cooperación — seguridad para ambas partes.",
    },
  },
  {
    code: "TA",
    name: { en: "Trade Assurance / Escrow", zh: "Trade Assurance / 第三方担保", es: "Trade Assurance / Depósito en Garantía" },
    desc: {
      en: "For first-time buyers we can work through Alibaba Trade Assurance, Sinosure credit insurance or third-party escrow, so your payment stays protected until the goods ship as agreed.",
      zh: "针对首次合作买家，可通过阿里信保、中信保或第三方担保交易，货物按约出运前保障您的付款安全。",
      es: "Para compradores de primera vez podemos operar mediante Alibaba Trade Assurance, seguro de crédito Sinosure o depósito en garantía, protegiendo su pago hasta el envío conforme a lo acordado.",
    },
  },
  {
    code: "PP",
    name: { en: "PayPal / Western Union", zh: "PayPal / 西联汇款", es: "PayPal / Western Union" },
    desc: {
      en: "For samples and small trial orders — fast and straightforward.",
      zh: "适用于样品与小批量试单——快捷方便。",
      es: "Para muestras y pedidos de prueba pequeños — rápido y sencillo.",
    },
  },
];

export const logistics: LogisticsItem[] = [
  {
    code: "SEA",
    name: { en: "Sea Freight (FCL / LCL)", zh: "海运（整柜 / 拼柜）", es: "Flete Marítimo (FCL / LCL)" },
    desc: {
      en: "Most economical for bulk orders. Full container (FCL) or consolidated (LCL) via Ningbo / Qingdao / Shanghai ports. Reference transit time: Bangkok / Laem Chabang 7–10 days; Jebel Ali (Dubai) 20–25 days; Mombasa / Lagos 30–40 days.",
      zh: "大宗订单最经济。整柜（FCL）或拼柜（LCL），经宁波 / 青岛 / 上海港发运。参考时效：曼谷 / 林查班 7–10 天；杰贝阿里（迪拜）20–25 天；蒙巴萨 / 拉各斯 30–40 天。",
      es: "El más económico para pedidos grandes. Contenedor completo (FCL) o consolidado (LCL) vía puertos de Ningbo / Qingdao / Shanghái. Tránsito de referencia: Bangkok / Laem Chabang 7–10 días; Jebel Ali (Dubai) 20–25 días; Mombasa / Lagos 30–40 días.",
    },
  },
  {
    code: "AIR",
    name: { en: "Air Freight", zh: "空运", es: "Flete Aéreo" },
    desc: {
      en: "Best for urgent or high-value shipments that need to reach market fast.",
      zh: "适合急需或高价值、需快速上架的货物。",
      es: "Ideal para envíos urgentes o de alto valor que deben llegar al mercado rápido.",
    },
  },
  {
    code: "EXP",
    name: { en: "Express (DHL / FedEx / UPS)", zh: "国际快递（DHL / FedEx / UPS）", es: "Express (DHL / FedEx / UPS)" },
    desc: {
      en: "Door-to-door for samples and small parcels, with full tracking.",
      zh: "门到门服务，适用于样品与小包裹，全程可追踪。",
      es: "Puerta a puerta para muestras y paquetes pequeños, con seguimiento completo.",
    },
  },
  {
    code: "WH",
    name: { en: "Overseas Warehouses", zh: "海外仓备货", es: "Almacenes en el Extranjero" },
    desc: {
      en: "Stock held in Southeast Asia (Bangkok · Kuala Lumpur) and Middle East (Dubai) hubs for faster replenishment and lower last-mile cost.",
      zh: "在东南亚（曼谷 · 吉隆坡）与中东（迪拜）枢纽前置备货，补货更快、末端成本更低。",
      es: "Inventario en hubs del Sudeste Asiático (Bangkok · Kuala Lumpur) y Medio Oriente (Dubai) para reposición más rápida y menor costo final.",
    },
  },
];
