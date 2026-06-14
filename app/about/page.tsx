"use client";

import { useRef } from "react";
import { useT } from "@/lib/LanguageContext";
import { motion, useInView } from "framer-motion";
import { timeline, values, certs, teamRoles } from "@/data/about";
import { Award, Factory, Globe, TrendingUp, Video, CheckCircle, Eye, ArrowRight, Shield, FlaskConical, Truck, Microscope } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Factory, Eye, Shield, TrendingUp, FlaskConical, Microscope, Globe, Truck,
};

function Section({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return <motion.section ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25,0.46,0.45,0.94] }}>{children}</motion.section>;
}

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <p className="text-[11px] text-[#B8A080] font-semibold uppercase tracking-[0.2em] mb-3">{label}</p>
      <h2 className="text-[28px] md:text-[36px] font-bold text-[#3D3730] dark:text-[#D4C8B8] tracking-[-0.02em] leading-[1.15] mb-4">{title}</h2>
      {subtitle && <p className="text-[15px] text-[#9B8E7E] dark:text-white/30 leading-relaxed max-w-xl mx-auto">{subtitle}</p>}
      <div className="flex justify-center mt-5"><div className="h-px w-12 bg-gradient-to-r from-transparent via-[#B8A080]/40 to-transparent" /></div>
    </div>
  );
}

