"use client";

import Link from "next/link";
import { useT } from "@/lib/LanguageContext";
import { IconLayers, IconBox, IconFlame, IconArrowRight } from "@/components/icons";
import siteContent from "@/data/site-content.json";

const icons = [IconLayers, IconBox, IconFlame];
const gradients = [
  "linear-gradient(160deg, #5C5348 0%, #4A4238 35%, #3B3530 100%)",
  "linear-gradient(160deg, #6B6156 0%, #5C5348 35%, #4A4238 100%)",
  "linear-gradient(160deg, #787066 0%, #6B6156 35%, #5C5348 100%)",
];
const lights = ["rgba(210,190,160,0.08)", "rgba(210,190,160,0.06)", "rgba(210,190,160,0.06)"];

export function FeatureCards() {
  const { locale } = useT();
  const fc = siteContent.featureCards;
  const sectionTitle = locale === "zh" ? fc.sectionTitleZh : locale === "es" ? fc.sectionTitleEs : fc.sectionTitle;

  return (
    <div>
      {sectionTitle && (
        <div className="mb-9 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3D3730] dark:text-[#D4C8B8] tracking-tight">
            {sectionTitle}
          </h2>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {fc.cards.map((card, i) => {
          const Icon = icons[i] || IconLayers;
          const title = locale === "zh" ? card.titleZh : locale === "es" ? card.titleEs : card.title;
          const desc = locale === "zh" ? card.descZh : locale === "es" ? card.descEs : card.desc;
          const linkText = locale === "zh" ? card.linkTextZh : locale === "es" ? card.linkTextEs : card.linkText;

          return (
            <Link
              key={i}
              href={card.href}
              className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 min-h-[220px] md:min-h-[280px]"
              style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03)" }}
            >
              <div className="absolute inset-0" style={{ background: gradients[i] }} />
              <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")` }} />
              <div className="absolute top-0 left-0 w-1/2 h-1/2 opacity-25" style={{ background: `radial-gradient(ellipse at top left, ${lights[i]} 0%, transparent 70%)` }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)" }} />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5 md:px-8 py-8 md:py-12">
                <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)" }}>
                  <Icon size={26} />
                </div>
                <h3 className="text-white font-bold mb-2.5 tracking-tight" style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.45rem)", lineHeight: 1.2 }}>
                  {title}
                </h3>
                <p className="mb-8 max-w-[200px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.78rem, 1vw, 0.85rem)" }}>
                  {desc}
                </p>
                <span className="inline-flex items-center gap-1.5 font-medium transition-all duration-300 group-hover:gap-2" style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
                  {linkText}
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5"><IconArrowRight /></span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
