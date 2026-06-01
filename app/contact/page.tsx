"use client";
import { useT } from "@/lib/LanguageContext";

import { SectionHeading } from "@/components/SectionHeading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ContactForm } from "@/components/ContactForm";
import { SocialIcons } from "@/components/SocialIcons";
import { siteConfig } from "@/data/site-config";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const { contact } = siteConfig;

export default function ContactPage() {
  const { t } = useT();

  const contactInfo = [
    {
      icon: Phone,
      title: t("contact.call"),
      lines: [contact.phone.display],
      description: contact.hours.weekday,
    },
    {
      icon: Mail,
      title: t("contact.email"),
      lines: [contact.email],
      description: t("contact.respond"),
    },
    {
      icon: MapPin,
      title: t("contact.visit"),
      lines: [contact.address.line1, contact.address.line2],
      description: t("contact.appointment"),
    },
    {
      icon: Clock,
      title: t("contact.hours"),
      lines: [contact.hours.weekday, contact.hours.saturday],
      description: contact.hours.note,
    },
  ];

  return (
    <>
      <section className="pt-24 md:pt-32 pb-16 md:pb-20 bg-gradient-to-br from-brand-800 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.1),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            label={t("contact.label")}
            title={t("contact.title")}
            description={t("contact.desc")}
            light
          />
        </div>
      </section>

      <section className="py-14 md:py-28 bg-white dark:bg-brand-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactInfo.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="p-6 rounded-2xl bg-bg-warm dark:bg-brand-800/40 border border-gray-100 dark:border-white/5 hover:shadow-xl hover:border-accent/20 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-brand-800 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  {item.lines.map((line) => (
                    <p key={line} className="text-sm text-text-secondary dark:text-white/50">
                      {line}
                    </p>
                  ))}
                  <p className="text-xs text-text-muted dark:text-white/30 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <ScrollReveal>
              <div>
                <h3 className="text-xs tracking-[0.25em] uppercase font-semibold text-accent-dark mb-3">
                  {t("contact.connectLabel")}
                </h3>
                <h2 className="text-3xl font-bold text-brand-800 dark:text-white tracking-tight mb-4">
                  {t("contact.connectTitle")}
                </h2>
                <p className="text-text-secondary dark:text-white/40 mb-8">
                  {t("contact.connectDesc")}
                </p>
                <SocialIcons variant="card" />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left">
              <div className="bg-bg-warm dark:bg-brand-800/40 rounded-2xl border border-gray-100 dark:border-white/5 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-brand-800 dark:text-white mb-6">
                  {t("contact.formTitle")}
                </h3>
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
