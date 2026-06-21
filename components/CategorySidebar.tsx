"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/data/categories";
import { MegaMenu } from "@/components/MegaMenu";
import { useT } from "@/lib/LanguageContext";
import { localizeCategoryName } from "@/lib/localizeProduct";
import { useCategories } from "@/lib/use-categories";

// Categories that are "coming soon" — grayed out, not clickable
const COMING_SOON_CATEGORIES = ["building-materials", "hardware", "appliances", "others"];

interface CategorySidebarProps {
  activeCategory?: string;
  onSelectCategory: (cat: Category) => void;
}

export function CategorySidebar({ activeCategory, onSelectCategory }: CategorySidebarProps) {
  const { locale, t } = useT();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const categories = useCategories();

  return (
    <div className="w-full bg-white dark:bg-brand-900 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-visible">
      <div className="px-4 py-3 bg-bg-warm dark:bg-brand-800/50 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-sm font-bold text-brand-800 dark:text-white">
          {t("products.allCategories")}
        </h3>
      </div>

      <div className="py-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const isHovered = hoveredId === cat.id;
          const catName = localizeCategoryName(cat, locale);
          const isComingSoon = COMING_SOON_CATEGORIES.includes(cat.id);

          return (
            <div
              key={cat.id}
              className="relative" style={isHovered ? { zIndex: 50 } : undefined}
              onMouseEnter={() => !isComingSoon && setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                onClick={() => !isComingSoon && onSelectCategory(cat)}
                disabled={isComingSoon}
                title={isComingSoon ? (locale === "zh" ? "即将上线" : locale === "es" ? "Próximamente" : "Coming Soon") : undefined}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  isComingSoon
                    ? "text-gray-300 dark:text-white/15 cursor-not-allowed grayscale"
                    : isActive
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-text-secondary dark:text-white/60 hover:bg-bg-warm dark:hover:bg-brand-800/30"
                }`}
              >
                <span className="truncate flex items-center gap-2">
                  {catName}
                  {isComingSoon && (
                    <span className="text-[10px] text-gray-300 dark:text-white/10 border border-gray-200 dark:border-white/5 rounded px-1.5 py-0.5 whitespace-nowrap">
                      {locale === "zh" ? "即将上线" : locale === "es" ? "Próximamente" : "Coming Soon"}
                    </span>
                  )}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 ${isComingSoon ? "opacity-20" : "opacity-40"}`} />
              </button>

              {/* MegaMenu on hover — only for active categories */}
              <AnimatePresence>
                {isHovered && !isComingSoon && (cat.children?.length || cat.groups?.length) && (
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
