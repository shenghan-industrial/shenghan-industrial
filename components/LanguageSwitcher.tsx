"use client";

import { useT } from "@/lib/LanguageContext";

interface LanguageSwitcherProps {
  variant?: "default" | "light";
}

export function LanguageSwitcher({ variant = "default" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useT();

  const isLight = variant === "light";

  return (
    <div className="flex items-center gap-0.5 text-xs">
      <button
        onClick={() => setLocale("en")}
        className={`px-2 py-1 rounded font-medium transition-colors ${
          locale === "en"
            ? isLight ? "text-white font-bold" : "text-brand-800 dark:text-white font-bold"
            : isLight ? "text-white/40 hover:text-white/70" : "text-text-muted dark:text-white/30 hover:text-text-secondary dark:hover:text-white/50"
        }`}
      >
        EN
      </button>
      <span className={isLight ? "text-white/15" : "text-text-muted/20 dark:text-white/10"}>|</span>
      <button
        onClick={() => setLocale("zh")}
        className={`px-2 py-1 rounded font-medium transition-colors ${
          locale === "zh"
            ? isLight ? "text-white font-bold" : "text-brand-800 dark:text-white font-bold"
            : isLight ? "text-white/40 hover:text-white/70" : "text-text-muted dark:text-white/30 hover:text-text-secondary dark:hover:text-white/50"
        }`}
      >
        中文
      </button>
      <span className={isLight ? "text-white/15" : "text-text-muted/20 dark:text-white/10"}>|</span>
      <button
        onClick={() => setLocale("es")}
        className={`px-2 py-1 rounded font-medium transition-colors ${
          locale === "es"
            ? isLight ? "text-white font-bold" : "text-brand-800 dark:text-white font-bold"
            : isLight ? "text-white/40 hover:text-white/70" : "text-text-muted dark:text-white/30 hover:text-text-secondary dark:hover:text-white/50"
        }`}
      >
        ES
      </button>
    </div>
  );
}
