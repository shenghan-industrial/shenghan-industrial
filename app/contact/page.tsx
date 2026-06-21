"use client";
import { useT } from "@/lib/LanguageContext";

import { SectionHeading } from "@/components/SectionHeading";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ContactForm } from "@/components/ContactForm";
import { SocialIcons } from "@/components/SocialIcons";
import { siteConfig } from "@/data/site-config";
import { Phone, Mail, MapPin, Clock, HelpCircle } from "lucide-react";
import { faqSchema, JsonLD } from "@/lib/schema-org";

const { contact } = siteConfig;

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export default function ContactPage() {
  const { t, locale } = useT();

  const contactInfo = [
    {
      icon: Phone,
      title: t("contact.call"),
      lines: [contact.phone.display],
      description: locale === "zh" ? ((contact.hours as Record<string, string>).weekdayZh || contact.hours.weekday) : locale === "es" ? ((contact.hours as Record<string, string>).weekdayEs || contact.hours.weekday) : contact.hours.weekday,
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
      lines: [
        locale === "zh" ? contact.address.line1Zh || contact.address.line1 : locale === "es" ? contact.address.line1Es || contact.address.line1 : contact.address.line1,
        locale === "zh" ? contact.address.line2Zh || contact.address.line2 : locale === "es" ? contact.address.line2Es || contact.address.line2 : contact.address.line2,
      ],
      description: t("contact.appointment"),
    },
    {
      icon: Clock,
      title: t("contact.hours"),
      lines: [
        locale === "zh" ? ((contact.hours as Record<string, string>).weekdayZh || contact.hours.weekday) : locale === "es" ? ((contact.hours as Record<string, string>).weekdayEs || contact.hours.weekday) : contact.hours.weekday,
        contact.hours.saturday,
      ],
      description: locale === "zh" ? ((contact.hours as Record<string, string>).noteZh || contact.hours.note) : locale === "es" ? ((contact.hours as Record<string, string>).noteEs || contact.hours.note) : contact.hours.note,
    },
  ];

  const faqQuestions = FAQ_KEYS.map((key, i) => ({
    question: t(`contact.faq.${key}`),
    answer: t(`contact.faq.a${i + 1}`),
  }));

  return (
    <>
      <JsonLD data={faqSchema(faqQuestions)} />
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

      {/* FAQ Section with Schema.org markup */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-14">
        <SectionHeading
          label={t("contact.faq.label")}
          title={t("contact.faq.title")}
          description={t("contact.faq.desc")}
        />
        <div className="mt-8 max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-white/10">
          {FAQ_KEYS.map((key, i) => (
            <ScrollReveal key={i}>
              <details className="group py-4">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-brand-800 dark:text-white hover:text-[#B8A080] transition-colors">
                  {t(`contact.faq.${key}`)}
                  <HelpCircle className="w-4 h-4 text-[#B8A080] shrink-0 ml-2 group-open:hidden" />
                </summary>
                <p className="mt-3 text-sm text-text-secondary dark:text-white/40 leading-relaxed">
                  {t(`contact.faq.a${i + 1}`)}
                </p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
