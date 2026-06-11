"use client";

export const runtime = "edge";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingCart,
  Check,
  ArrowLeft,
  MapPin,
  Calendar,
  Award,
  Factory,
  Play,
  X,
  ShieldCheck,
} from "lucide-react";
import { products } from "@/data/products";
import { getPartnerById } from "@/data/partners";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useT } from "@/lib/LanguageContext";
import { localizeProduct, localizePartner } from "@/lib/localizeProduct";
import { useInquiryCart } from "@/lib/InquiryContext";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, locale } = useT();
  const { addItem } = useInquiryCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showFactoryVideo, setShowFactoryVideo] = useState(false);

  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const localized = localizeProduct(product, locale);
  const partner = product.partnerId ? getPartnerById(product.partnerId) : null;
  const prt = partner ? localizePartner(partner, locale) : null;
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#F5F2EF] dark:bg-brand-900">
      {/* Breadcrumb bar */}
      <div className="bg-white dark:bg-brand-900 border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm text-text-muted dark:text-white/40 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("detail.backToProducts")}
          </Link>
        </div>
      </div>

      {/* Product hero: image + buy box */}
      <section className="bg-white dark:bg-brand-900">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F0EBE6] dark:bg-brand-800 border border-gray-100 dark:border-white/5"
            >
              <img
                src={product.image}
                alt={localized.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-md text-xs font-bold bg-accent text-white shadow-lg">
                  {localized.badge}
                </span>
              )}
            </motion.div>

            {/* Right: Buy box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:sticky lg:top-24 self-start"
            >
              {/* Category tag */}
              <span className="inline-block px-2.5 py-1 text-xs font-medium bg-accent/10 text-accent rounded">
                {localized.subtitle.split(" — ")[0]}
              </span>

              <h1 className="text-xl md:text-2xl font-bold text-brand-800 dark:text-white mt-3 leading-snug">
                {localized.name}
              </h1>

              {/* Manufacturer badge */}
              {false && (
                <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-sm w-fit">
                  <Factory className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    {prt?.name || partner?.name}
                  </span>
                  <span className="text-blue-400 dark:text-blue-500">|</span>
                  <span className="flex items-center gap-1 text-blue-500 dark:text-blue-400 text-xs">
                    <MapPin className="w-3 h-3" />
                    {prt?.location || partner?.location}
                  </span>
                </div>
              )}

              {/* Price/inquiry hint */}
              <div className="mt-5 p-4 rounded-lg bg-accent/5 border border-accent/10">
                <p className="text-sm text-text-secondary dark:text-white/60">
                  <span className="text-accent font-semibold">{t("detail.inquiryNote")}</span>
                  {" "}{t("detail.inquiryDesc")}
                </p>
              </div>

              {/* Quantity + Add to cart */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-sm text-text-muted dark:text-white/40">{t("cart.quantity")}</span>
                <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-gray-50 dark:hover:bg-brand-800 transition-colors rounded-l-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center text-sm font-semibold bg-transparent border-x border-gray-200 dark:border-white/10 py-2.5 outline-none text-brand-800 dark:text-white"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-gray-50 dark:hover:bg-brand-800 transition-colors rounded-r-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-accent text-brand-900 hover:bg-accent-light shadow-lg shadow-accent/20"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      {t("detail.added")}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      {t("detail.addToCart")}
                    </>
                  )}
                </button>

                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-accent text-accent font-semibold text-sm hover:bg-accent hover:text-brand-900 transition-all"
                >
                  {t("detail.inquireNow")}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product details */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Description + Features */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-brand-800/30 rounded-xl p-6 md:p-8 border border-gray-100 dark:border-white/5">
              <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-4">
                {t("detail.productDesc")}
              </h2>
              <p className="text-text-secondary dark:text-white/60 leading-relaxed">
                {localized.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-brand-800/30 rounded-xl p-6 md:p-8 border border-gray-100 dark:border-white/5">
              <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-4">
                {t("modal.features")}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {localized.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-text-secondary dark:text-white/60">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Full specs table */}
            <div className="bg-white dark:bg-brand-800/30 rounded-xl p-6 md:p-8 border border-gray-100 dark:border-white/5">
              <h2 className="text-lg font-bold text-brand-800 dark:text-white mb-4">
                {t("modal.specs")}
              </h2>
              <div className="overflow-hidden rounded-lg border border-gray-100 dark:border-white/5">
                <table className="w-full text-sm">
                  <tbody>
                    {localized.specs.map((spec, i) => (
                      <tr
                        key={spec.label}
                        className={i % 2 === 0 ? "bg-[#fafafa] dark:bg-brand-800/20" : "bg-white dark:bg-brand-800/10"}
                      >
                        <td className="px-4 py-3 text-text-muted dark:text-white/40 w-1/3">{spec.label}</td>
                        <td className="px-4 py-3 font-medium text-brand-800 dark:text-white">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right sidebar: Quick specs */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-brand-800/30 rounded-xl p-5 border border-gray-100 dark:border-white/5 sticky top-24">
              <h3 className="text-sm font-semibold text-brand-800 dark:text-white mb-3">
                {t("detail.keySpecs")}
              </h3>
              <div className="space-y-2.5">
                {localized.specs.slice(0, 6).map((spec) => (
                  <div key={spec.label} className="flex justify-between text-xs">
                    <span className="text-text-muted dark:text-white/40">{spec.label}</span>
                    <span className="font-medium text-brand-800 dark:text-white text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Factory info — all products are Shenghan own production */}
      <section className="bg-white dark:bg-brand-900 border-t border-gray-100 dark:border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-sm text-text-muted dark:text-white/40">
            {locale === "zh" ? "所有产品均来自盛瀚自有生产体系，严格品控，工厂直供。" : locale === "es" ? "Todos los productos provienen del sistema de producción propio de Shenghan, con estricto control de calidad." : "All products are manufactured in Shenghan's own production facilities with strict quality control and factory-direct supply."}
          </p>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="py-14 bg-[#F5F2EF] dark:bg-brand-900/80">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <SectionHeading
              label={t("detail.relatedLabel")}
              title={t("detail.relatedTitle")}
            />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ScrollReveal key={p.id}>
                  <ProductCard product={p} index={i} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
