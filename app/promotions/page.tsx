"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { products } from "@/data/products";
import { useT } from "@/lib/LanguageContext";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";

export default function PromotionsPage() {
  const { t, locale } = useT();

  const promoProducts = useMemo(() => products.filter((p) => p.onPromotion), []);

  const daysLeft = useMemo(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return Math.max(1, lastDay.getDate() - now.getDate());
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E]">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-[#3D3730] via-[#4A4238] to-[#5C4A38] pt-20 pb-10 md:pb-14 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")` }} />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t("promotions.backToHome")}
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#C8B8A0]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{t("promotions.title")}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B8A080]/20 text-[#D4C8B8] text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  {locale === "zh" ? `仅剩 ${daysLeft} 天` : locale === "es" ? `Solo ${daysLeft} días` : `${daysLeft} days left`}
                </span>
                <span className="text-white/30 text-xs">{t("promo.subtitle")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-14">
        {promoProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {promoProducts.map((product, i) => (
              <ScrollReveal key={product.id}>
                <div className="relative group">
                  <div className="absolute -top-1.5 -right-1.5 z-10 px-2.5 py-0.5 rounded-full bg-[#B8A080] text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">
                    {t("promotions.limited")}
                  </div>
                  <ProductCard product={product} index={i} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Sparkles className="w-12 h-12 text-[#B8A080]/20 mx-auto mb-4" />
            <p className="text-sm text-[#9B8E7E] dark:text-white/30">{t("promotions.noPromos")}</p>
          </div>
        )}
      </section>
    </main>
  );
}
