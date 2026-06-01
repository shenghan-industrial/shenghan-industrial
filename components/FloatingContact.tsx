"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Mail } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { siteConfig } from "@/data/site-config";

export function FloatingContact() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const { contact } = siteConfig;

  const items = [
    {
      icon: Phone,
      label: t("contact.phone") || "电话",
      href: contact.phone.href,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: Mail,
      label: t("contact.email") || "邮箱",
      href: `mailto:${contact.email}`,
      color: "bg-blue-500 hover:bg-blue-600",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="flex flex-col gap-3 mb-2"
          >
            {items.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg transition-colors ${item.color}`}
              >
                <span>{item.label}</span>
                <item.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
          open
            ? "bg-white text-brand-800 rotate-90 hover:bg-gray-100"
            : "bg-accent text-white hover:bg-accent-light hover:scale-110"
        }`}
        aria-label={open ? "关闭客服" : "在线客服"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
