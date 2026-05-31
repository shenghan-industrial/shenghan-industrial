"use client";
import { useT } from "@/lib/LanguageContext";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { SectionHeading } from "@/components/SectionHeading";
import { products, productCategories, subCategoryMap, type Product } from "@/data/products";
import { Package } from "lucide-react";

export default function ProductsPage() {
  const { t } = useT();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const CATEGORY_ALL = t("products.all");

  const categoryLabelMap: Record<string, string> = useMemo(() => ({
    "Furniture": t("products.category.furniture"),
    "Building Materials": t("products.category.buildingMaterials"),
    "Hardware": t("products.category.hardware"),
    "Appliances": t("products.category.appliances"),
    "Lighting": t("products.category.lighting"),
    "Others": t("products.category.others"),
    // Sub-categories
    "Sofas": t("products.subCategory.sofas"),
    "Beds": t("products.subCategory.beds"),
    "Cabinets": t("products.subCategory.cabinets"),
    "Adhesives": t("products.subCategory.adhesives"),
    "Panels": t("products.subCategory.panels"),
    "Fasteners": t("products.subCategory.fasteners"),
    "Door & Window": t("products.subCategory.doorWindow"),
    "Bathroom": t("products.subCategory.bathroom"),
    "Fans": t("products.subCategory.fans"),
    "Heaters": t("products.subCategory.heaters"),
    "Kitchen": t("products.subCategory.kitchen"),
    "Desk Lamps": t("products.subCategory.deskLamps"),
    "Pendant Lights": t("products.subCategory.pendantLights"),
    "Floor Lamps": t("products.subCategory.floorLamps"),
  }), [t]);

  const [activeCategory, setActiveCategory] = useState(CATEGORY_ALL);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);

  const mainCategories = useMemo(
    () => productCategories.filter((c) => c !== "All Products"),
    []
  );

  const currentSubs = activeCategory !== CATEGORY_ALL ? subCategoryMap[activeCategory] : undefined;
  const hasSubCategories = !!currentSubs && currentSubs.length > 0;

  const filtered = useMemo(() => {
    if (activeCategory === CATEGORY_ALL) return products;
    if (hasSubCategories && activeSubCategory) {
      return products.filter((p) => p.subCategory === activeSubCategory);
    }
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, activeSubCategory, CATEGORY_ALL, hasSubCategories]);

  const handleMainCategory = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubCategory(null);
  };

  return (
    <>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      <section className="pt-24 md:pt-32 pb-16 md:pb-20 bg-gradient-to-br from-brand-800 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.1),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            label={t("products.label")}
            title={t("products.catalog")}
            description={t("products.catalogDesc")}
            light
          />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Main categories */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
            <button
              onClick={() => { setActiveCategory(CATEGORY_ALL); setActiveSubCategory(null); }}
              className={`px-4 md:px-5 py-3 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 min-h-[44px] flex items-center ${
                activeCategory === CATEGORY_ALL
                  ? "bg-brand-800 text-white shadow-lg shadow-brand-800/10"
                  : "bg-white text-text-secondary border border-gray-200 hover:border-brand-800/20 hover:text-brand-800"
              }`}
            >
              {CATEGORY_ALL}
            </button>
            {mainCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleMainCategory(cat)}
                className={`px-4 md:px-5 py-3 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 min-h-[44px] flex items-center ${
                  activeCategory === cat
                    ? "bg-brand-800 text-white shadow-lg shadow-brand-800/10"
                    : "bg-white text-text-secondary border border-gray-200 hover:border-brand-800/20 hover:text-brand-800"
                }`}
              >
                {categoryLabelMap[cat] || cat}
              </button>
            ))}
          </div>

          {/* Sub-categories — shown when active category has sub-categories */}
          <div
            className={`flex flex-wrap items-center justify-center gap-2 mb-9 overflow-hidden transition-all duration-300 ${
              hasSubCategories ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex items-center gap-2 py-1 px-3 rounded-full bg-bg-warm dark:bg-brand-800/50">
              <span className="text-xs text-text-muted dark:text-white/40 mr-1">▸</span>
              {(currentSubs || []).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubCategory(activeSubCategory === sub ? null : sub)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    activeSubCategory === sub
                      ? "bg-accent text-brand-900 shadow-sm"
                      : "bg-white dark:bg-brand-800 text-text-secondary dark:text-white/60 hover:text-brand-800 dark:hover:text-white"
                  }`}
                >
                  {categoryLabelMap[sub] || sub}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + (activeSubCategory || "")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setSelectedProduct}
                  index={i}
                />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">{t("products.noProducts")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
