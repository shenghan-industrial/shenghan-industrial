"use client";

import { useState, useEffect } from "react";
import { Clock, DollarSign } from "lucide-react";
import { useT } from "@/lib/LanguageContext";

const TIMEZONES = [
  { tz: "America/New_York", labels: { en: "New York", zh: "纽约", es: "Nueva York" } },
  { tz: "Europe/London", labels: { en: "London", zh: "伦敦", es: "Londres" } },
  { tz: "Europe/Paris", labels: { en: "Paris", zh: "巴黎", es: "París" } },
  { tz: "Europe/Moscow", labels: { en: "Moscow", zh: "莫斯科", es: "Moscú" } },
  { tz: "Asia/Dubai", labels: { en: "Dubai", zh: "迪拜", es: "Dubái" } },
  { tz: "Asia/Shanghai", labels: { en: "Beijing", zh: "北京", es: "Pekín" } },
  { tz: "Asia/Bangkok", labels: { en: "Bangkok", zh: "曼谷", es: "Bangkok" } },
  { tz: "Asia/Tokyo", labels: { en: "Tokyo", zh: "东京", es: "Tokio" } },
];

const CURRENCIES = [
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "Pound" },
  { code: "AED", label: "Dirham" },
  { code: "SAR", label: "Riyal" },
  { code: "CNY", label: "Yuan" },
  { code: "THB", label: "Baht" },
  { code: "RUB", label: "Ruble" },
  { code: "JPY", label: "Yen" },
  { code: "KRW", label: "Won" },
];

interface Rates { [key: string]: number }

function useWorldClocks(locale: string) {
  const [times, setTimes] = useState<{ label: string; time: string }[]>([]);
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimes(TIMEZONES.map(({ labels, tz }) => ({
        label: labels[locale as keyof typeof labels] || labels.en,
        time: now.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }),
      })));
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [locale]);
  return times;
}

function useRates() {
  const [rates, setRates] = useState<Rates>({});
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((d) => {
        if (d?.rates) {
          const f: Rates = {};
          CURRENCIES.forEach((c) => { if (d.rates[c.code]) f[c.code] = d.rates[c.code]; });
          setRates(f);
        }
      })
      .catch(() => {});
  }, []);
  return rates;
}

export function GlobalInfoBar() {
  const { locale } = useT();
  const times = useWorldClocks(locale);
  const rates = useRates();
  const fallback: Rates = { EUR: 0.92, GBP: 0.79, AED: 3.67, SAR: 3.75, CNY: 7.25, THB: 36.5, RUB: 91.5, JPY: 154, KRW: 1350 };
  const r = Object.keys(rates).length > 0 ? rates : fallback;
  const fmt = (v: number) => v >= 50 ? Math.round(v).toLocaleString() : v.toFixed(2);

  const labels: Record<string, Record<string, string>> = {
    worldTime: { en: "World Time", zh: "世界时间", es: "Hora Mundial" },
    exchangeRate: { en: "Exchange Rate", zh: "实时汇率", es: "Tipo de Cambio" },
    equals: { en: "1 USD =", zh: "1 美元 =", es: "1 USD =" },
  };

  const currencyNames: Record<string, Record<string, string>> = {
    EUR: { en: "Euro", zh: "欧元", es: "Euro" },
    GBP: { en: "Pound", zh: "英镑", es: "Libra" },
    AED: { en: "Dirham", zh: "迪拉姆", es: "Dirham" },
    SAR: { en: "Riyal", zh: "里亚尔", es: "Riyal" },
    CNY: { en: "Yuan", zh: "人民币", es: "Yuan" },
    THB: { en: "Baht", zh: "泰铢", es: "Baht" },
    RUB: { en: "Ruble", zh: "卢布", es: "Rublo" },
    JPY: { en: "Yen", zh: "日元", es: "Yen" },
    KRW: { en: "Won", zh: "韩元", es: "Won" },
  };

  return (
    <div className="bg-[#2E2A26] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-7 gap-y-2.5 mb-3">
          <span className="text-[10px] md:text-sm text-[#B8A080] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3 h-3 md:w-4 md:h-4" />
            {labels.worldTime[locale] || labels.worldTime.en}
          </span>
          {times.map((t) => (
            <span key={t.label} className="text-[13px] md:text-base text-white/70 whitespace-nowrap">
              <span className="text-white font-bold">{t.time}</span>
              {" "}<span className="hidden sm:inline">{t.label}</span><span className="sm:hidden text-[10px]">{t.label.split(' ').map(w=>w[0]).join('')}</span>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-7 gap-y-2.5">
          <span className="text-[10px] md:text-sm text-[#B8A080] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
            {labels.exchangeRate[locale] || labels.exchangeRate.en}
          </span>
          <span className="text-white/50 text-[11px] md:text-sm">{labels.equals[locale] || labels.equals.en}</span>
          {CURRENCIES.map((c) => (
            <span key={c.code} className="text-[13px] md:text-base text-white/70 whitespace-nowrap">
              <span className="text-white font-bold">{fmt(r[c.code] || 0)}</span>
              {" "}<span className="text-[11px] md:text-sm">{currencyNames[c.code]?.[locale] || c.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
