"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flame, Heart, TrendingUp, Crown } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { useProducts } from "@/lib/use-products";
import { localizeProduct } from "@/lib/localizeProduct";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useCategories } from "@/lib/use-categories";

const categoryColors: Record<string, { banner: string; light: string; text: string; tag: string }> = {
  Furniture: { banner: "from-[#4A4238] via-[#5C554D] to-[#3D3730]", light: "bg-stone-50 dark:bg-stone-950/20", text: "text-stone-700 dark:text-stone-300", tag: "bg-[#5C554D]" },
  "Building Materials": { banner: "from-[#4A4238] via-[#5C554D] to-[#3D3730]", light: "bg-stone-50 dark:bg-stone-950/20", text: "text-stone-700 dark:text-stone-300", tag: "bg-[#5C554D]" },
  Hardware: { banner: "from-[#4A4238] via-[#5C554D] to-[#3D3730]", light: "bg-stone-50 dark:bg-stone-950/20", text: "text-stone-700 dark:text-stone-300", tag: "bg-[#5C554D]" },
  Lighting: { banner: "from-[#4A4238] via-[#5C554D] to-[#3D3730]", light: "bg-stone-50 dark:bg-stone-950/20", text: "text-stone-700 dark:text-stone-300", tag: "bg-[#5C554D]" },
  Appliances: { banner: "from-[#4A4238] via-[#5C554D] to-[#3D3730]", light: "bg-stone-50 dark:bg-stone-950/20", text: "text-stone-700 dark:text-stone-300", tag: "bg-[#5C554D]" },
  Others: { banner: "from-[#4A4238] via-[#5C554D] to-[#3D3730]", light: "bg-stone-50 dark:bg-stone-950/20", text: "text-stone-700 dark:text-stone-300", tag: "bg-[#5C554D]" },
};

const defaultColor = { banner: "from-[#4A4238] to-[#3D3730]", light: "bg-stone-50", text: "text-stone-700", tag: "bg-[#5C554D]" };

function getAllSubCategories(categories: ReturnType<typeof useCategories>) {
  const result: { productCategory: string; productSubCategory: string; nameZh: string; name: string }[] = [];
  for (const cat of categories) {
    const items = cat.children || cat.groups?.flatMap((g) => g.children) || [];
    for (const item of items) {
      if (item.productSubCategory) {
        result.push({ productCategory: cat.productCategory, productSubCategory: item.productSubCategory, nameZh: item.nameZh, name: item.name });
      }
    }
  }
  return result;
}

