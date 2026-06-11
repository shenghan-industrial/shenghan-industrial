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
              {partner && (
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

      {/* Factory info section */}
      {partner && (
        <section id="factory" className="bg-white dark:bg-brand-900 border-t border-gray-100 dark:border-white/5">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-14">
            <h2 className="text-xl md:text-2xl font-bold text-brand-800 dark:text-white text-center mb-2">
              {t("detail.factoryInfo")}
            </h2>
            <p className="text-text-muted dark:text-white/40 text-center text-sm mb-10">
              {t("detail.factoryInfoDesc")}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
              {/* Left: Factory card */}
              <div className="bg-bg-warm dark:bg-brand-800/30 rounded-2xl p-6 border border-gray-100 dark:border-white/5">
                {/* Logo + Name */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
                    {partner.logo ? (
                      <img src={partner.logo} alt={prt?.name || partner?.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Factory className="w-8 h-8 text-accent" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-800 dark:text-white">{prt?.name || partner?.name}</h3>
                    <p className="text-xs text-text-muted dark:text-white/40">{prt?.name || partner?.name}</p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary dark:text-white/60">
                    <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                    {prt?.location || partner?.location}
                  </div>
                  {partner.yearFounded && (
                    <div className="flex items-center gap-2 text-text-secondary dark:text-white/60">
                      <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                      {t("partners.established")} {partner?.yearFounded}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-text-secondary dark:text-white/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                    {partner.certifications.join(" · ")}
                  </div>
                </div>

                {/* Specialties */}
                <div className="mt-5">
                  <h4 className="text-xs font-semibold text-brand-800 dark:text-white/60 uppercase tracking-wider mb-2">
                    {t("partners.specialties")}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {prt?.specialties.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent border border-accent/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Factory video button */}
                {partner.videoUrl && (
                  <button
                    onClick={() => setShowFactoryVideo(true)}
                    className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-brand-900 transition-all text-sm font-medium"
                  >
                    <Play className="w-4 h-4" />
                    {t("partners.watchVideo")}
                  </button>
                )}
              </div>

              {/* Right: Factory description */}
              <div>
                <h3 className="text-lg font-bold text-brand-800 dark:text-white mb-4">
                  {t("partners.aboutFactory")}
                </h3>
                <p className="text-text-secondary dark:text-white/60 leading-relaxed mb-6">
                  {prt?.description || partner?.description}
                </p>

                {/* Certifications badges */}
                <h4 className="text-sm font-semibold text-brand-800 dark:text-white mb-3">
                  {t("partners.certifications")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {partner.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 text-sm font-medium"
                    >
                      <Award className="w-3.5 h-3.5" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Factory video modal */}
      {showFactoryVideo && partner?.videoUrl && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={() => setShowFactoryVideo(false)}>
          <button
            onClick={() => setShowFactoryVideo(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-3xl aspect-video" onClick={(e) => e.stopPropagation()}>
            {partner.videoUrl.includes("youtube.com") ? (
              <iframe src={partner.videoUrl} className="w-full h-full rounded-xl" allow="autoplay; fullscreen" allowFullScreen />
            ) : (
              <video src={partner.videoUrl} className="w-full h-full rounded-xl" controls autoPlay playsInline />
            )}
          </div>
        </div>
      )}

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
