"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Check, Loader2, User, Mail, Phone, Package } from "lucide-react";
import type { Product } from "@/data/products";
import { useT } from "@/lib/LanguageContext";
import { localizeProduct } from "@/lib/localizeProduct";
import { TurnstileWidget } from "@/components/TurnstileWidget";

interface QuickInquiryModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function QuickInquiryModal({ product, open, onClose }: QuickInquiryModalProps) {
  const { t, locale } = useT();
  const p = product ? localizeProduct(product, locale) : null;

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (open) {
      setForm({ name: "", email: "", phone: "" });
      setDone(false);
      setError("");
      setSubmitting(false);
      setTurnstileToken("");
      setResetKey((k) => k + 1);
    }
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSubmit = useCallback(async () => {
    if (!product || !p) return;
    if (!form.name.trim() || !form.email.trim()) {
      setError(t("quickInquiry.validationError"));
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          message: `Quick inquiry for: ${p.name}`,
          turnstileToken: turnstileToken || undefined,
          items: [{
            productId: product.id, name: p.name,
            model: product.model || undefined, quantity: 1, category: product.category,
          }],
        }),
      });
      if (res.ok) { setDone(true); }
      else { const data = await res.json().catch(() => ({})); setError(data.error || "Submit failed."); }
    } catch {
      setError(t("quickInquiry.networkError"));
    }
    setSubmitting(false);
  }, [form, product, p, locale, turnstileToken, t]);

  if (!product || !p) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full md:max-w-sm max-h-[85vh] overflow-y-auto bg-white dark:bg-[#1A1816] rounded-t-2xl md:rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 md:mx-4">
            {done ? (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-green-500" />
                </motion.div>
                <h3 className="text-lg font-bold text-[#3D3730] dark:text-white mb-2">{t("quickInquiry.success")}</h3>
                <p className="text-sm text-[#9B8E7E] dark:text-white/40 mb-6">{t("quickInquiry.successMsg")}</p>
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-[#B8A080] text-white text-sm font-bold hover:bg-[#A89070] transition-colors">
                  {t("quickInquiry.close")}
                </button>
              </div>
            ) : (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#3D3730] dark:text-white">{t("quickInquiry.title")}</h3>
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"><X className="w-4 h-4 text-[#9B8E7E]" /></button>
                </div>
                <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-[#F5F2EF] dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <Package className="w-4 h-4 text-[#B8A080] shrink-0" />
                  <div className="min-w-0"><p className="text-xs font-medium text-[#3D3730] dark:text-white truncate">{p.name}</p>
                    {product.model && <p className="text-[10px] text-[#B8A080] font-mono">{product.model}</p>}</div>
                </div>
                <div className="space-y-3">
                  <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8E7E]" />
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={t("quickInquiry.namePlaceholder")} autoFocus
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white placeholder:text-[#9B8E7E] focus:outline-none focus:border-[#B8A080] transition-colors" /></div>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8E7E]" />
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={t("quickInquiry.emailPlaceholder")}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white placeholder:text-[#9B8E7E] focus:outline-none focus:border-[#B8A080] transition-colors" /></div>
                  <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8E7E]" />
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder={t("quickInquiry.phonePlaceholder")}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white placeholder:text-[#9B8E7E] focus:outline-none focus:border-[#B8A080] transition-colors" /></div>
                </div>
                {error && <p className="mt-3 text-xs text-red-500 text-center">{error}</p>}
                <TurnstileWidget onToken={setTurnstileToken} resetKey={resetKey} />
                <button onClick={handleSubmit} disabled={submitting}
                  className="mt-4 w-full py-3 rounded-xl bg-[#B8A080] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#A89070] transition-colors disabled:opacity-50">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />{t("quickInquiry.sending")}</> : <><Send className="w-4 h-4" />{t("quickInquiry.submit")}</>}
                </button>
                <p className="mt-3 text-center text-[10px] text-[#9B8E7E] dark:text-white/20">{t("quickInquiry.footerNote")}</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
