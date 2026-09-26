export interface Review {
  id: string;
  customerName: string;
  customerLocation: string;
  productName: string;
  rating: number; // 1-5
  comment: string;
  lang: "zh" | "th" | "en" | "es";
  date: string;
  avatar: string;
}

export const reviews: Review[] = [
  // === 海外客户评价（英文） ===
  {
    id: "r1",
    customerName: "James T.",
    customerLocation: "Sydney, Australia",
    productName: "DEXOREN Office Chair OC-220",
    rating: 5,
    comment: "Ordered 150 ergonomic chairs for our new office fit-out. Build quality is excellent and the lead time was honored exactly. Their team sent pre-shipment photos and QC reports for every batch. We'll consolidate more of our sourcing through DEXOREN.",
    lang: "en",
    date: "2026-05-12",
    avatar: "/images/reviews/avatar-1.svg",
  },
  {
    id: "r2",
    customerName: "Olivia N.",
    customerLocation: "Nairobi, Kenya",
    productName: "DEXOREN LED Desk Lamp DL-118",
    rating: 5,
    comment: "Imported a full container of desk lamps for our retail chain. Packaging survived the long sea freight with zero damage, and the finish quality impressed our buyers. DEXOREN's one-stop sourcing saved us from coordinating multiple suppliers.",
    lang: "en",
    date: "2026-04-22",
    avatar: "/images/reviews/avatar-2.svg",
  },
  // === 泰语评论 ===
  {
    id: "r3",
    customerName: "Somchai P.",
    customerLocation: "กรุงเทพฯ, ประเทศไทย",
    productName: "DEXOREN Sofa 03",
    rating: 5,
    comment: "สั่งโซฟา 30 ตัวสำหรับโรงแรม คุณภาพดีมาก ผ้าหุ้มและโครงแข็งแรงทนทาน การจัดส่งตรงเวลา แพ็คมาอย่างดีไม่มีเสียหาย ประทับใจบริการหลังการขาย",
    lang: "th",
    date: "2026-05-08",
    avatar: "/images/reviews/avatar-3.svg",
  },
  {
    id: "r4",
    customerName: "Thanawat K.",
    customerLocation: "เชียงใหม่, ประเทศไทย",
    productName: "DEXOREN LED High Bay Light LT-200",
    rating: 4,
    comment: "เปลี่ยนไฟในโกดัง 200 ดวง ประสิทธิภาพ 150 lm/W ของจริง วัดเองแล้วเชื่อได้ มีหลอดหนึ่งกระพริบนิดหน่อย ทีมงานส่งเปลี่ยนให้ทันทีโดยไม่ถามอะไรเลย บริการดีมาก",
    lang: "th",
    date: "2026-04-15",
    avatar: "/images/reviews/avatar-4.svg",
  },
  // === 英文评价 ===
  {
    id: "r5",
    customerName: "Ahmed R.",
    customerLocation: "Dubai, UAE",
    productName: "DEXOREN Heavy-Duty Anchor Fastener Kit HW-500",
    rating: 5,
    comment: "Used these anchors for a 12-story building project. Load test results were consistently above spec. The TÜV certification gave our engineers confidence. Packaging is well-organized — each size in its own labeled compartment.",
    lang: "en",
    date: "2026-05-20",
    avatar: "/images/reviews/avatar-5.svg",
  },
  {
    id: "r6",
    customerName: "Sarah L.",
    customerLocation: "London, UK",
    productName: "DEXOREN Bed 01",
    rating: 5,
    comment: "Sampled 5 units before placing a bulk order of 100 beds. Every single unit met the same high standard — consistency is incredible for this price point. Delivery was on time, and customer service kept us updated at every stage.",
    lang: "en",
    date: "2026-06-01",
    avatar: "/images/reviews/avatar-6.svg",
  },
  // === 西班牙语评价 ===
  {
    id: "r7",
    customerName: "Carlos M.",
    customerLocation: "Ciudad de México, México",
    productName: "DEXOREN Sofá 05",
    rating: 5,
    comment: "Pedimos 20 unidades para la renovación del lobby de nuestro hotel. La calidad superó las expectativas — la tapicería y la estructura son muy sólidas. El envío llegó bien embalado, cero daños. Tercer pedido con DEXOREN y definitivamente no será el último.",
    lang: "es",
    date: "2026-05-25",
    avatar: "/images/reviews/avatar-7.svg",
  },
  {
    id: "r8",
    customerName: "Maria G.",
    customerLocation: "Barcelona, España",
    productName: "DEXOREN Desengrasante Multiuso CC-300",
    rating: 4,
    comment: "Suministramos productos de limpieza a cocinas comerciales. El desengrasante CC-300 ha sido un éxito — la certificación biodegradable fue un punto clave para nuestros clientes ecológicos. La proporción de dilución es muy rentable.",
    lang: "es",
    date: "2026-06-05",
    avatar: "/images/reviews/avatar-8.svg",
  },
];
