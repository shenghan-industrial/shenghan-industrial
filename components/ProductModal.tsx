"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Package, FileText } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative bg-white dark:bg-brand-900 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product image */}
          <div
            className="h-64 md:h-80 bg-gray-200 dark:bg-brand-800 relative overflow-hidden"
            style={{
              backgroundImage: `url(${product.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-brand-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-8">
              <span className="text-xs font-medium tracking-wide text-accent-dark bg-white/80 dark:bg-brand-800/80 backdrop-blur-sm px-2 py-0.5 rounded">
                {product.subCategory || product.category}
              </span>
              {product.badge && (
                <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-accent/90 text-white">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-brand-800 dark:text-white mb-1">
              {product.name}
            </h2>
            <p className="text-text-muted mb-6">{product.subtitle}</p>

            <div className="flex items-center gap-2 mb-8">
              <FileText className="w-4 h-4 text-accent" />
              <span className="text-sm text-text-secondary leading-relaxed">
                {product.description}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-brand-800 mb-4">
                  <Check className="w-4 h-4 text-accent" />
                  Features
                </h4>
                <ul className="space-y-3">
                  {product.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-brand-800 mb-4">
                  <Package className="w-4 h-4 text-accent" />
                  Specifications
                </h4>
                <div className="space-y-2">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex justify-between py-2 border-b border-gray-100 dark:border-white/5 text-sm"
                    >
                      <span className="text-text-muted">{spec.label}</span>
                      <span className="font-medium text-brand-800 dark:text-white">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
