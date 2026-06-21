"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useProducts } from "@/lib/use-products";
import { useT } from "@/lib/LanguageContext";
import { ArrowLeft, Zap } from "lucide-react";

export default function FlashDealsPage() {
  const { t } = useT();

  const { products } = useProducts();
  const flashProducts = products.filter((p) => p.onPromotion);

  return (
    <main className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E]">
      {/* Banner */}
      <section className="relative bg-gradient-to-br from-[#4A4238] via-[#5C554D] to-[#3D3730] pt-[56px] pb-10 md:pb-14 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-6 right-16 w-36 h-36 bg-white rounded-3xl rotate-12" />
          <div className="absolute top-24 right-1/3 w-24 h-24 bg-white rounded-2xl -rotate-6" />
          <div className="absolute bottom-3 left-10 w-28 h-28 bg-white rounded-full" />
          <div className="absolute top-10 left-1/4 w-14 h-14 bg-white/50 rounded-xl -rotate-12" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t("common.backToHome")}
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Zap className="w-7 h-7 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {t("flashDeals.title")}
              </h1>
              <p className="text-white/50 text-sm mt-1">
                {t("flashDeals.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
        {flashProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {flashProducts.map((product, i) => (
              <ScrollReveal key={product.id}>
                <div className="relative">
                  <div className="absolute -top-1 -right-1 z-10 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase shadow-lg">
                    {t("flashDeals.tag")}
                  </div>
                  <ProductCard product={product} index={i} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-muted dark:text-white/30">
            <Zap className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-sm">
              {t("flashDeals.emptyState")}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
