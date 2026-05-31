"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { StatsCounter } from "@/components/StatsCounter";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { VideoSection } from "@/components/VideoSection";
import { ImageTextSection } from "@/components/ImageTextSection";
import { GallerySection } from "@/components/GallerySection";
import { ContactForm } from "@/components/ContactForm";
import { products, type Product } from "@/data/products";
import { galleryImages, galleryCategories } from "@/data/gallery-images";
import { useT } from "@/lib/LanguageContext";
import { siteConfig } from "@/data/site-config";
import { Play, Factory, ShieldCheck, Award, ChevronLeft, ChevronRight } from "lucide-react";

const partners = [
  "China State Construction",
  "China Railway Construction",
  "Vanke Real Estate",
  "Country Garden",
  "Poly Developments",
  "China Resources Land",
  "Greenland Group",
  "CSCEC Group",
];

export default function HomePage() {
  const { t } = useT();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [partnerStart, setPartnerStart] = useState(0);

  const prevPartner = () =>
    setPartnerStart((s) => (s - 1 < 0 ? partners.length - 4 : s - 1));
  const nextPartner = () =>
    setPartnerStart((s) => (s + 1 > partners.length - 4 ? 0 : s + 1));

  return (
    <>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* ===== 1. HERO CAROUSEL ===== */}
      <HeroSection />

      {/* ===== 2. MEDIA STRIP (matching template banner-w3l-media-sec) ===== */}
      <section className="relative -mt-2 py-12 md:py-16 bg-white dark:bg-brand-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <ScrollReveal>
              <h3 className="text-2xl md:text-3xl font-bold text-brand-800 dark:text-white leading-tight">
                {t("media.slogan")}
              </h3>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-text-secondary dark:text-white/50 leading-relaxed">
                {t("media.desc")}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="flex justify-center">
                <a
                  href="#factory-video"
                  className="group flex items-center gap-3 px-6 py-3 rounded-full bg-accent text-brand-900 font-semibold hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
                >
                  <span className="w-10 h-10 rounded-full bg-brand-900/10 flex items-center justify-center">
                    <Play className="w-5 h-5 ml-0.5" />
                  </span>
                  {t("media.watch")}
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== 3. PRODUCT SHOWCASE (matching template w3l-3-grids) ===== */}
      <section id="products" className="py-20 md:py-28 bg-bg-warm dark:bg-brand-900/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            label={t("products.label")}
            title={t("products.title")}
            description={t("products.desc")}
          />
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. VIDEO SECTION (matching template w3l-index5) ===== */}
      <div id="factory-video">
        <VideoSection imageSrc="/images/factory-bg.svg" />
      </div>

      {/* ===== 5. IMAGE+TEXT: Factory Introduction (matching template w3l-passion-mid-sec) ===== */}
      <ImageTextSection
        imageSrc="/images/factory/factory-line.svg"
        imageAlt="Production line"
        imageSide="left"
        label={t("factory.label")}
        title={t("factory.title")}
        description={t("factory.desc")}
        features={[
          t("factory.features.0"),
          t("factory.features.1"),
          t("factory.features.2"),
          t("factory.features.3"),
        ]}
        badge={{ text: t("factory.badge"), Icon: Award }}
        className="bg-white dark:bg-brand-900"
      />

      {/* ===== 6. GALLERY SECTION (matching template w3l-gallery) ===== */}
      <GallerySection images={galleryImages} categories={galleryCategories} />

      {/* ===== 7. STATS COUNTER (matching template w3l-midslider stats) ===== */}
      <StatsCounter />

      {/* ===== 8. IMAGE+TEXT: Quality Control (matching template alternating pattern) ===== */}
      <ImageTextSection
        imageSrc="/images/quality/testing-rig.svg"
        imageAlt="Quality testing"
        imageSide="right"
        label={t("quality.label")}
        title={t("quality.title")}
        description={t("quality.desc")}
        features={[
          t("quality.features.0"),
          t("quality.features.1"),
          t("quality.features.2"),
          t("quality.features.3"),
        ]}
        badge={{ text: t("quality.badge"), Icon: ShieldCheck }}
        className="bg-bg-warm dark:bg-brand-900/80"
      />

      {/* ===== 9. PARTNER LOGOS (matching template carousel) ===== */}
      <section className="py-20 md:py-28 bg-white dark:bg-brand-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            label={t("partners.label")}
            title={t("partners.title")}
            description={t("partners.desc")}
          />
          <div className="mt-12 flex items-center gap-3 md:gap-4">
            <button
              onClick={prevPartner}
              className="p-2 md:p-3 rounded-full border border-gray-200 dark:border-white/10 hover:bg-accent hover:text-white hover:border-accent transition-all shrink-0"
              aria-label={t("partners.prev")}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 overflow-hidden">
              <motion.div
                key={partnerStart}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {partners.slice(partnerStart, partnerStart + 4).map((p) => (
                  <div
                    key={p}
                    className="h-20 md:h-24 rounded-xl bg-white dark:bg-brand-800 border border-gray-100 dark:border-white/5 flex items-center justify-center text-text-muted dark:text-white/40 font-bold text-sm md:text-lg tracking-wider px-3 text-center leading-tight hover:border-accent/30 hover:text-accent dark:hover:text-accent hover:shadow-lg transition-all duration-300"
                  >
                    {p}
                  </div>
                ))}
              </motion.div>
            </div>
            <button
              onClick={nextPartner}
              className="p-2 md:p-3 rounded-full border border-gray-200 dark:border-white/10 hover:bg-accent hover:text-white hover:border-accent transition-all shrink-0"
              aria-label={t("partners.next")}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== 10. CTA CONTACT (matching template w3l-join-main) ===== */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-fixed bg-cover bg-center" style={{ backgroundImage: "url(/images/factory-bg.svg)" }}>
        <div className="absolute inset-0 bg-brand-900/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,169,110,0.15),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            label={t("cta.label")}
            title={t("cta.title")}
            description={t("cta.desc")}
            light
          />
          <div className="mt-12 max-w-xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
