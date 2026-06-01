"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import { CheckCircle, type LucideIcon } from "lucide-react";

interface ImageTextSectionProps {
  imageSrc: string;
  imageAlt: string;
  imageSide?: "left" | "right";
  label?: string;
  title: string;
  description: string;
  features?: string[];
  badge?: { text: string; Icon: LucideIcon };
  className?: string;
}

export function ImageTextSection({
  imageSrc,
  imageAlt,
  imageSide = "left",
  label,
  title,
  description,
  features = [],
  badge,
  className = "",
}: ImageTextSectionProps) {
  const ImageBlock = (
    <ScrollReveal direction={imageSide === "left" ? "right" : "left"}>
      <div className="relative">
        <div className="aspect-[4/5] md:aspect-[6/5] rounded-2xl overflow-hidden bg-gray-200 dark:bg-brand-800">
          <div
            className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url(${imageSrc})` }}
          />
        </div>
        {badge && (
          <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-accent rounded-2xl p-4 md:p-6 shadow-xl">
            <badge.Icon className="w-6 h-6 md:w-8 md:h-8 text-brand-900" />
            <span className="block mt-1 text-xs md:text-sm font-bold text-brand-900">
              {badge.text}
            </span>
          </div>
        )}
        <div className="absolute -top-4 -left-4 w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-accent/10 dark:bg-accent/5 -z-10" />
        <div className="absolute -bottom-4 -right-4 w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-brand-800/5 dark:bg-white/5 -z-10" />
      </div>
    </ScrollReveal>
  );

  const TextBlock = (
    <ScrollReveal direction={imageSide === "left" ? "left" : "right"}>
      <div className="flex flex-col justify-center h-full">
        {label && (
          <span className="text-xs tracking-[0.25em] uppercase font-semibold text-accent-dark mb-4">
            {label}
          </span>
        )}
        <h2 className="text-2xl md:text-4xl font-bold text-brand-800 dark:text-white tracking-tight leading-tight mb-4 md:mb-6">
          {title}
        </h2>
        <p className="text-text-secondary dark:text-white/50 leading-relaxed mb-8">
          {description}
        </p>
        {features.length > 0 && (
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-text-secondary dark:text-white/50 text-sm">
                  {f}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ScrollReveal>
  );

  return (
    <section className={`py-14 md:py-28 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {imageSide === "left" ? (
            <>
              {ImageBlock}
              {TextBlock}
            </>
          ) : (
            <>
              {TextBlock}
              {ImageBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
