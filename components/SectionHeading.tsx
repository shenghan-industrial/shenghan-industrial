"use client";

import { ScrollReveal } from "./ScrollReveal";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  light?: boolean;
}

export function SectionHeading({
  label,
  title,
  description,
  light,
}: SectionHeadingProps) {
  return (
    <ScrollReveal>
      <div className="text-center max-w-3xl mx-auto">
        {label && (
          <>
            <span
              className={`inline-block text-[11px] tracking-[0.22em] uppercase font-semibold mb-4 px-4 py-1.5 rounded-full ${
                light
                  ? "bg-white/10 text-white/70 backdrop-blur-sm border border-white/10"
                  : "bg-accent/8 text-accent-dark border border-accent/15"
              }`}
            >
              {label}
            </span>
          </>
        )}
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.15] mb-5 ${
            light ? "text-white" : "text-brand-800 dark:text-white"
          }`}
        >
          {title}
        </h2>
        {/* Gold divider */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-px bg-accent/30" />
          <div className="w-1 h-1 rounded-full bg-accent/50" />
          <div className="w-8 h-px bg-accent/30" />
        </div>
        {description && (
          <p
            className={`text-base md:text-lg leading-relaxed max-w-2xl mx-auto ${
              light ? "text-white/55" : "text-text-secondary dark:text-white/40"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
