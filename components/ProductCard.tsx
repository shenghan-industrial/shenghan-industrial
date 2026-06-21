"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import type { Product } from "@/data/products";
import { useT } from "@/lib/LanguageContext";
import { localizeProduct } from "@/lib/localizeProduct";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { QuickInquiryModal } from "@/components/QuickInquiryModal";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  index: number;
}

export function ProductCard({ product, onSelect, index }: ProductCardProps) {
  const { locale, t } = useT();
  const p = localizeProduct(product, locale);
  const isLCP = index < 3;
  const [modalOpen, setModalOpen] = useState(false);

  const handleQuickInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  const card = (
    <div className="group bg-white dark:bg-[#1A1816] rounded border border-gray-200 dark:border-white/5 overflow-hidden hover:border-[#B8A080]/40 hover:shadow-sm transition-all">
      {/* Image — responsive with lazy loading + Quick Inquiry overlay */}
      <div className="relative aspect-square bg-gray-100 dark:bg-[#12100E] overflow-hidden">
        <ResponsiveImage
          src={product.image}
          alt={p.name}
          width={300}
          height={300}
          isLCP={isLCP}
          loading={isLCP ? "eager" : "lazy"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {p.badge && (
          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#B8A080] text-white">
            {p.badge}
          </span>
        )}

        {/* Hover overlay — Quick Inquiry button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
          <button
            onClick={handleQuickInquiry}
            className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 px-4 py-2 rounded-lg bg-white dark:bg-[#1A1816] text-[#3D3730] dark:text-white text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-[#B8A080] hover:text-white"
          >
            <Send className="w-3 h-3" />
            {t("quickInquiry.title")}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-xs font-medium text-gray-800 dark:text-white leading-snug line-clamp-2 group-hover:text-[#B8A080] transition-colors">
          {p.name}
        </h3>
        {product.model && <p className="text-[10px] text-[#B8A080] mt-0.5 font-mono">{product.model}</p>}
        <p className="text-[10px] text-gray-400 dark:text-white/20 mt-1 line-clamp-1">{p.subtitle}</p>

        {/* Bottom Quick Inquiry link */}
        <button
          onClick={handleQuickInquiry}
          className="mt-2 w-full py-1.5 rounded text-[10px] font-semibold text-[#B8A080] border border-transparent hover:border-[#B8A080]/30 hover:bg-[#B8A080]/5 transition-all flex items-center justify-center gap-1"
        >
          <Send className="w-2.5 h-2.5" />
          {t("quickInquiry.title")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {onSelect ? (
        <div onClick={() => onSelect(product)} className="cursor-pointer">{card}</div>
      ) : (
        <Link href={`/products/${product.id}`} className="block">{card}</Link>
      )}
      <QuickInquiryModal product={product} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
