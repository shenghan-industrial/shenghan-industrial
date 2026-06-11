"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Category } from "@/data/categories";
import { useT } from "@/lib/LanguageContext";
import { localizeCategoryName } from "@/lib/localizeProduct";
import type { Locale } from "@/lib/localizeProduct";

interface MegaMenuProps {
  category: Category;
  locale: Locale;
  onSelect?: () => void;
}

export function MegaMenu({ category, locale, onSelect }: MegaMenuProps) {
  const { t } = useT();
  const name = localizeCategoryName(category, locale);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
      className="absolute left-full top-0 ml-1 min-w-[480px] z-[60] bg-white dark:bg-brand-900 rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 p-6"
    >
      <h3 className="text-sm font-bold text-brand-800 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-white/5">
        {name}
      </h3>

      {/* Has groups (2-level: 灯具类 > 室内/室外) */}
      {category.groups && category.groups.length > 0 && (
        <div className="space-y-5">
          {category.groups.map((group) => {
            const groupName = localizeCategoryName(group, locale);
            return (
              <div key={group.id}>
                <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                  {groupName}
                </h4>
                {group.children.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1">
                    {group.children.map((child) => {
                      const childName = localizeCategoryName(child, locale);
                      return (
                        <Link
                          key={child.id}
                          href={`/products?sub=${child.productSubCategory}&cat=${child.productCategory}`}
                          onClick={onSelect}
                          className="px-3 py-2 text-sm text-text-secondary dark:text-white/60 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors"
                        >
                          {childName}
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted dark:text-white/30 italic px-3">
                    {t("common.comingSoon")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Flat children (1-level: 软体类 > 沙发/床/柜) */}
      {category.children && category.children.length > 0 && (
        <div className="grid grid-cols-3 gap-1">
          {category.children.map((child) => {
            const childName = localizeCategoryName(child, locale);
            return (
              <Link
                key={child.id}
                href={`/products?sub=${child.productSubCategory}&cat=${child.productCategory}`}
                onClick={onSelect}
                className="px-3 py-2.5 text-sm text-text-secondary dark:text-white/60 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors font-medium"
              >
                {childName}
              </Link>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {(!category.children || category.children.length === 0) &&
        (!category.groups || category.groups.length === 0) && (
          <p className="text-sm text-text-muted dark:text-white/30 italic">
            {t("common.comingSoon")}
          </p>
        )}
    </motion.div>
  );
}
