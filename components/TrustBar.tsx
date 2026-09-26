"use client";

import { Package, Store, Globe, Clock } from "lucide-react";
import { useT } from "@/lib/LanguageContext";

const trustItems = [
  {
    key: "skus",
    value: "30,000+",
    labelEn: "Home Goods SKUs",
    labelZh: "家居百货单品",
    labelEs: "Artículos del Hogar",
    icon: Package,
  },
  {
    key: "showroom",
    value: "8,000 m²",
    labelEn: "Wholesale Showroom",
    labelZh: "批发展厅",
    labelEs: "Showroom Mayorista",
    icon: Store,
  },
  {
    key: "countries",
    value: "30+",
    labelEn: "Export Markets",
    labelZh: "出口市场",
    labelEs: "Mercados",
    icon: Globe,
  },
  {
    key: "response",
    value: "< 24h",
    labelEn: "Quote Response",
    labelZh: "报价响应",
    labelEs: "Respuesta <24h",
    icon: Clock,
  },
];

export function TrustBar() {
  const { locale } = useT();

  return (
    <section className="bg-white dark:bg-[#1A1816] border-b border-[#E8E2DC] dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E8E2DC] dark:divide-white/5">
          {trustItems.map((item) => {
            const Icon = item.icon;
            const label =
              locale === "zh" ? item.labelZh : locale === "es" ? item.labelEs : item.labelEn;
            return (
              <div
                key={item.key}
                className="flex items-center justify-center gap-3 px-4 py-4 md:py-5"
              >
                <span className="text-[#B8A080] shrink-0">
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base md:text-lg font-bold text-[#3D3730] dark:text-[#D4C8B8] tabular-nums">
                    {item.value}
                  </span>
                  <span className="text-[11px] md:text-xs text-[#9B8E7E] dark:text-white/30 font-medium">
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
