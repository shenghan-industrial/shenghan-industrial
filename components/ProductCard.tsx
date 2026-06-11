"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useT } from "@/lib/LanguageContext";
import { localizeProduct } from "@/lib/localizeProduct";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  index: number;
}

export function ProductCard({ product, onSelect, index }: ProductCardProps) {
  const { locale } = useT();
  const p = localizeProduct(product, locale);
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group cursor-pointer bg-white dark:bg-brand-900 rounded-lg border border-gray-100 dark:border-white/5 overflow-hidden hover:border-accent/30 hover:shadow-lg transition-all duration-200"
    >
      {/* Image - full display, no overlay */}
      <div className="relative aspect-square bg-gray-100 dark:bg-brand-800 overflow-hidden">
        <img
          src={product.image}
          alt={p.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {p.badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-accent text-white">
            {p.badge}
          </span>
        )}
      </div>

      {/* Name only */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-brand-800 dark:text-white leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {p.name}
        </h3>
      </div>
    </motion.div>
  );

  if (onSelect) {
    return (
      <div onClick={() => onSelect(product)} className="cursor-pointer">
        {card}
      </div>
    );
  }

  return (
    <Link href={`/products/${product.id}`} className="block">
      {card}
    </Link>
  );
}
