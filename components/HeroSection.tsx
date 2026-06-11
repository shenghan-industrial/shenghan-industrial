"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { IconChevronLeft, IconChevronRight, IconArrowRight } from "@/components/icons";
import Link from "next/link";
import { useT } from "@/lib/LanguageContext";

export function HeroSection() {
  const { t } = useT();
  const slides = [
    { image: "/images/factory-bg.svg" },
    { image: "/images/factory/factory-line.svg" },
    { image: "/images/quality/testing-rig.svg" },
    { image: "/images/factory/r-and-d-center.svg" },
  ];
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(next, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  const resume = () => {
    intervalRef.current = setInterval(next, 6000);
  };

  const slide = slides[current];

  return (
    <section
      ref={ref}
      className="relative h-[85vh] min-h-[480px] md:min-h-[560px] overflow-hidden group"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Background image carousel */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ x: direction * 100 + "%", scale: 1.1 }}
          animate={{ x: "0%", scale: 1 }}
          exit={{ x: direction * -30 + "%", opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 -top-[15%] h-[130%]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-900/40 via-brand-900/30 to-brand-900/60" />

      {/* Fixed text overlay — stays while images rotate */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center max-w-3xl px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-accent text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-4"
          >
            {t("hero.slide1.tagline")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
          >
            {t("hero.overlay.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-white/60 text-sm md:text-lg max-w-xl mx-auto mb-8"
          >
            {t("hero.overlay.sub")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-brand-900 font-semibold text-sm hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
            >
              {t("hero.overlay.explore")}
              <IconArrowRight />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              {t("hero.overlay.consult")}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Left/Right Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <IconChevronLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <IconChevronRight />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 rounded-full ${
              i === current
                ? "w-8 h-2 bg-accent"
                : "w-2 h-2 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
