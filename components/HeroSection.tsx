"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Award, Shield, Factory } from "lucide-react";
import Link from "next/link";
import { useT } from "@/lib/LanguageContext";

export function HeroSection() {
  const { t } = useT();

  const slides = [
    {
      image: "/images/factory-bg.svg",
      tagline: t("hero.slide1.tagline"),
      title: t("hero.slide1.title"),
      accent: t("hero.slide1.accent"),
      desc: t("hero.slide1.desc"),
    },
    {
      image: "/images/factory/factory-line.svg",
      tagline: t("hero.slide2.tagline"),
      title: t("hero.slide2.title"),
      accent: t("hero.slide2.accent"),
      desc: t("hero.slide2.desc"),
    },
    {
      image: "/images/quality/testing-rig.svg",
      tagline: t("hero.slide3.tagline"),
      title: t("hero.slide3.title"),
      accent: t("hero.slide3.accent"),
      desc: t("hero.slide3.desc"),
    },
    {
      image: "/images/factory/r-and-d-center.svg",
      tagline: t("hero.slide4.tagline"),
      title: t("hero.slide4.title"),
      accent: t("hero.slide4.accent"),
      desc: t("hero.slide4.desc"),
    },
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
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

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

  // Auto-advance
  useEffect(() => {
    intervalRef.current = setInterval(next, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  // Pause on hover
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
      className="relative h-svh min-h-[600px] md:min-h-[700px] overflow-hidden group"
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
      <div className="absolute inset-0 bg-gradient-to-b from-brand-900/70 via-brand-900/55 to-brand-900/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.1),transparent_50%)]" />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-col items-center"
          >
            <span className="inline-block text-xs tracking-[0.3em] uppercase text-accent font-semibold mb-6 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm">
              {slide.tagline}
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[1.05] max-w-5xl">
              {slide.title}
              <br />
              <span className="text-accent">{slide.accent}</span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed">
              {slide.desc}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/products"
                className="group flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-brand-900 font-semibold text-base hover:bg-accent-light transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
              >
                {t("hero.explore")}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-base hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                {t("hero.touch")}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stats (always visible) */}
        <div className="mt-20 md:mt-24 grid grid-cols-3 gap-8 md:gap-16">
          {[
            { icon: Award, value: "25+", label: t("hero.stats.cert") },
            { icon: Shield, value: "3,200+", label: t("hero.stats.projects") },
            { icon: Factory, value: "50K tons", label: t("hero.stats.capacity") },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <item.icon className="w-5 h-5 text-accent/60" />
              <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {item.value}
              </span>
              <span className="text-xs text-white/40">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Left/Right Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Slide Indicators (dots) */}
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

      {/* Scroll-down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.a
          href="#products"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/25 hover:text-accent transition-colors cursor-pointer"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.a>
      </motion.div>
    </section>
  );
}
