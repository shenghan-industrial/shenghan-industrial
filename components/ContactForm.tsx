"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, User, Phone, Mail, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { TurnstileWidget } from "@/components/TurnstileWidget";

export function ContactForm() {
  const { t } = useT();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [resetKey, setResetKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSending(true);

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      turnstileToken,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send message.");
      setSent(true);
      setResetKey((k) => k + 1); // reset Turnstile
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setResetKey((k) => k + 1); // reset Turnstile on error
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
          <Send className="w-7 h-7 text-accent" />
        </div>
        <h3 className="text-xl font-bold text-brand-800 dark:text-white mb-2">{t("form.thanks")}</h3>
        <p className="text-text-secondary dark:text-white/40">{t("form.reply")}</p>
        <button onClick={() => setSent(false)} className="mt-6 text-sm text-accent hover:text-accent-dark transition-colors">{t("form.again")}</button>
      </motion.div>
    );
  }

  const inputClass = "w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-brand-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-300 placeholder:text-text-muted";

  return (
    <motion.form ref={formRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
      {error && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><p>{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" name="name" required placeholder={t("form.name")} className={inputClass} />
        </div>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="tel" name="phone" required placeholder={t("form.phone")} className={inputClass} />
        </div>
      </div>

      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="email" name="email" required placeholder={t("form.email")} className={inputClass} />
      </div>

      <div className="relative">
        <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-text-muted" />
        <textarea name="message" required rows={4} placeholder={t("form.message")} className={`${inputClass} resize-none`} />
      </div>

      <TurnstileWidget onToken={setTurnstileToken} resetKey={resetKey} />

      <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent text-brand-900 font-semibold text-sm hover:bg-accent-light disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-accent/20">
        {sending ? <><Loader2 className="w-4 h-4 animate-spin" />{t("form.sending")}</> : <><Send className="w-4 h-4" />{t("form.submit")}</>}
      </button>
    </motion.form>
  );
}
