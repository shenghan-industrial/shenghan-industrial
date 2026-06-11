"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { categories, type SubCategory } from "@/data/categories";
import { products } from "@/data/products";
import { useT } from "@/lib/LanguageContext";

// Flatten all subcategories with their Chinese/English names for matching
function buildSearchIndex() {
  const index: { sub: SubCategory; catZh: string; catEn: string }[] = [];
  for (const cat of categories) {
    const items = cat.children || cat.groups?.flatMap((g) => g.children) || [];
    for (const item of items) {
      index.push({ sub: item, catZh: cat.nameZh, catEn: cat.name });
    }
  }
  return index;
}

const searchIndex = buildSearchIndex();

// All subcategory keywords for autocomplete
function getAllKeywords() {
  const kw = new Set<string>();
  for (const { sub, catZh } of searchIndex) {
    kw.add(sub.nameZh);
    kw.add(sub.name);
    kw.add(catZh);
  }
  return [...kw];
}

const allKeywords = getAllKeywords();

interface SearchBarProps {
  variant?: "standalone" | "inline";
  onClose?: () => void;
}

export function SearchBar({ variant = "standalone", onClose }: SearchBarProps) {
  const { t, locale } = useT();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find matching subcategory for a query (Chinese or English)
  const findMatch = useCallback((q: string) => {
    const qLower = q.toLowerCase().trim();
    if (!qLower) return null;

    // Try exact match first
    for (const { sub, catZh, catEn } of searchIndex) {
      if (sub.nameZh === q || sub.name.toLowerCase() === qLower) {
        return { cat: sub.productCategory, sub: sub.productSubCategory, label: locale === "zh" ? sub.nameZh : locale === "es" ? (sub as any).nameEs || sub.name : sub.name };
      }
    }

    // Try contains match - subcategory name
    for (const { sub, catZh, catEn } of searchIndex) {
      if (sub.nameZh.includes(q) || sub.name.toLowerCase().includes(qLower)) {
        return { cat: sub.productCategory, sub: sub.productSubCategory, label: locale === "zh" ? sub.nameZh : locale === "es" ? (sub as any).nameEs || sub.name : sub.name };
      }
    }

    // Try contains match - parent category name
    for (const { sub, catZh, catEn } of searchIndex) {
      if (catZh.includes(q) || catEn.toLowerCase().includes(qLower)) {
        return { cat: sub.productCategory, sub: undefined, label: locale === "zh" ? catZh : locale === "es" ? catEn : catEn };
      }
    }

    return null;
  }, [locale]);

  // Autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!query.trim()) return { subMatches: [], productMatches: [] };
    const q = query.toLowerCase().trim();

    // Matching subcategory names
    const subMatches = searchIndex
      .filter(({ sub, catZh }) =>
        sub.nameZh.includes(query) || sub.name.toLowerCase().includes(q) || catZh.includes(query)
      )
      .slice(0, 5)
      .map(({ sub, catZh }) => ({
        label: locale === "zh" ? `${catZh} > ${sub.nameZh}` : locale === "es" ? `${sub.nameEs || sub.name}` : `${sub.name}`,
        sub: sub.productSubCategory,
        cat: sub.productCategory,
      }));

    // Also match product names directly
    const productMatches = products
      .filter((p) => {
        const mapping = searchIndex.find(({ sub }) => sub.productSubCategory === p.subCategory);
        const zhMatch = mapping ? mapping.sub.nameZh.includes(query) || mapping.catZh.includes(query) : false;
        return p.name.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q) || zhMatch;
      })
      .slice(0, 3)
      .map((p) => ({
        label: p.name,
        productId: p.id,
      }));

    return { subMatches, productMatches };
  }, [query, locale]);

  const doSearch = useCallback((searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q) return;
    setFocused(false);

    // 1. Subcategory/category match (Chinese or English)
    const match = findMatch(q);
    if (match) {
      if (match.sub) {
        window.location.href = `/products?sub=${encodeURIComponent(match.sub)}&cat=${encodeURIComponent(match.cat)}`;
        return;
      }
      window.location.href = `/products?cat=${encodeURIComponent(match.cat)}`;
      return;
    }

    // 2. Product name match
    const productMatch = products.find((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (productMatch) {
      window.location.href = `/products/${productMatch.id}`;
      return;
    }

    // 3. Fallback
    window.location.href = `/products?q=${encodeURIComponent(q)}`;
  }, [query, findMatch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      doSearch();
    }
  };

  const handleSuggestionClick = (suggestion: { sub?: string; cat?: string; productId?: string; label: string }) => {
    setFocused(false);
    setQuery(suggestion.label);
    if ("productId" in suggestion && suggestion.productId) {
      window.location.href = `/products/${suggestion.productId}`;
    } else if (suggestion.sub && suggestion.cat) {
      window.location.href = `/products?sub=${encodeURIComponent(suggestion.sub)}&cat=${encodeURIComponent(suggestion.cat)}`;
    } else if (suggestion.cat) {
      window.location.href = `/products?cat=${encodeURIComponent(suggestion.cat)}`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
        if (variant === "inline") onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [variant, onClose]);

  useEffect(() => {
    if (variant === "inline") {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setQuery("");
          setFocused(false);
          onClose?.();
        }
      };
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [variant, onClose]);

  // Inline variant renders a compact search input for navbar use
  if (variant === "inline") {
    return (
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-white/30" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
            placeholder={t("search.inlinePlaceholder")}
            className="w-[240px] pl-9 pr-8 py-2 rounded-lg bg-bg-warm dark:bg-brand-800 border border-gray-200 dark:border-white/10 focus:border-accent outline-none text-sm text-brand-800 dark:text-white placeholder:text-text-muted dark:placeholder:text-white/20 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-brand-700 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-text-muted dark:text-white/30" />
            </button>
          )}
        </div>

        {/* Autocomplete dropdown — narrower for inline */}
        <AnimatePresence>
          {focused && (suggestions.subMatches.length > 0 || suggestions.productMatches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full mt-1.5 left-0 w-[320px] bg-white dark:bg-brand-900 rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-50"
            >
              {suggestions.subMatches.map((s, i) => (
                <button
                  key={`sub-${i}`}
                  onClick={() => { handleSuggestionClick(s); onClose?.(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-bg-warm dark:hover:bg-brand-800/50 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0"
                >
                  <Search className="w-3.5 h-3.5 text-text-muted dark:text-white/30 shrink-0" />
                  <span className="text-sm text-brand-800 dark:text-white">{s.label}</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent shrink-0">
                    {t("search.categoryTag")}
                  </span>
                </button>
              ))}
              {suggestions.productMatches.map((p, i) => (
                <button
                  key={`prod-${i}`}
                  onClick={() => { handleSuggestionClick(p); onClose?.(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-bg-warm dark:hover:bg-brand-800/50 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0"
                >
                  <Search className="w-3.5 h-3.5 text-text-muted dark:text-white/30 shrink-0" />
                  <span className="text-sm text-brand-800 dark:text-white truncate">{p.label}</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent shrink-0">
                    {t("search.productTag")}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted dark:text-white/30" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={t("search.placeholder")}
            className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white dark:bg-brand-800 border-2 border-gray-100 dark:border-white/10 focus:border-accent dark:focus:border-accent outline-none text-sm text-brand-800 dark:text-white placeholder:text-text-muted dark:placeholder:text-white/20 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-brand-700 transition-colors"
            >
              <X className="w-4 h-4 text-text-muted dark:text-white/30" />
            </button>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={() => doSearch()}
          className="shrink-0 px-6 py-3.5 rounded-xl bg-accent text-brand-900 font-semibold text-sm hover:bg-accent-light transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">{t("search.button")}</span>
        </button>
      </div>

      {/* Autocomplete dropdown */}
      <AnimatePresence>
        {focused && (suggestions.subMatches.length > 0 || suggestions.productMatches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-brand-900 rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-50"
          >
            {suggestions.subMatches.map((s, i) => (
              <button
                key={`sub-${i}`}
                onClick={() => handleSuggestionClick(s)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-bg-warm dark:hover:bg-brand-800/50 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0"
              >
                <Search className="w-3.5 h-3.5 text-text-muted dark:text-white/30 shrink-0" />
                <span className="text-sm text-brand-800 dark:text-white">{s.label}</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent shrink-0">
                  {t("search.categoryTag")}
                </span>
              </button>
            ))}
            {suggestions.productMatches.map((p, i) => (
              <button
                key={`prod-${i}`}
                onClick={() => handleSuggestionClick(p)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-bg-warm dark:hover:bg-brand-800/50 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0"
              >
                <Search className="w-3.5 h-3.5 text-text-muted dark:text-white/30 shrink-0" />
                <span className="text-sm text-brand-800 dark:text-white truncate">{p.label}</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent shrink-0">
                  {t("search.productTag")}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
