"use client";

import { useRef } from "react";
import { useT } from "@/lib/LanguageContext";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Palette, Shield, Truck, FileCheck, Edit3, Megaphone, Headphones, Package, Crown, ArrowRight, CheckCircle, Star } from "lucide-react";

function Section({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25,0.46,0.45,0.94] }}>{children}</motion.div>;
}

const gradients = [
  "linear-gradient(160deg, #5C5348 0%, #4A4238 100%)",
  "linear-gradient(160deg, #6B6156 0%, #5C5348 100%)",
  "linear-gradient(160deg, #787066 0%, #6B6156 100%)",
];

interface ServiceModule {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  desc: Record<string, string>;
  highlights: Record<string, string[]>;
}

const services: ServiceModule[] = [
  {
    icon: Palette,
    title: { en: "Design & Product Selection", zh: "设计 + 选品", es: "Diseño + Selección de Productos" },
    subtitle: { en: "Free professional 2D/3D layout plans and data-driven product matching", zh: "免费专业2D/3D布局方案与数据驱动选品匹配", es: "Planos 2D/3D profesionales gratuitos y selección basada en datos" },
    desc: {
      en: "Our in-house design team creates customized layout plans tailored to your local market aesthetic, budget and space requirements. We analyze bestselling styles and price points in your region, then recommend high-turnover, low-inventory-risk product combinations. 3 free revisions per project. Supports commercial spaces and residential projects.",
      zh: "自有设计团队根据目标市场审美、预算与空间需求定制布局方案。分析区域热销风格与价格区间，推荐高周转低滞销产品组合。每项目3次免费修改，覆盖商用空间与住宅项目。",
      es: "Nuestro equipo de diseño interno crea planos personalizados adaptados a la estética, presupuesto y espacio de su mercado local. Analizamos los estilos más vendidos y recomendamos combinaciones de alta rotación. 3 revisiones gratuitas por proyecto."
    },
    highlights: {
      en: ["2D/3D layout plans with product specification sheets", "Regional market trend analysis & pricing recommendations", "High-turnover product mix recommendations", "3 free revisions per project", "Commercial & residential project support"],
      zh: ["2D/3D布局方案+产品规格清单", "区域市场趋势分析与定价建议", "高周转产品组合推荐", "每项目3次免费修改", "商用空间与住宅项目全覆盖"],
      es: ["Planos 2D/3D con hojas de especificaciones", "Análisis de tendencias regionales y precios", "Recomendaciones de mezcla de productos", "3 revisiones gratuitas por proyecto", "Soporte para proyectos comerciales y residenciales"],
    }
  },
  {
    icon: Shield,
    title: { en: "Full-Chain Quality Control", zh: "全链路品质管控", es: "Control de Calidad Integral" },
    subtitle: { en: "9-step inspection process with unique batch traceability", zh: "九步质检流程+批次唯一溯源", es: "Proceso de inspección de 9 pasos con trazabilidad única" },
    desc: {
      en: "We execute a rigorous 9-step process: raw material inspection → pre-production test → in-process patrol → semi-finished sampling → finished full inspection → performance test → packaging inspection → pre-loading recheck → outbound registration. Each batch carries a unique traceability code. HD inspection videos and reports provided. Third-party inspection (SGS, Intertek) fully supported for large orders. Cargo damage rate consistently below 0.3%.",
      zh: "执行严格九步流程：原料检测→产前试产→工序巡检→半成品抽检→成品全检→性能测试→包装检测→装柜复核→出库登记。每批次唯一溯源码，提供高清质检视频与报告。大单支持SGS、Intertek第三方驻检。货损率稳定低于0.3%。",
      es: "Ejecutamos un riguroso proceso de 9 pasos. Cada lote lleva un código de trazabilidad único. Videos e informes de inspección HD proporcionados. Inspección por terceros (SGS, Intertek) totalmente soportada. Tasa de daños por debajo del 0.3%."
    },
    highlights: {
      en: ["9-step full-process quality inspection", "Unique batch traceability code system", "HD inspection videos & detailed reports", "Third-party inspection (SGS, Intertek) supported", "Cargo damage rate below 0.3%", "Professional reinforced export packaging"],
      zh: ["九步全流程质量检验", "批次唯一溯源编码体系", "高清质检视频与详细报告", "支持第三方驻检(SGS/Intertek)", "货损率低于0.3%", "专业加固出口包装"],
      es: ["Inspección de 9 pasos", "Sistema de código de trazabilidad único", "Videos HD e informes detallados", "Inspección externa soportada (SGS, Intertek)", "Tasa de daños <0.3%", "Embalaje reforzado profesional"],
    }
  },
  {
    icon: Edit3,
    title: { en: "Flexible OEM/ODM & Private Label", zh: "柔性定制与贴牌代工", es: "OEM/ODM Flexible y Marca Privada" },
    subtitle: { en: "3-level customization — from free basic to deep OEM with dedicated lines", zh: "三层梯度定制——从免费基础到深度OEM专属产线", es: "3 niveles — desde básico gratuito hasta OEM profundo con líneas dedicadas" },
    desc: {
      en: "Level 1 (Free): size, color, carton marking, multilingual manuals. Level 2: pattern redesign, partial structural modification. Level 3 (Deep OEM): new mold, formula customization, exclusive product line. Dedicated small-batch custom lines break the high-MOQ barrier. Fast sampling: 3-5 days regular, 7-10 days custom. Private label service includes custom packaging, logo imprinting and branded documentation.",
      zh: "第一层免费：尺寸/配色/唛头/多语种说明书。第二层：花型重设计/局部结构修改。第三层深度OEM：全新开模/配方定制/专属产线。特设小批量定制线打破高起订壁垒。快速打样：常规3-5天，定制7-10天。贴牌服务涵盖定制包装、LOGO刻印、品牌化文档。",
      es: "Nivel 1 Gratis: tamaño, color, marcas, manuales. Nivel 2: rediseño de patrón, modificación estructural. Nivel 3 OEM Profundo: nuevo molde, personalización de fórmula. Líneas dedicadas para lotes pequeños. Muestreo rápido: 3-5 días regular, 7-10 personalizado."
    },
    highlights: {
      en: ["3-level: Free / Medium / Deep OEM", "Dedicated small-batch production lines", "Fast sampling: 3-5 days regular", "Private label for local brand building", "Mixed-category customization OK", "Free multilingual manual & label design"],
      zh: ["三层定制：免费/中端/深度OEM", "小批量专属生产线", "快速打样：常规3-5天", "贴牌代工助力本土品牌", "跨品类混定支持", "免费多语种说明书设计"],
      es: ["3 niveles: Gratis / Medio / Profundo", "Líneas dedicadas para lotes pequeños", "Muestreo rápido: 3-5 días", "Marca privada para marca local", "Personalización mixta OK", "Diseño gratuito de manuales"],
    }
  },
  {
    icon: Truck,
    title: { en: "Global Logistics & Warehousing", zh: "全球物流与仓储网络", es: "Logística Global y Almacenamiento" },
    subtitle: { en: "FCL · LCL · Air · Railway + overseas warehouses on 3 continents", zh: "整柜·拼箱·空运·铁路+三大洲海外仓", es: "FCL · LCL · Aéreo · Ferroviario + almacenes en 3 continentes" },
    desc: {
      en: "Four shipping channels covering all volumes. Distributed warehouses in Europe, SE Asia and CIS regions for consolidation, storage, local delivery and dropshipping. Multi-factory goods consolidated in our warehouse for one shipment saves 20-35% on logistics. DDP/DDU door-to-door with complete customs docs. 97% on-time delivery, 3-layer reinforced export packaging.",
      zh: "四大渠道覆盖全货量。欧洲、东南亚、独联体分布式仓储，提供集货、仓储、本地配送、一件代发。多工厂集货拼柜一次发运省20-35%物流费。DDP/DDU门到门+全套清关单证。97%准时交付，三层加固出口包装。",
      es: "Cuatro canales para todos los volúmenes. Almacenes en Europa, SE Asiático y CEI. Consolidación de múltiples fábricas ahorra 20-35%. DDP/DDU puerta a puerta con documentación. 97% entrega puntual."
    },
    highlights: {
      en: ["FCL · LCL · Air Freight · Railway", "Overseas warehouses ×3 continents", "Multi-factory consolidation service", "DDP/DDU door-to-door + customs", "97% on-time delivery rate", "3-layer reinforced packaging"],
      zh: ["整柜·拼箱·空运·铁路", "三大洲海外仓布局", "多工厂集货拼柜服务", "DDP/DDU门到门+清关", "97%准时交付率", "三层加固出口包装"],
      es: ["FCL·LCL·Aéreo·Ferrocarril", "Almacenes ×3 continentes", "Consolidación multifábrica", "DDP/DDU puerta a puerta", "97% entrega puntual", "Embalaje reforzado 3 capas"],
    }
  },
  {
    icon: FileCheck,
    title: { en: "Global Compliance Service", zh: "全球合规一站式服务", es: "Servicio de Cumplimiento Global" },
    subtitle: { en: "Pre-packaged certification bundles per target country", zh: "按目标国家预打包认证方案", es: "Paquetes de certificación por país objetivo" },
    desc: {
      en: "Dedicated compliance team tracks global regulations in real time. Pre-packaged certification bundles: CE, UKCA, EAC, SABER, SASO, DOE, ADA, TISI, SIRIM and more. All factory-original, valid for customs, bidding and platform sales. Compliant multilingual labels, MSDS sheets and PFAS-free docs included. All products PFAS-free, low-VOC, heavy-metal-free.",
      zh: "专职合规团队实时追踪全球法规。预打包认证方案涵盖CE、UKCA、EAC、SABER、SASO、DOE、ADA、TISI、SIRIM等。全部工厂原厂出具，可用于清关、投标、平台上架。配套多语种合规标签、MSDS安全表及无PFAS文件。全系产品无PFAS、低VOC、无重金属。",
      es: "Equipo dedicado rastrea regulaciones globales. Paquetes de certificación: CE, UKCA, EAC, SABER, SASO, DOE, ADA, TISI, SIRIM. Todos originales de fábrica. Etiquetas multilingües, MSDS y documentos libres de PFAS incluidos."
    },
    highlights: {
      en: ["Country-specific certification bundles", "CE·UKCA·EAC·SABER·DOE·ADA·TISI", "MSDS safety data sheets", "Multilingual compliant label design", "PFAS-free · Low-VOC · Heavy-metal-free", "Real-time global regulation tracking"],
      zh: ["分国预打包认证方案", "CE·UKCA·EAC·SABER·DOE·ADA·TISI", "MSDS安全数据表", "多语种合规标签设计", "无PFAS·低VOC·无重金属", "全球法规实时追踪"],
      es: ["Paquetes por país", "CE·UKCA·EAC·SABER·DOE·ADA·TISI", "Hojas MSDS", "Etiquetas multilingües", "Libre PFAS·Bajo COV", "Seguimiento regulatorio"],
    }
  },
  {
    icon: Headphones,
    title: { en: "24/7 Global After-Sales", zh: "全天候全球售后保障", es: "Postventa Global 24/7" },
    subtitle: { en: "7 languages · free replacement · remote guidance · unified warranty", zh: "七语种·免费补发·远程指导·统一质保", es: "7 idiomas · reemplazo gratis · guía remota · garantía unificada" },
    desc: {
      en: "7×24 multilingual support in 7 languages — zero time-zone barriers. Global unified warranty: standard factory warranty for materials, 12-month for electrical/cleaning products. Free replacement for transit damage or defects. Remote technical guidance for construction. 24h response, 48h resolution. Framework clients get dedicated managers with priority channels.",
      zh: "七大语种7×24小时客服——零时差障碍。全球统一质保：建材标准原厂质保，电器清洁类12个月。运输破损或质量问题免费补发。施工远程技术指导。24小时响应、48小时闭环。框架客户配备专属经理与优先通道。",
      es: "Soporte multilingüe 7×24 en 7 idiomas. Garantía unificada global. Reemplazo gratuito por daños o defectos. Orientación técnica remota. Respuesta 24h, resolución 48h. Clientes marco con gerentes dedicados."
    },
    highlights: {
      en: ["7×24 support in 7 languages", "Global unified warranty", "Free damage replacement", "Remote technical guidance", "24h response · 48h resolution", "Dedicated framework managers"],
      zh: ["七大语种7×24支持", "全球统一质保体系", "破损免费补发", "远程技术指导", "24h响应·48h闭环", "框架客户专属经理"],
      es: ["7 idiomas × 24/7", "Garantía unificada global", "Reemplazo gratuito", "Guía técnica remota", "24h respuesta · 48h solución", "Gerentes dedicados"],
    }
  },
  {
    icon: Megaphone,
    title: { en: "Marketing Empowerment", zh: "营销素材赋能", es: "Marketing y Materiales" },
    subtitle: { en: "Free copyright-free commercial materials for all partners", zh: "合作客户免费商用素材，无版权限制", es: "Materiales comerciales gratuitos sin derechos de autor" },
    desc: {
      en: "Complete suite of professional marketing materials at no cost: HD product images, promotional videos, 3D models, multilingual social media templates, PDF catalogs and trade show designs. All copyright-free for commercial use. Monthly global industry trend reports. Qualified partners receive official joint promotion on our website and social channels.",
      zh: "全套专业营销素材免费提供：高清产品图、宣传视频、3D模型、多语种社媒模板、PDF画册、展会设计稿。全部无版权商用限制。月度全球行业趋势报告。优质合作伙伴享受官网与社媒联合推广。",
      es: "Suite completo de materiales profesionales sin costo: imágenes HD, videos, modelos 3D, plantillas multilingües, catálogos PDF. Sin derechos de autor. Informes mensuales de tendencias. Promoción conjunta para socios calificados."
    },
    highlights: {
      en: ["HD product images & videos", "3D models & trade show designs", "Social media copy templates", "PDF product catalogs", "Monthly industry trend reports", "Official joint promotion"],
      zh: ["高清产品图与视频", "3D模型与展会设计", "社媒文案模板", "PDF产品画册", "月度行业趋势报告", "官方联合推广"],
      es: ["Imágenes HD y videos", "Modelos 3D y diseños", "Plantillas para redes", "Catálogos PDF", "Informes mensuales", "Promoción conjunta"],
    }
  },
  {
    icon: Crown,
    title: { en: "VIP Membership Program", zh: "VIP会员体系", es: "Programa VIP" },
    subtitle: { en: "Global unified points · tiered benefits · price lock for framework clients", zh: "全球统一积分·阶梯权益·框架客户锁价", es: "Puntos unificados · beneficios escalonados · bloqueo de precio" },
    desc: {
      en: "Global unified membership — transparent rules, zero regional discrimination. Points earned on every purchase redeemable for samples, discounts, priority production and custom design. Higher annual volume unlocks richer benefits. Framework clients enjoy 12-month price lock and dedicated account managers. Simple, fair, rewarding long-term partnership.",
      zh: "全球统一会员体系——规则透明，零区域差别。每次采购累积积分可兑换样品、折扣、优先排产、定制设计。年度采购越高等级越高。框架客户享12个月锁价与专属客户经理。简单公平，奖励长期合作。",
      es: "Membresía unificada global — reglas transparentes. Puntos canjeables por muestras, descuentos, producción prioritaria. Clientes marco disfrutan bloqueo de precios de 12 meses y gerentes dedicados."
    },
    highlights: {
      en: ["Global unified points system", "Redeem for samples & discounts", "Tiered membership benefits", "12-month price lock", "Dedicated account manager", "Zero regional discrimination"],
      zh: ["全球统一积分体系", "兑换样品与折扣", "阶梯会员权益", "12个月锁价协议", "专属客户经理", "零区域差别对待"],
      es: ["Puntos unificados globales", "Canje por muestras y descuentos", "Beneficios escalonados", "Bloqueo 12 meses", "Gerente dedicado", "Sin discriminación regional"],
    }
  },
  {
    icon: Package,
    title: { en: "Supply Chain Integration", zh: "供应链整合集货", es: "Integración de Suministro" },
    subtitle: { en: "One order, all categories — consolidate multiple factories into one shipment", zh: "一单配齐全品类——多工厂集货一次发运", es: "Un pedido, todas las categorías — consolidación en un envío" },
    desc: {
      en: "Strategic partnerships with dozens of qualified factories covering all categories. Unified production standards and QC across all partners. Single-order full-category sourcing eliminates managing multiple suppliers. Cross-factory consolidation saves 20-35% on logistics and significantly reduces communication overhead.",
      zh: "数十家优质工厂战略合作，覆盖全品类。统一生产标准与品控规范。单一订单全品类采购，无需对接多家供应商。跨工厂集货拼柜节省20-35%物流成本，大幅降低沟通开销。",
      es: "Asociaciones estratégicas con docenas de fábricas. Estándares unificados. Abastecimiento integral en un solo pedido. Consolidación entre fábricas ahorra 20-35% en logística."
    },
    highlights: {
      en: ["Dozens of partner factories", "Unified production & QC standards", "Single-order full-category sourcing", "Cross-factory consolidation", "20-35% logistics cost savings", "Reduced supplier management"],
      zh: ["数十家合作工厂", "统一生产与品控标准", "单订单全品类采购", "跨工厂集货拼柜", "物流成本节省20-35%", "降低供应商管理复杂度"],
      es: ["Docenas de fábricas", "Estándares unificados", "Pedido único integral", "Consolidación entre fábricas", "Ahorro 20-35%", "Gestión simplificada"],
    }
  },
];

