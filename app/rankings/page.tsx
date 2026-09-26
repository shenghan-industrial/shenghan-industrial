"use client";

export const runtime = "edge";

import { useMemo } from "react";
import Link from "next/link";
import { Flame, TrendingUp, ChevronRight } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import { useProducts } from "@/lib/use-products";

/** /rankings index — builds the ranking board directly from real products
 *  (category + subCategory), because most categories have no configured children. */
export default function RankingsIndexPage() {
  const { t } = useT();
  const { products, loaded } = useProducts();

  const grouped = useMemo(() => {
    const map = new Map<string, Map<string, number>>();
    for (const p of products) {
      const cat = p.category || "Others";
      const sub = p.subCategory || cat;
      if (!map.has(cat)) map.set(cat, new Map());
      const subs = map.get(cat)!;
      subs.set(sub, (subs.get(sub) || 0) + 1);
    }
    return [...map.entries()]
      .map(([cat, subs]) => ({
        cat,
        total: [...subs.values()].reduce((a, b) => a + b, 0),
        subs: [...subs.entries()].sort((a, b) => b[1] - a[1]),
      }))
      .sort((a, b) => b.total - a.total);
  }, [products]);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#B8A080] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#4A4238] via-[#5C554D] to-[#3D3730] pt-[56px] pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-6 right-16 w-32 h-32 bg-white rounded-3xl rotate-12" />
          <div className="absolute bottom-4 left-10 w-24 h-24 bg-white rounded-full" />
          <div className="absolute top-10 left-1/3 w-12 h-12 bg-white/40 rounded-xl -rotate-12" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-[10px] text-[#B8A080] font-semibold uppercase tracking-[0.25em] mb-3">
            {t("nav.rankings")}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            {t("rankings.suffix")}
          </h1>
          <p className="text-white/50 text-sm mt-3">{t("home.rankedBy7Days")}</p>
        </div>
      </section>

      {/* Category boards */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-14">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-4 h-4 text-[#B8A080]" />
          <h2 className="text-[15px] font-semibold text-[#3D3730] dark:text-[#D4C8B8]">
            {t("rankings.hotSales")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {grouped.map(({ cat, total, subs }) => (
            <div
              key={cat}
              className="bg-white dark:bg-[#1A1816] rounded-2xl border border-[#E8E2DC] dark:border-white/5 p-5 hover:shadow-[0_10px_36px_rgba(61,55,48,0.09)] hover:border-[#B8A080]/35 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-[16px] font-bold text-[#3D3730] dark:text-[#D4C8B8] leading-snug">
                  {cat}
                </h3>
                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F5F2EF] dark:bg-white/5 text-[11px] font-semibold text-[#B8A080]">
                  <TrendingUp className="w-3 h-3" />
                  {total}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {subs.slice(0, 6).map(([sub, count]) => (
                  <Link
                    key={sub}
                    href={`/rankings/${encodeURIComponent(cat)}/${encodeURIComponent(sub)}`}
                    className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 text-[12.5px] text-[#7B7068] dark:text-white/45 hover:border-[#B8A080]/40 hover:text-[#B8A080] transition-all"
                  >
                    {sub}
                    <span className="text-[10.5px] text-[#B8A080]/70">{count}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {grouped.length === 0 && (
          <div className="text-center py-20 text-[#9B8E7E] dark:text-white/30">
            <p className="text-sm">{t("home.noProducts")}</p>
          </div>
        )}
      </section>
    </main>
  );
}