export default function AboutPage() {
  const { t, locale } = useT();

  return (
    <main className="bg-[#F5F2EF] dark:bg-[#12100E]">
      {/* ═══════ Hero ═══════ */}
      <section className="relative bg-[#3D3730] pt-[56px] pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")` }} />
        <div className="relative max-w-4xl mx-auto px-4 lg:px-8 text-center pt-12">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-[10px] text-[#B8A080] font-semibold uppercase tracking-[0.25em] mb-4">{t("about.label")}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-[36px] md:text-[54px] font-bold text-white leading-[1.08] tracking-[-0.025em] mb-5">
            {locale === "zh" ? "全球化家居建材源头制造品牌" : locale === "es" ? "Marca Global de Fabricación" : "Global Home & Building Materials Manufacturer"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/35 text-base max-w-xl mx-auto leading-relaxed">
            {locale === "zh" ? "集自主研发、规模化生产、全球销售与一站式供应链服务于一体的现代化制造品牌" : locale === "es" ? "Marca moderna que integra I+D, producción a gran escala y servicios globales" : "Integrating R&D, large-scale production, global distribution and supply chain services"}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-8 inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.08]">
            <CheckCircle className="w-4 h-4 text-[#B8A080]" />
            <span className="text-white/60 text-sm font-medium italic tracking-wide">{t("about.tagline")}</span>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F5F2EF] dark:to-[#12100E]" />
      </section>

      {/* ═══════ Brand Intro ═══════ */}
      <Section>
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10 md:py-24">
          <SectionHeader
            label={locale === "zh" ? "品牌定位" : locale === "es" ? "Posicionamiento" : "Positioning"}
            title={locale === "zh" ? "关于盛煜实业" : locale === "es" ? "Sobre Shengyu Industrial" : "About Shengyu Industrial"}
          />
          <div className="space-y-5 text-[15px] leading-relaxed text-[#6B6058] dark:text-white/50">
            <p>
              {locale === "zh"
                ? "盛煜实业创立于2002年，是一家集自主研发、规模化生产、全球销售、一站式供应链服务于一体的现代化家居建材制造品牌。我们以自有生产基地为核心，面向全球进口商、工程承包商、连锁零售商、跨境B端卖家提供工厂直供全品类建材与一体化解决方案。"
                : locale === "es"
                  ? "Shengyu Industrial, fundada en 2002, es una marca moderna de fabricación que integra I+D, producción a gran escala, ventas globales y servicios de cadena de suministro. Proporcionamos productos directos de fábrica para importadores, contratistas y minoristas globales."
                  : "Shengyu Industrial was founded in 2002 — a modern manufacturing brand integrating R&D, large-scale production, global sales and supply chain services. Operating self-owned production bases, we deliver factory-direct products and integrated solutions for global importers, contractors, chain retailers and B2B cross-border sellers."}
            </p>
            <p>
              {locale === "zh"
                ? "深耕行业二十余年，我们秉持「品质为基、合规为先、服务为本、长期共赢」的核心价值观。不依靠产品差价盈利，仅收取标准化服务费用。如今产品与服务已覆盖全球30+国家，成为众多海外工程企业、连锁商超、区域分销商的长期战略合作伙伴。"
                : locale === "es"
                  ? "Con más de 20 años en la industria, nos adherimos a los valores de Calidad, Cumplimiento, Servicio y Cooperación. No dependemos del margen de productos. Hoy servimos a clientes en más de 30 países."
                  : "With over 20 years of expertise, we uphold Quality First, Compliance First, Service-Oriented and Win-win Cooperation. We do not profit from product markup — charging only standardized service fees. Today we serve B2B partners across 30+ countries."}
            </p>
          </div>
        </div>
      </Section>

      {/* ═══════ Values ═══════ */}
      <Section>
        <div className="bg-white dark:bg-[#1A1816] py-10 md:py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <SectionHeader label={locale === "zh" ? "品牌理念" : locale === "es" ? "Filosofía" : "Philosophy"} title={t("about.valuesLabel")} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {values.map((v, i) => {
                const IconComponent = iconMap[v.icon] || Shield;
                return (
                  <div key={i} className="bg-[#F5F2EF] dark:bg-[#12100E] rounded-2xl border border-[#E8E2DC] dark:border-white/[0.06] p-5 md:p-7 group hover:shadow-sm hover:border-[#D4C8B8]/60 transition-all duration-500">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B8A080]/15 to-[#B8A080]/5 flex items-center justify-center mb-5">
                      <IconComponent className="w-5 h-5 text-[#B8A080]" />
                    </div>
                    <h3 className="text-base font-bold text-[#3D3730] dark:text-[#D4C8B8] mb-2.5">{v.title[locale] || v.title.en}</h3>
                    <p className="text-[13px] text-[#8B8078] dark:text-white/35 leading-relaxed">{v.desc[locale] || v.desc.en}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ Team ═══════ */}
      <Section>
        <div className="py-10 md:py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <SectionHeader
              label={locale === "zh" ? "专业团队" : locale === "es" ? "Equipo" : "Team"}
              title={t("about.team.title")}
              subtitle={locale === "zh" ? "四大职能团队覆盖研发、品控、商务与物流清关" : locale === "es" ? "Cuatro equipos cubriendo I+D, calidad, negocios y logística" : "Four specialized teams covering R&D, QC, global business and logistics"}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamRoles.map((role, i) => {
                const IconComponent = iconMap[role.icon] || Globe;
                return (
                  <div key={i} className="bg-white dark:bg-[#1A1816] rounded-2xl border border-[#E8E2DC] dark:border-white/[0.06] p-5 md:p-7 text-center group hover:shadow-sm transition-all duration-500">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F5F2EF] to-[#EFEDE8] dark:from-white/5 dark:to-transparent flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-[#B8A080]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#3D3730] dark:text-[#D4C8B8] mb-2">{role.title[locale] || role.title.en}</h3>
                    <p className="text-[12px] text-[#8B8078] dark:text-white/35 leading-relaxed">{role.desc[locale] || role.desc.en}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ Services Link ═══════ */}
      <Section>
        <div className="bg-white dark:bg-[#1A1816] py-8 md:py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-[11px] text-[#B8A080] font-semibold uppercase tracking-[0.2em] mb-3">
              {locale === "zh" ? "不止产品" : locale === "es" ? "Más Allá del Producto" : "Beyond Products"}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3D3730] dark:text-[#D4C8B8] mb-3 tracking-tight">
              {locale === "zh" ? "9大增值服务，全方位赋能您的业务" : locale === "es" ? "9 Servicios Integrales para su Negocio" : "9 Value-Added Services to Empower Your Business"}
            </h2>
            <p className="text-[14px] text-[#7B7068] dark:text-white/35 mb-6 max-w-lg mx-auto leading-relaxed">
              {locale === "zh" ? "从设计选品到品质管控，从柔性定制到全球物流——查看我们的完整服务体系" : locale === "es" ? "Desde diseño hasta logística — vea nuestros servicios completos" : "From design to logistics — explore our complete service system"}
            </p>
            <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#C8B8A0] transition-all duration-300 shadow-sm">
              {locale === "zh" ? "查看全部服务" : locale === "es" ? "Ver Servicios" : "View All Services"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ═══════ Timeline ═══════ */}
      <Section>
        <div className="py-10 md:py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <SectionHeader label={t("about.journeyLabel")} title={t("about.journeyTitle")} subtitle={t("about.journeyDesc")} />
            <div className="relative">
              <div className="hidden lg:block absolute top-8 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-[#D4C8B8]/60 to-transparent" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {timeline.map((item) => (
                  <div key={item.year} className="relative pt-8">
                    <div className="hidden lg:block absolute top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#B8A080] ring-4 ring-[#F5F2EF] dark:ring-[#12100E]" />
                    <div className="bg-white dark:bg-[#1A1816] rounded-2xl border border-[#E8E2DC] dark:border-white/[0.06] p-5 text-center h-full">
                      <span className="text-xl font-bold text-[#B8A080]">{item.year}</span>
                      <h4 className="text-[13px] font-semibold text-[#3D3730] dark:text-[#D4C8B8] mt-2 mb-2">{item.title[locale] || item.title.en}</h4>
                      <p className="text-[11px] text-[#8B8078] dark:text-white/30 leading-relaxed">{item.desc[locale] || item.desc.en}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ Certifications ═══════ */}
      <Section>
        <div className="bg-white dark:bg-[#1A1816] py-10 md:py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <SectionHeader
              label={locale === "zh" ? "全域合规" : locale === "es" ? "Cumplimiento" : "Compliance"}
              title={t("about.certsLabel")}
              subtitle={locale === "zh" ? "所有证书均为工厂原厂出具，支持按目标国家一键打包下载" : locale === "es" ? "Certificados originales de fábrica" : "All certificates factory-original, available for per-country download"}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {certs.map((c, i) => (
                <div key={i} className="bg-[#F5F2EF] dark:bg-[#12100E] rounded-2xl border border-[#E8E2DC] dark:border-white/[0.06] p-5 text-center group hover:shadow-sm hover:border-[#D4C8B8]/50 transition-all duration-500">
                  <Award className="w-5 h-5 text-[#B8A080]/60 mx-auto mb-2.5 group-hover:text-[#B8A080] transition-colors" />
                  <h4 className="font-semibold text-[12px] text-[#3D3730] dark:text-[#D4C8B8] mb-1">{c.title[locale] || c.title.en}</h4>
                  <p className="text-[10px] text-[#9B8E7E] dark:text-white/25 leading-relaxed">{c.desc[locale] || c.desc.en}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ Remote Access ═══════ */}
      <Section>
        <div className="py-10 md:py-24">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div className="aspect-video rounded-2xl bg-[#4A4238] flex items-center justify-center">
                <Video className="w-14 h-14 text-white/15" />
              </div>
              <div>
                <span className="text-[11px] text-[#B8A080] font-semibold uppercase tracking-[0.2em]">Access</span>
                <h2 className="text-[28px] md:text-[36px] font-bold text-[#3D3730] dark:text-[#D4C8B8] mt-3 mb-4 tracking-[-0.02em] leading-[1.15]">{t("about.process.title")}</h2>
                <p className="text-[15px] text-[#6B6058] dark:text-white/45 leading-relaxed mb-7">{t("about.process.desc")}</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Video, key: "videoTour" },
                    { icon: Eye, key: "remoteInsp" },
                    { icon: Factory, key: "directFactory" },
                    { icon: TrendingUp, key: "liveDash" },
                  ].map((item) => {
                    const labels: Record<string, Record<string, string>> = {
                      videoTour: { en: "Video Factory Tour", zh: "视频看厂", es: "Tour en Video" },
                      remoteInsp: { en: "Remote Inspection", zh: "远程验货", es: "Inspección Remota" },
                      directFactory: { en: "Direct Factory Access", zh: "工厂直连", es: "Acceso Directo" },
                      liveDash: { en: "Live Dashboard", zh: "实时数据看板", es: "Panel en Vivo" },
                    };
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="flex items-center gap-3 bg-white dark:bg-white/[0.03] rounded-xl px-4 py-3.5 border border-[#E8E2DC] dark:border-white/[0.04] hover:border-[#D4C8B8]/50 transition-all duration-300">
                        <Icon className="w-4 h-4 text-[#B8A080] shrink-0" />
                        <span className="text-[13px] text-[#6B6058] dark:text-white/40 font-medium">{labels[item.key]?.[locale] || labels[item.key].en}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ CTA ═══════ */}
      <Section>
        <div className="bg-white dark:bg-[#1A1816] py-10 md:py-24">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <span className="text-[11px] text-[#B8A080] font-semibold uppercase tracking-[0.2em]">{locale === "zh" ? "携手共赢" : locale === "es" ? "Asociación" : "Partnership"}</span>
            <h2 className="text-[28px] md:text-[38px] font-bold text-[#3D3730] dark:text-[#D4C8B8] mt-4 mb-4 tracking-[-0.02em] leading-[1.15]">
              {locale === "zh" ? "成为我们的长期战略合作伙伴" : locale === "es" ? "Conviértase en Socio Estratégico" : "Become Our Long-Term Strategic Partner"}
            </h2>
            <p className="text-[15px] text-[#7B7068] dark:text-white/35 mb-9 max-w-lg mx-auto leading-relaxed">
              {locale === "zh" ? "无论您是中小零售商、跨境卖家还是大型工程集团，我们都将以统一的品牌标准与专业的服务能力，成为您值得信赖的全球供应链伙伴。" : locale === "es" ? "Ya sea minorista, vendedor transfronterizo o gran grupo de ingeniería, seremos su socio global de confianza." : "Whether small retailer, cross-border seller or large engineering group — we provide unified brand standards and professional capabilities as your trusted global supply chain partner."}
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#C8B8A0] transition-all duration-300 shadow-sm">
              {locale === "zh" ? "洽谈合作" : locale === "es" ? "Contactar" : "Get in Touch"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
