"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/LanguageContext";
import { motion, useInView } from "framer-motion";
import { faqGroups } from "@/data/faq";
import { siteConfig } from "@/data/site-config";
import { faqSchema, JsonLD } from "@/lib/schema-org";
import type { Locale } from "@/lib/localizeProduct";
import { Plus, MessageCircle, FileCheck, Truck, ArrowUpRight } from "lucide-react";

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

export default function FaqPage() {
  const { t, locale } = useT();
  const loc = locale as Locale;
  const wa = siteConfig.contact.phone.href;
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (key: string) => setOpen(open === key ? null : key);

  // Flatten for FAQPage structured data (English)
  const structured = faqGroups.flatMap((g) =>
    g.items.map((it) => ({ question: it.q[loc] || it.q.en, answer: it.a[loc] || it.a.en }))
  );

  return (
    <main className="bg-[#F5F2EF] dark:bg-[#12100E]">
      <JsonLD data={faqSchema(structured)} />

      {/* Hero */}
      <section className="relative bg-[#3D3730] pt-[56px] pb-16 md:pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 lg:px-8 text-center pt-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] text-[#B8A080] font-semibold uppercase tracking-[0.25em] mb-4"
          >
            {t("faqPage.heroLabel")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[36px] md:text-[54px] font-bold text-white leading-[1.08] tracking-[-0.025em] mb-5"
          >
            {t("faqPage.heroTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/35 text-base max-w-2xl mx-auto leading-relaxed"
          >
            {t("faqPage.heroSubtitle")}
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F5F2EF] dark:to-[#12100E]" />
      </section>

      {/* FAQ accordion by group */}
      <Section>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 md:py-20">
          {faqGroups.map((group, gi) => (
            <div key={group.id} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[11px] font-bold text-[#B8A080] tracking-[0.2em]">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <h2 className="text-[20px] md:text-[24px] font-bold text-[#3D3730] dark:text-[#D4C8B8] tracking-tight">
                  {group.label[loc] || group.label.en}
                </h2>
                <div className="flex-1 h-px bg-[#E8E2DC] dark:bg-white/10" />
              </div>

              <div className="space-y-3">
                {group.items.map((item, ii) => {
                  const key = `${group.id}-${ii}`;
                  const isOpen = open === key;
                  return (
                    <div
                      key={key}
                      className={`bg-white dark:bg-[#1A1816] rounded-xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? "border-[#B8A080]/50 shadow-[0_8px_30px_rgba(61,55,48,0.08)]"
                          : "border-[#E8E2DC] dark:border-white/5 hover:border-[#B8A080]/30"
                      }`}
                    >
                      <button
                        onClick={() => toggle(key)}
                        aria-expanded={isOpen}
                        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="text-[15px] font-semibold text-[#3D3730] dark:text-[#D4C8B8] leading-snug">
                          {item.q[loc] || item.q.en}
                        </span>
                        <span
                          className={`shrink-0 mt-0.5 w-6 h-6 rounded-full border border-[#E8E2DC] dark:border-white/10 flex items-center justify-center text-[#B8A080] transition-transform duration-300 ${
                            isOpen ? "rotate-45 bg-[#B8A080] text-white border-[#B8A080]" : ""
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </span>
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="px-5 pb-5"
                        >
                          <p className="text-[14px] text-[#9B8E7E] dark:text-white/40 leading-relaxed pt-1 border-t border-[#E8E2DC] dark:border-white/5">
                            {item.a[loc] || item.a.en}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Helpful links */}
      <Section>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/certifications"
              className="group flex items-center gap-4 bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/5 p-5 hover:border-[#B8A080]/40 hover:shadow-[0_8px_30px_rgba(61,55,48,0.08)] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#B8A080]/12 flex items-center justify-center text-[#B8A080]">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-[#3D3730] dark:text-[#D4C8B8]">
                  {t("faqPage.linkCerts")}
                </p>
                <p className="text-[13px] text-[#9B8E7E] dark:text-white/30">{t("faqPage.linkCertsDesc")}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#B8A080] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link
              href="/trade-terms"
              className="group flex items-center gap-4 bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/5 p-5 hover:border-[#B8A080]/40 hover:shadow-[0_8px_30px_rgba(61,55,48,0.08)] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#B8A080]/12 flex items-center justify-center text-[#B8A080]">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-[#3D3730] dark:text-[#D4C8B8]">
                  {t("faqPage.linkTrade")}
                </p>
                <p className="text-[13px] text-[#9B8E7E] dark:text-white/30">{t("faqPage.linkTradeDesc")}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#B8A080] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 pb-20 md:pb-28">
          <div className="relative bg-[#3D3730] rounded-2xl p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,160,128,0.18),transparent_55%)]" />
            <div className="relative">
              <h3 className="text-[24px] md:text-[30px] font-bold text-white tracking-[-0.02em] mb-3">
                {t("faqPage.ctaTitle")}
              </h3>
              <p className="text-white/40 text-[15px] max-w-xl mx-auto leading-relaxed mb-7">
                {t("faqPage.ctaDesc")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-[#25D366] text-white font-semibold text-[14px] hover:brightness-110 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-[#B8A080] text-white font-semibold text-[14px] hover:bg-[#A89070] transition-all"
                >
                  {t("contact.title")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
