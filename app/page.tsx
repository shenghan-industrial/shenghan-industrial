"use client";

import { useMemo, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { categories as staticCategories } from "@/data/categories";
import { useT } from "@/lib/LanguageContext";
import { useCategories } from "@/lib/use-categories";
import { useProducts } from "@/lib/use-products";
import { localizeProduct } from "@/lib/localizeProduct";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewsSection } from "@/components/ReviewsSection";
import { TrustBar } from "@/components/TrustBar";
import { FeatureCards } from "@/components/FeatureCards";
import siteContent from "@/data/site-content.json";

const rankColors = [
  "bg-[#F5A623] text-white",
  "bg-[#9B9B9B] text-white",
  "bg-[#D2691E] text-white",
];

// Group best sellers by subcategory
function getBestSellerGroups(products: import("@/data/products").Product[], categories: typeof staticCategories) {
  const bests = products.filter((p) => p.monthlyBest);
  const map: Record<string, { subKey: string; subNameZh: string; subName: string; subNameEs?: string; catNameZh: string; catName: string; catNameEs?: string; productCategory: string; productSubCategory: string; items: typeof bests }> = {};

  for (const p of bests) {
    const key = p.subCategory || p.category;
    if (!map[key]) {
      let subNameZh = key, subName = key, subNameEs: string | undefined, catNameZh = "", catName = "", catNameEs: string | undefined;
      for (const cat of categories) {
        const items = cat.children || cat.groups?.flatMap((g) => g.children) || [];
        const found = items.find((s) => s.productSubCategory === key);
        if (found) {
          subNameZh = found.nameZh;
          subName = found.name;
          subNameEs = (found as { nameEs?: string }).nameEs;
          catNameZh = cat.nameZh;
          catName = cat.name;
          catNameEs = (cat as { nameEs?: string }).nameEs;
          break;
        }
      }
      map[key] = { subKey: key, subNameZh, subName, subNameEs, catNameZh, catName, catNameEs, productCategory: p.category, productSubCategory: key, items: [] };
    }
    map[key].items.push(p);
  }

  return Object.values(map).filter((g) => g.items.length > 0);
}

function HomeContent() {
  const { t, locale } = useT();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const categories = useCategories();
  const { products } = useProducts();

  const bestGroups = useMemo(() => getBestSellerGroups(products, categories), [products, categories]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardW = 320 + 1; // card width + divider
    scrollRef.current.scrollBy({ left: dir === "left" ? -cardW * 3 : cardW * 3, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setAtStart(scrollLeft < 5);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
  };

  return (
    <main className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E]">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Trust Bar — immediately after Hero */}
      <TrustBar />

      {/* 3. Best Sellers — products first (conversion priority) */}
      <section className="py-8 md:py-20 bg-white dark:bg-[#1A1816]">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="mb-9">
            <span className="text-xs text-[#B8A080] font-semibold uppercase tracking-[0.15em]">
              {locale === "zh" ? siteContent.bestsellers.topPicksLabelZh : locale === "es" ? siteContent.bestsellers.topPicksLabelEs : siteContent.bestsellers.topPicksLabel}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3D3730] dark:text-[#D4C8B8] mt-1.5 tracking-tight">
              {locale === "zh" ? siteContent.bestsellers.titleZh : locale === "es" ? siteContent.bestsellers.titleEs : siteContent.bestsellers.title}
            </h2>
            <p className="text-sm text-[#9B8E7E] dark:text-white/30 mt-1.5">
              {locale === "zh" ? siteContent.bestsellers.subtitleZh : locale === "es" ? siteContent.bestsellers.subtitleEs : siteContent.bestsellers.subtitle}
            </p>
          </div>

          {/* Scroll container with arrows */}
          <div className="relative group">
            {/* Left arrow */}
            {!atStart && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Right arrow */}
            {!atEnd && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Scrollable card row */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {bestGroups.map((group, idx) => {
                const top3 = group.items.slice(0, 3);
                const displayName = locale === "zh" ? group.subNameZh : locale === "es" ? (group.subNameEs || group.subName) : group.subName;

                return (
                  <Link
                    key={group.subKey}
                    href={`/rankings/${group.productCategory}/${group.productSubCategory}`}
                    className="group/card shrink-0 w-[300px] flex flex-col border-r border-[#E8E2DC] last:border-r-0"
                  >
                    {/* Header */}
                    <div className="bg-[#4A4238] px-5 py-4 flex items-center justify-between">
                      <div>
                        <span className="text-white/80 text-[11px] tracking-wide">
                          {t("home.hotRanking")}
                        </span>
                        <h3 className="text-white text-lg font-bold mt-0.5">
                          {displayName}
                        </h3>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/70 group-hover/card:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Product rows */}
                    <div className="flex-1 bg-white dark:bg-[#1A1816]">
                      {top3.map((product, i) => (
                        <div
                          key={product.id}
                          className={`flex items-center gap-3 px-4 py-3 ${
                            i < 2 ? "border-b border-[#F0EBE6] dark:border-white/5" : ""
                          }`}
                        >
                          {/* Rank badge — positioned on top-left of thumbnail */}
                          <div className="relative shrink-0">
                            <div className="w-[60px] h-[60px] bg-gray-50 dark:bg-brand-800 flex items-center justify-center overflow-hidden">
                              <img
                                src={product.image}
                                alt={localizeProduct(product, locale).name}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                            <div
                              className={`absolute -top-1.5 -left-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold ${rankColors[i]}`}
                            >
                              {i + 1}
                            </div>
                          </div>

                          {/* Product name — 2 lines */}
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium text-[#1a1a1a] dark:text-white leading-tight line-clamp-1">
                              {localizeProduct(product, locale).name}
                            </p>
                            <p className="text-[11px] text-[#999] dark:text-white/30 leading-tight mt-0.5 line-clamp-1">
                              {localizeProduct(product, locale).subtitle}
                            </p>
                          </div>

                          {/* Sales count — right aligned */}
                          <div className="shrink-0 text-right">
                            {product.weeklySales && (
                              <span className="text-[13px] font-semibold text-[#333] dark:text-white/70 tabular-nums">
                                {product.weeklySales.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Cards */}
      <section className="pt-8 md:pt-16 pb-2 md:pb-4">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <FeatureCards />
        </div>
      </section>

      {/* 5. Customer Reviews */}
      <ReviewsSection />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#1A1816]" />}>
      <HomeContent />
    </Suspense>
  );
}
