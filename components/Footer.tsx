"use client";

import Link from "next/link";
import { IconWhatsApp, IconMail, IconMapPin } from "@/components/icons";
import { SocialIcons } from "./SocialIcons";
import { useT } from "@/lib/LanguageContext";
import { siteConfig } from "@/data/site-config";

export function Footer() {
  const { t, locale } = useT();
  const { brand, contact } = siteConfig;

  const productLinks = [
    { label: t("footer.productsList.furniture"), href: "/products" },
    { label: t("footer.productsList.buildingMaterials"), href: "/products" },
    { label: t("footer.productsList.hardware"), href: "/products" },
    { label: t("footer.productsList.appliances"), href: "/products" },
    { label: t("footer.productsList.lighting"), href: "/products" },
    { label: t("footer.productsList.others"), href: "/products" },
  ];

  const companyLinks = [
    { label: t("footer.companyList.about"), href: "/about" },
    { label: t("footer.companyList.certs"), href: "/about" },
    { label: t("footer.companyList.contact"), href: "/contact" },
  ];

  const legalLinks = [
    { label: t("footer.privacy"), href: "/privacy" },
    { label: t("footer.terms"), href: "/terms" },
  ];

  return (
    <footer className="bg-brand-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }}
      />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent/60" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="py-20 md:py-28 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-10 lg:gap-14">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-primary-900 font-bold text-xs">{brand.logo.text}</div>
              <span className="text-lg font-bold tracking-tight text-white">{brand.name}</span>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed mb-8 max-w-xs">{locale === "zh" ? siteConfig.footer.taglineZh || siteConfig.footer.tagline : locale === "es" ? siteConfig.footer.taglineEs || siteConfig.footer.tagline : siteConfig.footer.tagline}</p>
            <div className="flex items-center gap-3"><SocialIcons /></div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/25 mb-6">{t("footer.products")}</h4>
            <ul className="space-y-3.5">
              {productLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-white/45 hover:text-accent transition-colors duration-300 text-sm tracking-wide">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/25 mb-6">{t("footer.company")}</h4>
            <ul className="space-y-3.5">
              {companyLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-white/45 hover:text-accent transition-colors duration-300 text-sm tracking-wide">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/25 mb-6">{t("footer.contact")}</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors duration-300"><IconWhatsApp /></div>
                <div><p className="text-white/55 text-sm">{contact.phone.display}</p><p className="text-white/25 text-xs mt-0.5">{locale === "zh" ? contact.hours.weekdayZh || contact.hours.weekday : locale === "es" ? contact.hours.weekdayEs || contact.hours.weekday : contact.hours.weekday}</p></div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors duration-300"><IconMail /></div>
                <p className="text-white/55 text-sm pt-1">{contact.email}</p>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors duration-300"><IconMapPin /></div>
                <div className="pt-1"><p className="text-white/55 text-sm">{locale === "zh" ? contact.address.line1Zh || contact.address.line1 : locale === "es" ? contact.address.line1Es || contact.address.line1 : contact.address.line1}</p><p className="text-white/25 text-xs mt-0.5">{locale === "zh" ? contact.address.line2Zh || contact.address.line2 : locale === "es" ? contact.address.line2Es || contact.address.line2 : contact.address.line2}</p><p className="text-white/20 text-[10px] mt-0.5">{contact.address.line3}</p></div>
              </li>
            </ul>
          </div>
        </div>

        {/* Help row (IKEA-style) */}
        <div className="border-t border-white/5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
              <span className="text-accent"><IconWhatsApp /></span>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider">
                {t("footer.needHelp")}
              </p>
              <p className="text-white font-semibold text-sm">{contact.phone.display}</p>
            </div>
          </div>
          <p className="text-white/25 text-xs">
            {contact.hours.weekday}
          </p>
        </div>

        <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs tracking-wide">&copy; {new Date().getFullYear()} {brand.name}. {t("footer.rights")}</p>
          <div className="flex items-center gap-8">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-white/20 text-xs hover:text-white/40 transition-colors duration-300">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
