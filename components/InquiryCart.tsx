"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  X,
  Minus,
  Plus,
  Trash2,
  Check,
  Send,
  Mail,
  User,
  Phone,
  Loader2,
} from "lucide-react";
import { useInquiryCart } from "@/lib/InquiryContext";
import { useT } from "@/lib/LanguageContext";

export function InquiryCart() {
  const { t } = useT();
  const { items, removeItem, updateQuantity, clearCart, totalItems, cartOpen, setCartOpen } = useInquiryCart();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          items: items.map(i => ({ productId: i.productId, name: i.name, quantity: i.quantity, category: i.category })),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        clearCart();
        setTimeout(() => { setShowForm(false); setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }, 3000);
      }
    } catch (e) {
      console.error("Submit failed", e);
    }
    setSubmitting(false);
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
              <div className="flex-1 overflow-y-auto p-5">
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
                  {submitted ? (
                    <div className="text-center py-4">
                      <Check className="w-10 h-10 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">Inquiry Submitted!</p>
                      <p className="text-xs text-gray-400 mt-1">We&apos;ll reply within 24 hours.</p>
                    </div>
                  ) : showForm ? (
                    /* Inquiry Form */
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-bg-warm dark:bg-brand-800">
                        <User className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder={t("cart.formName") || "Your Name *"}
                          value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                          className="flex-1 bg-transparent text-sm outline-none text-brand-800 dark:text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-bg-warm dark:bg-brand-800">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          placeholder={t("cart.formEmail") || "Email Address *"}
                          value={form.email}
                          onChange={e => setForm({...form, email: e.target.value})}
                          className="flex-1 bg-transparent text-sm outline-none text-brand-800 dark:text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-bg-warm dark:bg-brand-800">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          placeholder={t("cart.formPhone") || "WhatsApp / Phone *"}
                          value={form.phone}
                          onChange={e => setForm({...form, phone: e.target.value})}
                          className="flex-1 bg-transparent text-sm outline-none text-brand-800 dark:text-white placeholder:text-gray-400"
                        />
                      </div>
                      <textarea
                        placeholder={t("cart.formMessage") || "Additional notes (optional)"}
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-bg-warm dark:bg-brand-800 text-sm outline-none text-brand-800 dark:text-white placeholder:text-gray-400 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowForm(false)}
                          className="flex-1 py-2.5 rounded-lg text-sm border border-gray-200 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-brand-800 transition-colors"
                        >
                          {t("cart.cancel") || "Cancel"}
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={!form.name.trim() || !form.email.trim() || !form.phone.trim() || submitting}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-[#A89070] transition-all disabled:opacity-50"
                        >
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          {t("cart.submitInquiry") || "Submit Inquiry"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Submit Inquiry — primary action */}
                      <button
                        onClick={() => setShowForm(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-[#A89070] transition-all shadow-lg shadow-accent/20"
                      >
                        <Send className="w-4 h-4" />
                        {t("cart.submitInquiry") || "Submit Inquiry"}
                      </button>



                      {/* Clear */}
                      <button
                        onClick={clearCart}
                        className="w-full text-center text-xs text-text-muted dark:text-white/30 hover:text-red-400 transition-colors py-1"
                      >
                        {t("cart.clearAll")}
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
