"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { useT } from "@/lib/LanguageContext";

export function CookieConsent() {
  const { t } = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem("cookie-consent");
    if (!consented) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[60]"
        >
          <div className="bg-white dark:bg-brand-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-5 pr-10 backdrop-blur-xl">
            <button
              onClick={accept}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-brand-800 dark:text-white">
                  {t("cookie.title")}
                </h4>
                <p className="text-xs text-text-muted dark:text-white/40 mt-1 leading-relaxed">
                  {t("cookie.desc")}{" "}
                  <Link
                    href="/privacy"
                    className="text-accent-dark hover:text-accent underline underline-offset-2"
                  >
                    {t("cookie.learn")}
                  </Link>
                </p>
              </div>
            </div>

            <button
              onClick={accept}
              className="w-full py-2.5 rounded-lg bg-brand-800 dark:bg-brand-700 text-white text-sm font-medium hover:bg-brand-700 dark:hover:bg-brand-600 transition-colors duration-300"
            >
              {t("cookie.accept")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
