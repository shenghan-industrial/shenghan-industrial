"use client";

export const runtime = "edge";

import { use, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingCart,
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
  MessageCircle,
  Factory,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { InquiryStickyBar } from "@/components/InquiryStickyBar";
import { SectionHeading } from "@/components/SectionHeading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useT } from "@/lib/LanguageContext";
import { localizeProduct } from "@/lib/localizeProduct";
import { useInquiryCart } from "@/lib/InquiryContext";
import { useProducts } from "@/lib/use-products";
import { productSchema, breadcrumbSchema, JsonLD } from "@/lib/schema-org";
import { siteConfig } from "@/data/site-config";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, locale } = useT();
  const { products, loaded } = useProducts();
  const { addItem, setCartOpen } = useInquiryCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);
  const imgSize = useRef({ w: 0, h: 0 });

  const product = products.find((p) => p.id === id);
  const gallery = product ? [product.image, ...(product.images || [])].filter(Boolean) : [];
  const localized = product ? localizeProduct(product, locale) : null;
  const relatedProducts = product
    ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
    imgSize.current = { w: rect.width, h: rect.height };
  }, []);

  if (!product && loaded) notFound();

  if (!product || !localized) {
    return (
      <div className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#B8A080] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] dark:bg-[#12100E] pb-24 md:pb-0">
      {/* Schema.org structured data */}
      <JsonLD data={productSchema(product)} />
      <JsonLD data={breadcrumbSchema([
        { name: "Home", url: "https://shenghanindustrial.com" },
        { name: "Products", url: "https://shenghanindustrial.com/products" },
        { name: product.category, url: `https://shenghanindustrial.com/products?cat=${product.category}` },
        { name: localized.name, url: `https://shenghanindustrial.com/products/${product.id}` },
      ])} />
      {/* Top bar */}
      <div className="bg-white dark:bg-[#1A1816] border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5 flex items-center gap-2 text-xs text-gray-400 dark:text-white/30">
          <Link href="/" className="hover:text-[#B8A080]">{t("nav.home")}</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#B8A080]">{t("nav.products")}</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-white/60 truncate">{localized.name}</span>
        </div>
      </div>

      {/* Main: image left + info right — 1688 style */}
      <div className="bg-white dark:bg-[#1A1816]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-5">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Left: Image with magnifier */}
            <div className="md:w-[420px] shrink-0 relative">
              {/* Image + magnifier row */}
              <div className="flex gap-2">
                {/* Main image */}
                <div
                  ref={imgRef}
                  className="relative flex-1 bg-gray-100 dark:bg-[#12100E] rounded overflow-hidden border border-gray-200 dark:border-white/5 cursor-crosshair aspect-square"
                  onMouseEnter={() => setZooming(true)}
                  onMouseLeave={() => setZooming(false)}
                  onMouseMove={handleMouseMove}
                >
                  <ResponsiveImage
                    src={gallery[activeImage] || product.image}
                    alt={localized.name}
                    width={420}
                    height={420}
                    isLCP
                    className="w-full h-full object-contain"
                  />
                  {/* Lens box */}
                  {zooming && (
                    <div
                      className="absolute border-2 border-[#B8A080] bg-[#B8A080]/10 pointer-events-none"
                      style={{
                        left: `${Math.max(0, Math.min(70, zoomPos.x - 15))}%`,
                        top: `${Math.max(0, Math.min(70, zoomPos.y - 15))}%`,
                        width: "30%",
                        height: "30%",
                      }}
                    />
                  )}
                  {gallery.length > 1 && (
                    <>
                      <button onClick={() => setActiveImage((activeImage - 1 + gallery.length) % gallery.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 dark:bg-black/40 flex items-center justify-center text-gray-500 dark:text-white/70 hover:bg-white hover:text-gray-800 shadow-sm transition-colors z-10">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => setActiveImage((activeImage + 1) % gallery.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 dark:bg-black/40 flex items-center justify-center text-gray-500 dark:text-white/70 hover:bg-white hover:text-gray-800 shadow-sm transition-colors z-10">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Magnified view — positioned absolute to avoid layout shift */}
                {zooming && (
                  <div className="hidden md:block absolute left-full ml-3 top-0 w-[320px] h-[320px] rounded overflow-hidden border border-gray-200 dark:border-white/5 bg-[#12100E] shadow-xl z-20">
                    <ResponsiveImage
                      src={gallery[activeImage] || product.image}
                      alt=""
                      width={320}
                      height={320}
                      className="absolute w-full h-full object-contain"
                      style={{
                        transform: "scale(2.5)",
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }}
                    />
                  </div>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-14 h-14 rounded overflow-hidden border-2 ${i === activeImage ? "border-[#B8A080]" : "border-gray-200 dark:border-white/10 opacity-60"}`}>
                      <ResponsiveImage src={img} alt="" width={56} height={56} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">{localized.name}</h1>
              {product.model && <p className="text-xs text-[#B8A080] mt-0.5 font-mono">{product.model}</p>}
              <p className="text-sm text-gray-500 dark:text-white/40 mt-1">{localized.subtitle}</p>

              {/* Quick specs */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-[#12100E] rounded text-xs text-gray-500 dark:text-white/30 leading-relaxed space-y-1">
                {localized.specs.slice(0, 6).map((s) => (
                  <div key={s.label} className="flex gap-2">
                    <span className="text-gray-400 dark:text-white/20 shrink-0">{s.label}：</span>
                    <span className="text-gray-700 dark:text-white/60">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Trust Badges — above CTAs */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] text-[#6B6058] dark:text-white/40">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F5F2EF] dark:bg-white/5">
                  <Factory className="w-3 h-3 text-[#B8A080]" />{t("detail.trustFactory")}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F5F2EF] dark:bg-white/5">
                  <ShieldCheck className="w-3 h-3 text-[#B8A080]" />{t("detail.trustISO")}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F5F2EF] dark:bg-white/5">
                  <Clock className="w-3 h-3 text-[#B8A080]" />{t("detail.trustResponse")}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-sm"><Minus className="w-3.5 h-3.5" /></button>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center text-sm font-bold border-x border-gray-200 dark:border-white/10 py-2.5 outline-none bg-transparent text-gray-900 dark:text-white" />
                  <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 text-sm"><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <button onClick={handleAddToCart}
                  className={`h-10 px-5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all ${added ? "bg-green-500 text-white" : "bg-[#B8A080] text-white hover:bg-[#A89070]"}`}>
                  {added ? <><Check className="w-4 h-4" />{t("detail.added")}</> : <><ShoppingCart className="w-4 h-4" />{t("detail.addToCart")}</>}
                </button>
                <button onClick={() => { handleAddToCart(); setCartOpen(true); }}
                  className="h-10 px-5 rounded-lg text-sm font-bold bg-[#C8A14C] text-white hover:bg-[#B8943A] transition-all flex items-center gap-1.5 shadow-sm">
                  <Send className="w-4 h-4" />{t("detail.requestQuote")}
                </button>
                {/* WhatsApp quick contact (desktop) */}
                <a
                  href={siteConfig.contact.phone.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex h-10 px-4 rounded-lg text-sm font-bold border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>

              <p className="mt-3 text-xs text-gray-400 dark:text-white/20">
                <span className="text-[#B8A080] font-bold">{t("detail.inquiryNote")}</span> {t("detail.inquiryDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Details section — full width, simple */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Description */}
        <div className="bg-white dark:bg-[#1A1816] rounded border border-gray-200 dark:border-white/5 p-5 mb-5">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 pb-3 border-b border-gray-100 dark:border-white/5">{t("detail.productDesc")}</h2>
          <p className="text-sm text-gray-600 dark:text-white/50 leading-relaxed">{localized.description}</p>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-[#1A1816] rounded border border-gray-200 dark:border-white/5 p-5 mb-5">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 pb-3 border-b border-gray-100 dark:border-white/5">{t("modal.features")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {localized.features.map((f) => (
              <div key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-white/50">
                <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Full specs table */}
        <div className="bg-white dark:bg-[#1A1816] rounded border border-gray-200 dark:border-white/5 p-5">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 pb-3 border-b border-gray-100 dark:border-white/5">{t("modal.specs")}</h2>
          <table className="w-full text-sm">
            <tbody>
              {localized.specs.map((spec, i) => (
                <tr key={spec.label} className={i % 2 === 0 ? "bg-gray-50 dark:bg-[#12100E]/50" : ""}>
                  <td className="px-4 py-2.5 text-gray-400 dark:text-white/30 w-1/3 text-xs">{spec.label}</td>
                  <td className="px-4 py-2.5 text-gray-700 dark:text-white/70 text-xs font-medium">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-200 dark:border-white/5 py-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <SectionHeading label={t("detail.relatedLabel")} title={t("detail.relatedTitle")} />
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p, i) => (
                <ScrollReveal key={p.id}>
                  <ProductCard product={p} index={i} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky Inquiry Bar */}
      <InquiryStickyBar
        onAddToCart={handleAddToCart}
        onInquire={() => { handleAddToCart(); setCartOpen(true); }}
        isAdded={added}
      />
    </main>
  );
}
