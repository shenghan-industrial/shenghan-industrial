"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { useT } from "@/lib/LanguageContext";
import { localizeProduct } from "@/lib/localizeProduct";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  index: number;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { locale } = useT();
  const p = localizeProduct(product, locale);

  const card = (
    <div className="group bg-white dark:bg-[#1A1816] rounded border border-gray-200 dark:border-white/5 overflow-hidden hover:border-[#B8A080]/40 hover:shadow-sm transition-all">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-[#12100E] overflow-hidden">
        <img
          src={product.image}
          alt={p.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {p.badge && (
          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#B8A080] text-white">
            {p.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-xs font-medium text-gray-800 dark:text-white leading-snug line-clamp-2 group-hover:text-[#B8A080] transition-colors">
          {p.name}
        </h3>
        {product.model && <p className="text-[10px] text-[#B8A080] mt-0.5 font-mono">{product.model}</p>}
        <p className="text-[10px] text-gray-400 dark:text-white/20 mt-1 line-clamp-1">{p.subtitle}</p>
      </div>
    </div>
  );

  if (onSelect) {
    return <div onClick={() => onSelect(product)} className="cursor-pointer">{card}</div>;
  }

  return <Link href={`/products/${product.id}`} className="block">{card}</Link>;
}
