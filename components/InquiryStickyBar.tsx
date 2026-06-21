"use client";

import { ShoppingCart, Send, MessageCircle, Factory, ShieldCheck, Clock } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { siteConfig } from "@/data/site-config";

interface InquiryStickyBarProps {
  onAddToCart: () => void;
  onInquire: () => void;
  isAdded: boolean;
}

const whatsappHref = siteConfig.contact.phone.href;

export function InquiryStickyBar({ onAddToCart, onInquire, isAdded }: InquiryStickyBarProps) {
  const { t } = useT();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1A1816] border-t border-gray-200 dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden">
      <div className="flex items-center justify-center gap-4 px-4 pt-2 pb-1 text-[10px] text-[#9B8E7E] dark:text-white/30">
        <span className="flex items-center gap-1"><Factory className="w-3 h-3 text-[#B8A080]" /> {t("detail.trustFactory")}</span>
        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#B8A080]" /> {t("detail.trustISO")}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#B8A080]" /> {t("detail.trustResponse")}</span>
      </div>
      <div className="flex items-center gap-2 px-3 pb-3 pt-1">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
          className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors" aria-label={t("detail.whatsappLabel")}>
          <MessageCircle className="w-5 h-5" />
        </a>
        <button onClick={onAddToCart}
          className={`flex-1 h-10 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${isAdded ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-white/5 text-[#3D3730] dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"}`}>
          <ShoppingCart className="w-4 h-4" />{isAdded ? t("detail.added") : t("detail.addToCart")}
        </button>
        <button onClick={onInquire}
          className="flex-[2] h-10 rounded-xl bg-[#B8A080] text-white text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-[#A89070] transition-colors">
          <Send className="w-4 h-4" />{t("detail.requestQuote")}
        </button>
      </div>
    </div>
  );
}
