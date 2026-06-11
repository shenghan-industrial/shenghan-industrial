"use client";

import { useT } from "@/lib/LanguageContext";
import { reviews, type Review } from "@/data/reviews";
import { ScrollReveal } from "@/components/ScrollReveal";
import { IconStar } from "@/components/icons";
import { CheckCircle, MessageSquare } from "lucide-react";

const langLabels: Record<string, string> = { zh: "中文", th: "ภาษาไทย", en: "English", es: "Español" };

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "text-[#B8A080]" : "text-gray-200 dark:text-white/8"}><IconStar /></span>
      ))}
    </div>
  );
}

function ReviewCard({ review, t }: { review: Review; t: (k: string) => string }) {
  return (
    <div className="bg-white dark:bg-[#1A1816] rounded-2xl border border-[#E8E2DC] dark:border-white/5 p-5 h-full flex flex-col transition-all duration-300 hover:border-[#D4C8B8] dark:hover:border-white/10 hover:shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#F0EBE6] dark:bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
          <img src={review.avatar} alt={review.customerName} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#3D3730] dark:text-[#D4C8B8] truncate">{review.customerName}</p>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-[#7BA87B] shrink-0" />
            <span className="text-[10px] text-[#7BA87B] font-medium">{t("home.verifiedBuyer")}</span>
          </div>
        </div>
      </div>
      <div className="mb-2"><Stars rating={review.rating} /></div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-[11px] text-[#9B8E7E] dark:text-white/25">{review.customerLocation}</p>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5F2EF] dark:bg-white/5 text-[#9B8E7E] dark:text-white/25">{langLabels[review.lang]}</span>
      </div>
      <p className="text-[13px] text-[#6B6058] dark:text-white/50 leading-relaxed flex-1 line-clamp-5 mb-3">
        {"“"}{review.comment}{"”"}
      </p>
      <div className="pt-2 border-t border-[#F0EBE6] dark:border-white/5">
        <span className="inline-block px-2.5 py-1 rounded-full bg-[#F5F2EF] dark:bg-white/5 text-[#7B7068] dark:text-white/35 text-[11px] font-medium">
          {review.productName}
        </span>
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const { t, locale } = useT();

  return (
    <section className="py-12 md:py-20 bg-[#F5F2EF] dark:bg-[#12100E]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="mb-10">
          <span className="text-xs text-[#B8A080] font-semibold uppercase tracking-[0.15em]">
            {locale === "zh" ? "真实反馈" : locale === "es" ? "Opiniones Reales" : "Real Feedback"}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#3D3730] dark:text-[#D4C8B8] mt-1.5 tracking-tight">
            {locale === "zh" ? "客户真实评价" : locale === "es" ? "Lo Que Dicen Nuestros Clientes" : "What Our Customers Say"}
          </h2>
          <p className="text-sm text-[#9B8E7E] dark:text-white/30 mt-1.5">
            {locale === "zh" ? "来自全球客户的真实使用体验" : locale === "es" ? "Experiencias reales de clientes globales" : "Real experiences from our global customers"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {reviews.map((review) => (
            <ScrollReveal key={review.id}>
              <ReviewCard review={review} t={t} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