export default function RankingsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = use(params);
  const { t, locale } = useT();
  const router = useRouter();
  const categories = useCategories();
  const { products } = useProducts();

  const currentCat = slug?.[0] || "";
  const currentSub = slug?.[1] || "";
  const [activeTab, setActiveTab] = useState<"hot" | "wish">("hot");

  const allSubs = useMemo(() => getAllSubCategories(categories), [categories]);

  const currentSubInfo = allSubs.find(
    (s) => s.productCategory === currentCat && s.productSubCategory === currentSub
  );

  // Products for this subcategory, sorted by weeklySales desc
  const categoryProducts = useMemo(
    () =>
      products
        .filter((p) => p.category === currentCat && p.subCategory === currentSub)
        .sort((a, b) => (b.weeklySales || 0) - (a.weeklySales || 0)),
    [currentCat, currentSub]
  );

  // All subcategories under the current parent category for filter tags
  const siblingSubs = useMemo(
    () => allSubs.filter((s) => s.productCategory === currentCat),
    [currentCat, allSubs]
  );

  const colors = categoryColors[currentCat] || defaultColor;

  // Get parent category name
  const cat = categories.find((c) => c.productCategory === currentCat);
  const catName = locale === "zh" ? cat?.nameZh : locale === "es" ? cat?.nameEs || cat?.name : cat?.name;

  return (
    <main className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E]">
      {/* Top banner — geometric colored background */}
      <section className={`relative bg-gradient-to-br ${colors.banner} pt-[56px] pb-10 md:pb-14 overflow-hidden`}>
        {/* Geometric shapes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-12 w-32 h-32 bg-white rounded-3xl rotate-12" />
          <div className="absolute top-20 right-1/3 w-20 h-20 bg-white rounded-2xl -rotate-6" />
          <div className="absolute bottom-2 left-8 w-24 h-24 bg-white rounded-full" />
          <div className="absolute bottom-6 right-1/4 w-16 h-16 bg-white/50 rounded-2xl rotate-45" />
          <div className="absolute top-8 left-1/3 w-12 h-12 bg-white/40 rounded-xl -rotate-12" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("rankings.backToHome")}
          </Link>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              {locale === "zh" ? (currentSubInfo?.nameZh || currentSub) : locale === "es" ? ((currentSubInfo as any)?.nameEs || currentSubInfo?.name || currentSub) : (currentSubInfo?.name || currentSub)}
              <span className="text-white/80">{locale === "zh" ? "榜" : locale === "es" ? " Top" : " Top"}</span>
            </h1>
            <p className="text-white/50 text-sm mt-3">
              {t("home.rankedBy7Days")}
            </p>
          </div>
        </div>
      </section>

      {/* Subcategory filter tags */}
      <section className="bg-white dark:bg-brand-900 border-b border-gray-100 dark:border-white/5 sticky top-[56px] z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {/* "总榜" tag — all under this category */}
          <Link
            href={`/rankings/${currentCat}/${currentSub}`}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              true // Always show current as selected, but 总榜 could be different
                ? `text-white shadow-sm ${colors.tag}`
                : "text-text-secondary dark:text-white/50 border border-gray-200 dark:border-white/10 hover:border-accent/30"
            }`}
          >
            {currentSubInfo ? (locale === "zh" ? currentSubInfo.nameZh : locale === "es" ? ((currentSubInfo as any)?.nameEs || currentSubInfo.name) : currentSubInfo.name) : currentSub}
          </Link>

          {siblingSubs
            .filter((s) => s.productSubCategory !== currentSub)
            .map((sub) => (
              <Link
                key={sub.productSubCategory}
                href={`/rankings/${sub.productCategory}/${sub.productSubCategory}`}
                className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium text-text-secondary dark:text-white/50 border border-gray-200 dark:border-white/10 hover:border-accent/30 transition-all"
              >
                {locale === "zh" ? sub.nameZh : locale === "es" ? ((sub as any)?.nameEs || sub.name) : sub.name}
              </Link>
            ))}
        </div>
      </section>

      {/* Toggle: 热销榜 / 心宜榜 */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-brand-800 rounded-full p-1">
            <button
              onClick={() => setActiveTab("hot")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === "hot"
                  ? "bg-white dark:bg-brand-700 text-brand-800 dark:text-white shadow-sm"
                  : "text-text-muted dark:text-white/40 hover:text-brand-800 dark:hover:text-white"
              }`}
            >
              <Flame className="w-4 h-4" />
              {t("rankings.hotSales")}
            </button>
            <button
              onClick={() => setActiveTab("wish")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === "wish"
                  ? "bg-white dark:bg-brand-700 text-brand-800 dark:text-white shadow-sm"
                  : "text-text-muted dark:text-white/40 hover:text-brand-800 dark:hover:text-white"
              }`}
            >
              <Heart className="w-4 h-4" />
              {t("rankings.wishlist")}
            </button>
          </div>

          <span className="text-xs text-text-muted dark:text-white/30">
            {categoryProducts.length} {t("home.items")}
          </span>
        </div>

        {/* Product grid — 2 cols mobile, 3 cols desktop */}
        {activeTab === "hot" ? (
          categoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categoryProducts.map((product, i) => (
                <ScrollReveal key={product.id}>
                  <Link
                    href={`/products/${product.id}`}
                    className={`group block bg-white dark:bg-brand-900 rounded-2xl border border-gray-100 dark:border-white/10 hover:shadow-xl hover:border-accent/20 transition-all duration-300 overflow-hidden ${
                      i === 0 ? "lg:col-span-2 lg:row-span-1" : ""
                    }`}
                  >
                    <div className={`flex ${i === 0 ? "lg:flex-row" : "flex-col"}`}>
                      {/* Image */}
                      <div className={`relative bg-gray-100 dark:bg-brand-800 overflow-hidden ${
                        i === 0 ? "lg:w-1/2 aspect-square lg:aspect-auto" : "aspect-square"
                      }`}>
                        <img
                          src={product.image}
                          alt={localizeProduct(product, locale).name}
                          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Rank badge for #1 */}
                        {i === 0 && (
                          <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-yellow-400 text-yellow-900 flex items-center justify-center text-lg font-bold shadow-lg">
                            1
                          </div>
                        )}
                        {/* Promo tag */}
                        {product.promoTag && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                            {product.promoTag}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className={`p-4 md:p-5 flex flex-col justify-between ${i === 0 ? "lg:w-1/2" : ""}`}>
                        <div>
                          <h3 className={`font-semibold text-brand-800 dark:text-white group-hover:text-accent transition-colors ${
                            i === 0 ? "text-base md:text-lg" : "text-sm md:text-base"
                          } line-clamp-2`}>
                            {localizeProduct(product, locale).name}
                          </h3>
                          <p className="text-xs md:text-sm text-text-muted dark:text-white/40 mt-1 line-clamp-1">
                            {localizeProduct(product, locale).subtitle}
                          </p>
                        </div>

                        <div className="mt-3 flex items-end justify-between">
                          <div>
                            {product.weeklySales && (
                              <p className="text-[10px] md:text-xs text-text-muted dark:text-white/30 mt-0.5">
                                {t("weeklySold")}
                                <span className="font-medium text-text-secondary dark:text-white/50">
                                  {product.weeklySales.toLocaleString()}
                                </span>
                                {t("weeklySoldSuffix")}
                              </p>
                            )}
                          </div>
                          {/* Rank badge for #2, #3 */}
                          {i > 0 && i < 3 && (
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                              i === 1 ? "bg-gray-300 text-gray-700" : "bg-orange-700 text-orange-100"
                            }`}>
                              {i + 1}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-text-muted dark:text-white/30">
              <p className="text-sm">{t("home.noProducts")}</p>
            </div>
          )
        ) : (
          <div className="text-center py-20 text-text-muted dark:text-white/30">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-sm">
              {t("rankings.wishlistSoon")}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