export default function ServicesPage() {
  const { locale } = useT();

  return (
    <main className="bg-[#F5F2EF] dark:bg-[#12100E]">
      {/* Hero */}
      <section className="relative bg-[#3D3730] pt-[56px] pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center pt-14">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-[10px] text-[#B8A080] font-semibold uppercase tracking-[0.25em] mb-4">
            {locale === "zh" ? "不止供货 · 全方位赋能" : locale === "es" ? "Más Allá del Suministro" : "Beyond Supply · Full Empowerment"}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-[-0.02em] leading-tight">
            {locale === "zh" ? "全方位增值服务体系" : locale === "es" ? "Servicios Integrales de Valor Agregado" : "Comprehensive Value-Added Services"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-white/35 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {locale === "zh" ? "从设计选品到品质管控，从柔性定制到全球物流——九大核心服务模块，为全球B端合作伙伴提供一站式供应链解决方案" : locale === "es" ? "Desde diseño hasta logística — nueve módulos para socios B2B globales" : "From design to logistics — nine core service modules for global B2B partners"}
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F5F2EF] dark:to-[#12100E]" />
      </section>

      {/* Service modules */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="space-y-8 md:space-y-10">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Section key={i}>
                <div className="bg-white dark:bg-[#1A1816] rounded-2xl border border-[#E8E2DC] dark:border-white/[0.06] overflow-hidden hover:shadow-[0_2px_20px_rgba(60,50,40,0.04)] transition-shadow duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">
                    {/* Left panel */}
                    <div className="relative overflow-hidden p-6 md:p-10 flex flex-col justify-between" style={{ background: gradients[i % 3] }}>
                      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")` }} />
                      <div className="relative">
                        <p className="text-[10px] text-white/25 font-mono tracking-[0.15em] mb-3">0{i + 1}</p>
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                          <Icon className="w-5 h-5 text-white" strokeWidth={1.2} />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">{s.title[locale as keyof typeof s.title] || s.title.en}</h2>
                        <p className="text-white/45 text-sm leading-relaxed">{s.subtitle[locale as keyof typeof s.subtitle] || s.subtitle.en}</p>
                      </div>
                      <div className="relative mt-6 space-y-2">
                        {(s.highlights[locale as keyof typeof s.highlights] || s.highlights.en).map((h, j) => (
                          <div key={j} className="flex items-start gap-2 text-white/55 text-xs">
                            <CheckCircle className="w-3.5 h-3.5 text-white/35 shrink-0 mt-0.5" />
                            {h}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Right content */}
                    <div className="p-6 md:p-10 flex flex-col justify-center">
                      <p className="text-[15px] text-[#6B6058] dark:text-white/45 leading-relaxed">
                        {s.desc[locale as keyof typeof s.desc] || s.desc.en}
                      </p>
                    </div>
                  </div>
                </div>
              </Section>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <Section>
        <div className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="bg-white dark:bg-[#1A1816] rounded-2xl border border-[#E8E2DC] dark:border-white/[0.06] p-8 md:p-12">
            <Star className="w-8 h-8 text-[#B8A080] mx-auto mb-4" strokeWidth={1} />
            <h2 className="text-xl md:text-2xl font-bold text-[#3D3730] dark:text-[#D4C8B8] mb-3 tracking-tight">
              {locale === "zh" ? "所有增值服务对合作客户免费开放" : locale === "es" ? "Servicios Gratuitos para Clientes" : "All Services Free for Cooperative Clients"}
            </h2>
            <p className="text-[14px] text-[#7B7068] dark:text-white/35 mb-8 max-w-lg mx-auto leading-relaxed">
              {locale === "zh" ? "我们不靠服务赚钱——服务是我们的差异化壁垒。九大增值服务对合作客户完全免费，仅第三方工本费按实收取。" : locale === "es" ? "No ganamos con los servicios — son nuestra ventaja. Los nueve servicios son gratuitos." : "We don't profit from services — they are our competitive edge. All nine services free for cooperative clients."}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#C8B8A0] transition-all duration-300 shadow-sm">
                {locale === "zh" ? "立即咨询" : locale === "es" ? "Consultar" : "Get Started"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/products" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#E8E2DC] dark:border-white/10 text-[#6B6058] dark:text-white/40 font-medium text-sm hover:border-[#B8A080] hover:text-[#B8A080] transition-all duration-300">
                {locale === "zh" ? "浏览产品" : locale === "es" ? "Ver Productos" : "Browse Products"}
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
