"use client";

import { useT } from "@/lib/LanguageContext";
import { motion } from "framer-motion";

export function LanguageSwitcher() {
  const { locale, setLocale } = useT();

  const toggle = () => {
    setLocale(locale === "en" ? "zh" : "en");
  };

  return (
    <button
      onClick={toggle}
      className="relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold tracking-tight transition-colors hover:bg-black/5 dark:hover:bg-white/10"
      aria-label="Switch language"
    >
      <motion.span
        key={locale}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-brand-800 dark:text-white"
      >
        {locale === "en" ? "EN" : "中"}
      </motion.span>
    </button>
  );
}
