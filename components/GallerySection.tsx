"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { X } from "lucide-react";
import { useT } from "@/lib/LanguageContext";

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

interface GallerySectionProps {
  images: GalleryImage[];
  categories?: string[];
}

export function GallerySection({
  images,
  categories = ["All", "Factory", "Products", "Quality"],
}: GallerySectionProps) {
  const { t } = useT();

  const [activeCat, setActiveCat] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered =
    activeCat === "All"
      ? images
      : images.filter((img) => img.category === activeCat);

  return (
    <>
      <section className="py-20 md:py-28 bg-bg-warm dark:bg-brand-900/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            label={t("gallery.label")}
            title={t("gallery.title")}
            description={t("gallery.desc")}
          />

          <div className="flex flex-wrap items-center justify-center gap-3 mt-10 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCat === cat
                    ? "bg-brand-800 text-white shadow-lg"
                    : "bg-white dark:bg-brand-800/50 text-text-secondary dark:text-white/60 border border-gray-200 dark:border-white/10 hover:border-brand-800/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div
            key={activeCat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {filtered.map((img) => (
              <motion.button
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setLightbox(img.src)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-brand-800"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${img.src})` }}
                />
                <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-4 py-2 rounded-full bg-white/90 text-brand-800 text-sm font-medium backdrop-blur-sm">
                    {t("gallery.view")}
                  </span>
                </div>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-brand-900/60 text-white text-xs backdrop-blur-sm">
                  {img.alt}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightbox}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
