"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  X,
  Minus,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { useInquiryCart } from "@/lib/InquiryContext";
import { useT } from "@/lib/LanguageContext";

export function InquiryCart() {
  const { t } = useT();
  const { items, removeItem, updateQuantity, clearCart, totalItems, cartOpen, setCartOpen } = useInquiryCart();
  const [copied, setCopied] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const generateTextList = () => {
    return items
      .map(
        (item, i) =>
          `${i + 1}. ${item.name}\n   ${t("cart.quantity")}: ${item.quantity}\n   ${t("cart.category")}: ${item.category}`
      )
      .join("\n\n");
  };

  const handleCopy = async () => {
    const header = `${t("cart.inquiryList")}\n${"=".repeat(30)}\n\n`;
    const footer = `\n\n${"=".repeat(30)}\n${t("cart.total")}: ${totalItems} ${t("cart.items")}\n${t("cart.website")}: shenghanindustrial.com`;
    const text = header + generateTextList() + footer;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const header = `${t("cart.inquiryList")}\n${"=".repeat(30)}\n\n`;
    const footer = `\n\n${"=".repeat(30)}\n${t("cart.total")}: ${totalItems} ${t("cart.items")}\n${t("cart.website")}: shenghanindustrial.com`;
    const text = header + generateTextList() + footer;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shenghan-inquiry-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenChat = () => {
    if (typeof window !== "undefined" && (window as any).Tawk_API) {
      (window as any).Tawk_API.maximize();
    }
    setCartOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 px-5 py-3.5 rounded-full bg-accent text-brand-900 font-semibold text-sm shadow-xl shadow-accent/30 hover:bg-accent-light transition-all hover:scale-105 active:scale-95"
      >
        <ShoppingCart className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-900 text-accent text-xs font-bold">
            {totalItems}
          </span>
        )}
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[101] w-full max-w-md bg-white dark:bg-brand-900 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold text-brand-800 dark:text-white">
                    {t("cart.title")}
                  </h2>
                  {totalItems > 0 && (
                    <span className="text-sm text-text-muted dark:text-white/40">
                      ({totalItems} {t("cart.items")})
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-lg hover:bg-bg-warm dark:hover:bg-brand-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div ref={listRef} className="flex-1 overflow-y-auto p-5">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-text-muted dark:text-white/30">
                    <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-sm">{t("cart.empty")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-4 p-4 rounded-xl bg-bg-warm dark:bg-brand-800/50 border border-gray-100 dark:border-white/5"
                      >
                        <div
                          className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-brand-700 shrink-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-brand-800 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-text-muted dark:text-white/40 mt-0.5">
                            {item.category}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-brand-600 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-semibold text-brand-800 dark:text-white min-w-[1.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-brand-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="ml-auto p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer actions */}
              {items.length > 0 && (
                <div className="p-5 border-t border-gray-100 dark:border-white/10 space-y-3">
                  {/* Export buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        copied
                          ? "bg-green-500 text-white"
                          : "bg-bg-warm dark:bg-brand-800 text-brand-800 dark:text-white hover:bg-accent/10"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" /> {t("cart.copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> {t("cart.copy")}
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-bg-warm dark:bg-brand-800 text-brand-800 dark:text-white hover:bg-accent/10 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      {t("cart.download")}
                    </button>
                  </div>

                  {/* Chat button */}
                  <button
                    onClick={handleOpenChat}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-brand-900 font-semibold text-sm hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t("cart.contactChat")}
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Clear */}
                  <button
                    onClick={clearCart}
                    className="w-full text-center text-xs text-text-muted dark:text-white/30 hover:text-red-400 transition-colors py-1"
                  >
                    {t("cart.clearAll")}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
