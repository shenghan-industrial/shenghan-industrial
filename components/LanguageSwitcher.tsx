"use client";

import { useT } from "@/lib/LanguageContext";
import type { Locale } from "@/lib/localizeProduct";

interface LanguageSwitcherProps {
  variant?: "default" | "light";
}

// EN · 中文 · ไทย (Thai) · MS (Bahasa Melayu) · FR (Français) · ES (Español)
const LANGS: { code: Locale; label: string; title: string }[] = [
  { code: "en", label: "EN", title: "English" },
  { code: "zh", label: "中文", title: "中文" },
  { code: "th", label: "ไทย", title: "ภาษาไทย (Thai)" },
  { code: "ms", label: "MS", title: "Bahasa Melayu (Malay)" },
  { code: "fr", label: "FR", title: "Français (French)" },
  { code: "es", label: "ES", title: "Español (Spanish)" },
];

export function LanguageSwitcher({ variant = "default" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useT();

  const isLight = variant === "light";

  return (
    <div className="flex items-center gap-0.5 text-xs flex-wrap">
      {LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center gap-0.5">
          {i > 0 && (
            <span className={isLight ? "text-white/15" : "text-text-muted/20 dark:text-white/10"}>|</span>
          )}
          <button
            type="button"
            title={l.title}
            aria-label={l.title}
            onClick={() => setLocale(l.code)}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              locale === l.code
                ? isLight
                  ? "text-white font-bold"
                  : "text-brand-800 dark:text-white font-bold"
                : isLight
                ? "text-white/40 hover:text-white/70"
                : "text-text-muted dark:text-white/30 hover:text-text-secondary dark:hover:text-white/50"
            }`}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
