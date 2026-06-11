"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { categories, type Category } from "@/data/categories";
import { MegaMenu } from "@/components/MegaMenu";
import { useT } from "@/lib/LanguageContext";
import { localizeCategoryName } from "@/lib/localizeProduct";

interface CategorySidebarProps {
  activeCategory?: string;
  onSelectCategory: (cat: Category) => void;
}

export function CategorySidebar({ activeCategory, onSelectCategory }: CategorySidebarProps) {
  const { locale } = useT();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full bg-white dark:bg-brand-900 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-visible">
      <div className="px-4 py-3 bg-bg-warm dark:bg-brand-800/50 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-sm font-bold text-brand-800 dark:text-white">
          {locale === "zh" ? "全部品类" : locale === "es" ? "Todas las Categorías" : "All Categories"}
        </h3>
      </div>

      <div className="py-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const isHovered = hoveredId === cat.id;
          const catName = localizeCategoryName(cat, locale);

          return (
            <div
              key={cat.id}
              className="relative" style={isHovered ? { zIndex: 50 } : undefined}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                onClick={() => onSelectCategory(cat)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-text-secondary dark:text-white/60 hover:bg-bg-warm dark:hover:bg-brand-800/30"
                }`}
              >
                <span>{catName}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              {/* MegaMenu on hover */}
              <AnimatePresence>
                {isHovered && (cat.children?.length || cat.groups?.length) && (
                  <MegaMenu
                    category={cat}
                    locale={locale}
                    onSelect={() => setHoveredId(null)}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
