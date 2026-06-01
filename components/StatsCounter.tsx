"use client";

import { useRef, useState, useEffect } from "react";
import { useT } from "@/lib/LanguageContext";
import { motion, useInView } from "framer-motion";
import {
  Factory,
  Building2,
  Users,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

interface Stat {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
}

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setCurrent(value);
        clearInterval(timer);
      } else {
        setCurrent(Math.round(stepValue * step));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {current}
      {suffix}
    </span>
  );
}

export function StatsCounter() {
  const { t } = useT();

  const stats: Stat[] = [
    { icon: Factory, value: 50, suffix: t("stats.unit1"), label: t("stats.capacity") },
    { icon: Building2, value: 3200, suffix: "+", label: t("stats.projects") },
    { icon: Users, value: 500, suffix: "+", label: t("stats.clients") },
    { icon: ShieldCheck, value: 25, suffix: t("stats.unit4"), label: t("stats.experience") },
  ];

  return (
    <section className="py-14 md:py-28 bg-white dark:bg-brand-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center p-4 md:p-8 rounded-2xl bg-bg-warm dark:bg-brand-800/50 border border-gray-100/80 dark:border-white/5 hover:border-accent/20 dark:hover:border-accent/10 hover:shadow-lg transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                <stat.icon className="w-5 h-5 text-accent" />
              </div>
              <div className="text-3xl md:text-5xl font-bold text-brand-800 dark:text-white tracking-[-0.03em] mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-text-muted dark:text-white/35 tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
