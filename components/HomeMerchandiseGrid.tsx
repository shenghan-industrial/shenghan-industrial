"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { categories } from "@/data/categories";
import categoryImages from "@/data/category-images.json";

// 11 家居百货 peer categories (same level as Furniture / Lighting)
const MERCHANDISE_IDS = [
  "daily-care-wash",
  "laundry-cleaning",
  "stationery-supplies",
  "beauty-skincare",
  "fashion-accessories",
  "toys-entertainment",
  "hygiene-products",
  "hardware-supplies",
  "quality-appliances",
  "sports-outdoor",
  "plastic-products",
];

export function HomeMerchandiseGrid() {
  const { locale } = useT();
  const groups = categories.filter((c) => MERCHANDISE_IDS.includes(c.id));

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-[#1A1816]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="mb-8 md:mb-12 text-center">
          <span className="text-xs text-[#B8A080] font-semibold uppercase tracking-[0.15em]">
            30,000+ SKUs
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#3D3730] dark:text-[#D4C8B8] mt-2 tracking-tight">
            {locale === "zh"
              ? "家居百货全品类覆盖"
              : locale === "es"
                ? "Cobertura Total de Artículos del Hogar"
                : "Full Home & General Merchandise Coverage"}
          </h2>
          <p className="text-sm text-[#9B8E7E] dark:text-white/30 mt-2 max-w-2xl mx-auto">
            {locale === "zh"
              ? "从厨房、清洁、收纳到家纺、装饰、宠物用品，一站式满足家庭日用全场景"
              : locale === "es"
                ? "Desde cocina, limpieza y almacenaje hasta textiles, decoración y mascotas, todo en un solo lugar"
                : "From kitchen, cleaning and storage to textiles, décor and pet supplies — all in one place"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {groups.map((group, idx) => {
            const title =
              locale === "zh" ? group.nameZh : locale === "es" ? group.nameEs || group.name : group.name;
            const bgImage = (categoryImages as Record<string, string>)[group.id];

            return (
              <Link
                key={group.id}
                href={`/products?cat=${group.id}`}
                className="group relative flex flex-col justify-end min-h-[220px] rounded-2xl border border-[#E8E2DC] dark:border-white/5 overflow-hidden hover:border-[#B8A080] dark:hover:border-[#B8A080]/50 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Background image */}
                {bgImage && (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={bgImage}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading={idx < 4 ? "eager" : "lazy"}
                    />
                    {/* Strong bottom gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent dark:from-black/90 dark:via-black/60" />
                  </div>
                )}

                {/* Fallback solid background if no image */}
                {!bgImage && (
                  <div className="absolute inset-0 z-0 bg-[#F5F2EF] dark:bg-[#12100E]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent dark:from-black/90 dark:via-black/60" />
                  </div>
                )}

                {/* Hover arrow — top right */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0">
                  <ArrowRight className="w-5 h-5 text-white drop-shadow-md" />
                </div>

                {/* Title at bottom */}
                <div className="relative z-10 p-5 md:p-6">
                  <h3 className="text-base md:text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
                    {title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
