"use client";
import { useT } from "@/lib/LanguageContext";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { SectionHeading } from "@/components/SectionHeading";
import { products, productCategories, type Product } from "@/data/products";
import { Package } from "lucide-react";

export default function ProductsPage() {
  const { t } = useT();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("All Products");

  const filtered =
    activeCategory === "All Products"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <section className="pt-24 md:pt-32 pb-16 md:pb-20 bg-gradient-to-br from-brand-800 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.1),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            label={t("products.label")}
            title={t("products.catalog")}
            description="Browse our complete range of building sealants and structural adhesives to find the right solution for your project."
            light
          />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {productCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 md:px-5 py-3 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 min-h-[44px] flex items-center ${
                  activeCategory === cat
                    ? "bg-brand-800 text-white shadow-lg shadow-brand-800/10"
                    : "bg-white text-text-secondary border border-gray-200 hover:border-brand-800/20 hover:text-brand-800 active:scale-95"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory}
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
              <p className="text-text-muted">No products in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
