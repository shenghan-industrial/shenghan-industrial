"use client";

import { useState, useRef } from "react";
import { useT } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index: number;
}

export function ProductCard({ product, onSelect, index }: ProductCardProps) {
  const { t } = useT();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [cursorVisible, setCursorVisible] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(-(y - centerY) / 20);
    setRotateY((x - centerX) / 20);
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  const handleMouseEnter = () => setCursorVisible(true);
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
    setCursorVisible(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
      className="group cursor-pointer relative bg-white dark:bg-brand-900 rounded-2xl border border-gray-100/80 dark:border-white/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-brand-900/5 dark:hover:shadow-black/20 hover:border-accent/15"
    >
      {/* Cursor-follow glare */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(201,169,110,0.06), transparent 55%)`,
        }}
      />

      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-accent/90 text-brand-900 backdrop-blur-sm shadow-sm">
            {product.badge}
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-56 bg-gray-100 dark:bg-brand-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${product.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-brand-900/90 via-white/20 dark:via-brand-900/20 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="text-[11px] font-medium tracking-wider uppercase text-accent-dark bg-white/85 dark:bg-brand-900/85 backdrop-blur-sm px-2.5 py-1 rounded-md">
            {product.subCategory || product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        <h3 className="text-base font-semibold text-brand-800 dark:text-white leading-snug mb-1 group-hover:text-accent-dark dark:group-hover:text-accent transition-colors duration-500 tracking-tight">
          {product.name}
        </h3>
        <p className="text-[13px] text-text-muted dark:text-white/35 mb-4 leading-relaxed">
          {product.subtitle}
        </p>

        <p className="text-[13px] text-text-secondary dark:text-white/45 leading-relaxed line-clamp-2 mb-5">
          {product.description}
        </p>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {product.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="text-[11px] text-text-muted dark:text-white/30 bg-bg-warm dark:bg-brand-800/50 px-2.5 py-1 rounded-md tracking-wide"
            >
              {f.length > 16 ? f.slice(0, 16) + "…" : f}
            </span>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={() => onSelect(product)}
          className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-brand-800/[0.04] dark:bg-white/[0.03] text-brand-800 dark:text-white/70 font-medium text-[13px] tracking-wide group-hover:bg-accent group-hover:text-brand-900 dark:group-hover:text-brand-900 transition-all duration-500 overflow-hidden relative"
        >
          <span className="relative z-10">{t("products.viewDetails")}</span>
          <ChevronRight className="w-4 h-4 relative z-10 transition-transform duration-500 group-hover:translate-x-1" />
          <div className="absolute inset-0 bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
        </button>
      </div>
    </motion.div>
  );
}
