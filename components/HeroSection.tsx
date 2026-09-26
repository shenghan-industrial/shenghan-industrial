"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/lib/LanguageContext";
import siteContent from "@/data/site-content.json";

export function HeroSection() {
  const { t, locale } = useT();
  const hero = siteContent.hero;
  const slides = hero.slides;
  const title = locale === "zh" ? hero.titleZh : locale === "es" ? hero.titleEs : hero.title;
  const subtitle = locale === "zh" ? hero.subtitleZh : locale === "es" ? hero.subtitleEs : hero.subtitle;
  const tagline = locale === "zh" ? hero.taglineZh : locale === "es" ? hero.taglineEs : hero.tagline;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next]);

  const pause = () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  const resume = () => { intervalRef.current = setInterval(next, 5000); };

  const getSlideImage = (slide: typeof slides[0]) => {
    if (locale === "zh") return (slide as { imageZh?: string }).imageZh || slide.image;
    if (locale === "es") return (slide as { imageEs?: string }).imageEs || slide.image;
    return (slide as { imageEn?: string }).imageEn || slide.image;
  };

  return (
    <section className="relative w-full aspect-[1717/916] overflow-hidden bg-[#1E1B18] group" onMouseEnter={pause} onMouseLeave={resume}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={`${current}-${locale}`}
          custom={direction}
          initial={{ x: direction * 100 + "%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: direction * -30 + "%", opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <img
            src={getSlideImage(slides[current])}
            alt="DEXOREN"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Left-to-right gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Content — left aligned, vertically centered */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 w-full">
          <motion.div
            key={`text-${current}-${locale}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xl md:max-w-2xl"
          >
            <span className="inline-block px-3 py-1.5 rounded-full bg-[#C8A14C]/20 border border-[#C8A14C]/30 text-[#C8A14C] text-[10px] md:text-xs font-semibold tracking-wider uppercase mb-3 md:mb-4">
              {tagline}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-tight">
              {title}
            </h1>
            <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg text-white/80 leading-relaxed max-w-xl">
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6 md:mt-8">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3 rounded-xl bg-[#C8A14C] text-white font-bold text-sm hover:bg-[#B8943A] transition-all shadow-lg">
                <Send className="w-4 h-4" />{t("detail.requestQuote")}
              </Link>
              <Link href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3 rounded-xl border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all">
                {t("hero.explore")}<ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100" aria-label="Previous">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100" aria-label="Next">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`transition-all rounded-full ${i === current ? "w-6 h-1.5 bg-[#C8A14C]" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"}`} />
          ))}
        </div>
      )}
    </section>
  );
}
