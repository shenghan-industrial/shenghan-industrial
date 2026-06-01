"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StatsCounter } from "@/components/StatsCounter";
import { useT } from "@/lib/LanguageContext";
import {
  Target,
  Eye,
  Heart,
  Zap,
  Award,
  FileCheck,
  GraduationCap,
} from "lucide-react";

export default function AboutPage() {
  const { t } = useT();

  const timeline = [
    { year: "2002", title: t("about.timeline.0.title"), desc: t("about.timeline.0.desc") },
    { year: "2008", title: t("about.timeline.1.title"), desc: t("about.timeline.1.desc") },
    { year: "2013", title: t("about.timeline.2.title"), desc: t("about.timeline.2.desc") },
    { year: "2018", title: t("about.timeline.3.title"), desc: t("about.timeline.3.desc") },
    { year: "2022", title: t("about.timeline.4.title"), desc: t("about.timeline.4.desc") },
    { year: "2025", title: t("about.timeline.5.title"), desc: t("about.timeline.5.desc") },
  ];

  const values = [
    { icon: Target, title: t("about.values.0.title"), desc: t("about.values.0.desc") },
    { icon: Eye, title: t("about.values.1.title"), desc: t("about.values.1.desc") },
    { icon: Heart, title: t("about.values.2.title"), desc: t("about.values.2.desc") },
    { icon: Zap, title: t("about.values.3.title"), desc: t("about.values.3.desc") },
  ];

  const certifications = [
    { icon: Award, title: t("about.certs.0.title"), desc: t("about.certs.0.desc") },
    { icon: FileCheck, title: t("about.certs.1.title"), desc: t("about.certs.1.desc") },
    { icon: GraduationCap, title: t("about.certs.2.title"), desc: t("about.certs.2.desc") },
    { icon: FileCheck, title: t("about.certs.3.title"), desc: t("about.certs.3.desc") },
  ];
  return (
    <>
      <section className="pt-24 md:pt-32 pb-16 md:pb-20 bg-gradient-to-br from-brand-800 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.1),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            label={t("about.label")}
            title={t("about.title")}
            description={t("about.desc")}
            light
          />
        </div>
      </section>

      <section className="py-14 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal>
              <div>
                <span className="text-xs tracking-[0.25em] uppercase font-semibold text-accent-dark mb-4 block">
                  {t("about.storyLabel")}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-800 dark:text-white tracking-tight leading-tight mb-6">
                  {t("about.storyTitle1")}
                  <br />
                  {t("about.storyTitle2")}
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6">
                  {t("about.storyP1")}
                </p>
                <p className="text-text-secondary leading-relaxed mb-6">
                  {t("about.storyP2")}
                </p>
                <p className="text-text-secondary leading-relaxed">
                  {t("about.storyP3")}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-brand-800 to-brand-900 dark:from-brand-800/60 dark:to-brand-900/80 flex items-center justify-center overflow-hidden relative">
                  <svg viewBox="0 0 400 500" className="w-full h-full absolute inset-0 opacity-30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="60" y="180" width="120" height="200" rx="4" fill="currentColor" className="text-accent/20" />
                    <rect x="80" y="160" width="80" height="20" rx="2" fill="currentColor" className="text-accent/30" />
                    <rect x="100" y="130" width="40" height="30" rx="2" fill="currentColor" className="text-accent/25" />
                    <rect x="220" y="240" width="120" height="140" rx="4" fill="currentColor" className="text-accent/20" />
                    <rect x="240" y="220" width="80" height="20" rx="2" fill="currentColor" className="text-accent/30" />
                    <rect x="255" y="190" width="50" height="30" rx="2" fill="currentColor" className="text-accent/25" />
                    <rect x="50" y="390" width="300" height="8" rx="2" fill="currentColor" className="text-accent/15" />
                    <rect x="80" y="320" width="12" height="70" fill="currentColor" className="text-accent/15" />
                    <rect x="310" y="310" width="12" height="80" fill="currentColor" className="text-accent/15" />
                    <circle cx="200" cy="110" r="30" fill="currentColor" className="text-accent/10" />
                    <rect x="185" y="110" width="30" height="40" fill="currentColor" className="text-accent/10" />
                    <rect x="150" y="405" width="100" height="6" rx="2" fill="currentColor" className="text-accent/20" />
                  </svg>
                  <div className="relative z-10 text-center p-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-brand-900 font-bold text-2xl mx-auto mb-4 shadow-lg shadow-accent/25">
                      SH
                    </div>
                    <p className="text-white/70 text-sm font-semibold">Shenghan Industrial</p>
                    <p className="text-white/35 text-xs mt-1">Est. 2002 · Linyi, Shandong</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-accent/10 -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl bg-brand-800/5 -z-10" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <StatsCounter />

      <section className="py-14 md:py-28 bg-bg-warm dark:bg-brand-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            label={t("about.journeyLabel")}
            title={t("about.journeyTitle")}
            description={t("about.journeyDesc")}
          />

          <div className="mt-16 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent hidden md:block" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <ScrollReveal key={item.year} delay={i * 0.05}>
                  <div
                    className={`flex flex-col md:flex-row gap-6 md:gap-12 items-start ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div className="inline-block px-4 py-2 rounded-lg bg-accent/10 text-accent-dark dark:text-accent font-bold text-lg">
                        {item.year}
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-brand-800 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-text-secondary dark:text-white/45 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="hidden md:flex w-4 h-4 rounded-full bg-accent shrink-0 mt-3 relative z-10 ring-4 ring-bg-warm dark:ring-brand-900/50" />
                    <div className="flex-1" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-28 bg-white dark:bg-brand-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-xs tracking-[0.25em] uppercase font-semibold text-accent-dark mb-6">
                {t("about.valuesLabel")}
              </h3>
              <div className="space-y-6">
                {values.map((v, i) => (
                  <ScrollReveal key={v.title} delay={i * 0.1}>
                    <div className="flex gap-4 p-5 rounded-xl bg-bg-warm dark:bg-brand-800/40 border border-gray-100 dark:border-white/5 hover:shadow-lg hover:border-accent/20 transition-all duration-300">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <v.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-800 dark:text-white">{v.title}</h4>
                        <p className="text-sm text-text-secondary mt-1">{v.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.25em] uppercase font-semibold text-accent-dark mb-6">
                {t("about.certsLabel")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certifications.map((c, i) => (
                  <ScrollReveal key={c.title} delay={i * 0.1}>
                    <div className="p-6 rounded-xl bg-bg-warm dark:bg-brand-800/40 border border-gray-100 dark:border-white/5 hover:shadow-lg hover:border-accent/20 transition-all duration-300 text-center group">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                        <c.icon className="w-6 h-6 text-accent" />
                      </div>
                      <h4 className="font-semibold text-brand-800 dark:text-white text-sm">
                        {c.title}
                      </h4>
                      <p className="text-xs text-text-muted mt-1">{c.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
