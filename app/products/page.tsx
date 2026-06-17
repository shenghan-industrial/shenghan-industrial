"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ProductCard } from "@/components/ProductCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { Category } from "@/data/categories";
import { useT } from "@/lib/LanguageContext";
import { useCategories } from "@/lib/use-categories";
import { useProducts } from "@/lib/use-products";
import { ChevronDown, Flame, Package } from "lucide-react";

const PRODUCTS_PER_PAGE = 12;

function ProductsContent() {
  const { t, locale } = useT();
  const searchParams = useSearchParams();
  const subFilter = searchParams.get("sub") || "";
  const catFilter = searchParams.get("cat") || "";
  const qFilter = searchParams.get("q") || "";

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const categories = useCategories();
  const { products } = useProducts();

  useEffect(() => {
    if (subFilter && catFilter) {
      const found = categories.find((c) => c.productCategory === catFilter);
      if (found) setActiveCategoryId(found.id);
    }
    if (qFilter) {
      setActiveCategoryId(null);
      setVisibleCount(PRODUCTS_PER_PAGE);
    }
  }, [subFilter, catFilter, qFilter]);

  const catSearchMap = useMemo(() => {
    const map: Record<string, { catZh: string; subZh: string; catEn: string; subEn: string }> = {};
    for (const cat of categories) {
      const items = cat.children || cat.groups?.flatMap((g) => g.children) || [];
      for (const item of items) {
        if (item.productSubCategory) {
          map[item.productSubCategory] = { catZh: cat.nameZh, subZh: item.nameZh, catEn: cat.name, subEn: item.name };
        }
      }
    }
    return map;
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (qFilter) {
      const q = qFilter.toLowerCase();
      filtered = filtered.filter((p) => {
        if (p.name.toLowerCase().includes(q)) return true;
        if (p.subtitle.toLowerCase().includes(q)) return true;
        const m = catSearchMap[p.subCategory || ""];
        if (m) {
          if (m.catZh.includes(qFilter)) return true;
          if (m.subZh.includes(qFilter)) return true;
          if (m.catEn.toLowerCase().includes(q)) return true;
          if (m.subEn.toLowerCase().includes(q)) return true;
        }
        return false;
      });
    }

    if (activeCategoryId) {
      const cat = categories.find((c) => c.id === activeCategoryId);
      if (cat) {
        filtered = filtered.filter((p) => p.category === cat.productCategory);
        if (subFilter && catFilter === cat.productCategory) {
          filtered = filtered.filter((p) => p.subCategory === subFilter);
        }
      }
    }

    return filtered;
  }, [activeCategoryId, subFilter, catFilter, qFilter, catSearchMap]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleSelectCategory = (cat: Category) => {
    if (activeCategoryId === cat.id) {
      setActiveCategoryId(null);
      setVisibleCount(PRODUCTS_PER_PAGE);
    } else {
      setActiveCategoryId(cat.id);
      setVisibleCount(PRODUCTS_PER_PAGE);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E] pt-20">
      {/* Search bar */}
      <section className="bg-white dark:bg-brand-900 border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5">
          <SearchBar />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Left sidebar */}
          <div className="hidden lg:block w-[220px] shrink-0 overflow-visible relative z-20">
            <div className="sticky top-24 overflow-visible">
              <CategorySidebar
                activeCategory={activeCategoryId || undefined}
                onSelectCategory={handleSelectCategory}
              />
            </div>
          </div>

          {/* Right: products grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold text-brand-800 dark:text-white">
                  {qFilter
                    ? (locale === "zh" ? "搜索: " : locale === "es" ? "Buscar: " : "Search: ") + qFilter
                    : activeCategoryId
                      ? (() => {
                          const cat = categories.find((c) => c.id === activeCategoryId);
                          return cat ? (locale === "zh" ? cat.nameZh : locale === "es" ? cat.nameEs || cat.name : cat.name) : "";
                        })()
                      : t("home.allProducts")}
                </h2>
                <span className="text-sm text-text-muted dark:text-white/30">
                  ({filteredProducts.length})
                </span>
              </div>
            </div>

            {/* Mobile category pills */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              {categories.map((cat) => {
                const catName = locale === "zh" ? cat.nameZh : locale === "es" ? cat.nameEs || cat.name : cat.name;
                const isActive = activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat)}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? "bg-accent text-brand-900"
                        : "bg-white dark:bg-brand-800 text-text-secondary dark:text-white/60 border border-gray-100 dark:border-white/5"
                    }`}
                  >
                    {catName}
                  </button>
                );
              })}
            </div>

            {visibleProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {visibleProducts.map((product, i) => (
                    <ScrollReveal key={product.id}>
                      <ProductCard product={product} index={i} />
                    </ScrollReveal>
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-8 text-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setVisibleCount((c) => c + PRODUCTS_PER_PAGE)}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white dark:bg-brand-800 border border-gray-200 dark:border-white/10 text-sm font-medium text-brand-800 dark:text-white hover:border-accent hover:text-accent transition-all shadow-sm"
                    >
                      {t("home.loadMore")}
                      <ChevronDown className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-text-muted dark:text-white/30">
                <Package className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-sm">
                  {t("home.noProductsInCategory")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E]" />}>
      <ProductsContent />
    </Suspense>
  );
}
