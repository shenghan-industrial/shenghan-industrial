"use client";

import { useT } from "@/lib/LanguageContext";
import { IconGlobe, IconPackage, IconStar, IconUsers } from "@/components/icons";
import siteContent from "@/data/site-content.json";

const icons = [IconGlobe, IconPackage, IconStar, IconUsers];

export function TrustBar() {
  const { locale } = useT();
  const items = siteContent.trustBar.items;

  return (
    <section className="relative bg-[#F5F2EF] dark:bg-[#12100E] border-b border-[#E8E2DC] dark:border-white/5 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8B8A0]/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 md:py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E8E2DC] dark:divide-white/5 gap-y-3 md:gap-y-0">
          {items.map((item, i) => {
            const Icon = icons[i] || IconGlobe;
            const label = locale === "zh" ? (item.labelZh || item.label) : locale === "es" ? (item.labelEs || item.label) : item.label;
            return (
              <div key={i} className="flex items-center justify-center gap-3 px-3 py-2">
                <span className="text-[#B8A080] shrink-0"><Icon /></span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base md:text-lg font-bold text-[#3D3730] dark:text-[#D4C8B8] tabular-nums tracking-tight">{item.value}</span>
                  <span className="text-[11px] md:text-xs text-[#9B8E7E] dark:text-white/30 font-medium">{label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
