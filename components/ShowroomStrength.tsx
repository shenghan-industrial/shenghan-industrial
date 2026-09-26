"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/LanguageContext";
import siteContent from "@/data/site-content.json";

export function ShowroomStrength() {
  const { locale } = useT();
  const s = siteContent.showroom;

  const title = locale === "zh" ? s.titleZh : locale === "es" ? s.titleEs : s.title;
  const subtitle = locale === "zh" ? s.subtitleZh : locale === "es" ? s.subtitleEs : s.subtitle;
  const label = locale === "zh" ? s.sectionLabelZh : locale === "es" ? s.sectionLabelEs : s.sectionLabel;

  return (
    <section className="py-12 md:py-20 bg-[#F5F2EF] dark:bg-[#12100E] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="aspect-[4/5] rounded-2xl overflow-hidden"
              >
                <img
                  src="/images/showroom/showroom-aisles.png"
                  alt="8000㎡ showroom"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex flex-col gap-3 md:gap-4"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="/images/warehouse/warehouse.png"
                    alt="integrated warehouse"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="/images/showroom/showroom-lobby.png"
                    alt="showroom lobby"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right: content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:pl-6"
          >
            <span className="text-xs text-[#B8A080] font-semibold uppercase tracking-[0.15em]">
              {label}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#3D3730] dark:text-[#D4C8B8] mt-2 tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-sm md:text-base text-[#9B8E7E] dark:text-white/30 mt-4 leading-relaxed">
              {subtitle}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {s.stats.map((stat) => {
                const l =
                  locale === "zh" ? stat.labelZh : locale === "es" ? stat.labelEs : stat.label;
                return (
                  <div
                    key={stat.label}
                    className="p-4 rounded-xl bg-white dark:bg-[#1A1816] border border-[#E8E2DC] dark:border-white/5"
                  >
                    <div className="text-xl md:text-2xl font-bold text-[#3D3730] dark:text-[#D4C8B8]">
                      {stat.value}
                    </div>
                    <div className="text-[10px] md:text-xs text-[#9B8E7E] dark:text-white/30 mt-1">
                      {l}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
