"use client";

import { useRef } from "react";
import Link from "next/link";
import { useT } from "@/lib/LanguageContext";
import { motion, useInView } from "framer-motion";
import { certifications } from "@/data/certifications";
import { siteConfig } from "@/data/site-config";
import type { Locale } from "@/lib/localizeProduct";
import {
  Award,
  Leaf,
  Shield,
  Recycle,
  Radio,
  BadgeCheck,
  FlaskConical,
  Globe,
  ArrowUpRight,
  FileCheck,
  CheckCircle2,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  award: Award,
  leaf: Leaf,
  shield: Shield,
  recycle: Recycle,
  radio: Radio,
  badge: BadgeCheck,
  flask: FlaskConical,
  globe: Globe,
  certificate: FileCheck,
};

function Section({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.section>
  );
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

export default function CertificationsPage() {
  const { t, locale } = useT();
  const loc = locale as Locale;
  const wa = siteConfig.contact.phone.href;

  return (
    <main className="bg-[#F5F2EF] dark:bg-[#12100E]">
      {/* Hero */}
      <section className="relative bg-[#3D3730] pt-[56px] pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")` }} />
        <div className="relative max-w-4xl mx-auto px-4 lg:px-8 text-center pt-12">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-[10px] text-[#B8A080] font-semibold uppercase tracking-[0.25em] mb-4">{t("certifications.heroLabel")}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-[36px] md:text-[54px] font-bold text-white leading-[1.08] tracking-[-0.025em] mb-5">
            {t("certifications.heroTitle")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white/35 text-base max-w-2xl mx-auto leading-relaxed">
            {t("certifications.heroSubtitle")}
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F5F2EF] dark:to-[#12100E]" />
      </section>

      {/* Cert grid */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 md:py-24">
          <SectionHeader label={t("about.certsLabel")} title={t("certifications.introTitle")} subtitle={t("certifications.introDesc")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certifications.map((c, i) => {
              const Icon = iconMap[c.icon] ?? Award;
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.04 * i }}
                  className="group relative bg-white dark:bg-[#1A1816] rounded-2xl border border-[#E8E2DC] dark:border-white/5 p-6 hover:shadow-[0_12px_40px_rgba(61,55,48,0.10)] hover:border-[#B8A080]/40 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#B8A080]/12 flex items-center justify-center text-[#B8A080] group-hover:bg-[#B8A080]/20 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#3D3730] text-white text-[11px] font-bold tracking-wide">{c.code}</span>
                  </div>
                  <h3 className="text-[17px] font-bold text-[#3D3730] dark:text-[#D4C8B8] leading-snug mb-2">{c.fullName[loc]}</h3>
                  <p className="text-[13.5px] text-[#9B8E7E] dark:text-white/30 leading-relaxed mb-5">{c.desc[loc]}</p>
                  <div className="space-y-2 pt-4 border-t border-[#E8E2DC] dark:border-white/5">
                    <div className="flex items-center gap-2 text-[12.5px]">
                      <span className="text-[#B8A080]"><CheckCircle2 className="w-3.5 h-3.5" /></span>
                      <span className="text-[#7B7068] dark:text-white/40 font-medium">{t("certifications.applicableTo")}:</span>
                      <span className="text-[#3D3730] dark:text-white/60">{c.appliesTo[loc]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12.5px]">
                      <span className="text-[#B8A080]"><Globe className="w-3.5 h-3.5" /></span>
                      <span className="text-[#7B7068] dark:text-white/40 font-medium">{t("certifications.region")}:</span>
                      <span className="text-[#3D3730] dark:text-white/60">{c.region[loc]}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Request CTA */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-20 md:pb-28">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A4238] via-[#5C554D] to-[#3D3730] px-8 py-12 md:px-14 md:py-16">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")` }} />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white"><FileCheck className="w-5 h-5" /></span>
                  <span className="text-[11px] text-white/50 font-semibold uppercase tracking-[0.2em]">{t("about.compliance")}</span>
                </div>
                <h3 className="text-[24px] md:text-[30px] font-bold text-white leading-tight mb-3">{t("certifications.requestTitle")}</h3>
                <p className="text-white/40 text-[14.5px] leading-relaxed max-w-md">{t("certifications.requestDesc")}</p>
              </div>
              <div className="flex flex-col sm:flex-row md:justify-end gap-3">
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#B8A080] text-[#3D3730] font-semibold text-sm hover:bg-[#c9b591] transition-colors"
                >
                  {t("certifications.requestBtn")}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-colors"
                >
                  {t("contact.title")}
                </Link>
              </div>
            </div>
            <p className="relative mt-8 pt-6 border-t border-white/10 text-white/30 text-[12.5px] leading-relaxed">{t("certifications.downloadNote")}</p>
          </div>
        </div>
      </Section>
    </main>
  );
}
