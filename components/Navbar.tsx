"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCart, IconMenu, IconClose, IconChevronDown } from "@/components/icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useT } from "@/lib/LanguageContext";
import { useInquiryCart } from "@/lib/InquiryContext";
import { siteConfig } from "@/data/site-config";
import { categories } from "@/data/categories";
import { localizeCategoryName, type Locale } from "@/lib/localizeProduct";

interface NavItem {
  key: string;
  label: string;
  href: string;
  mega?: boolean;
}

export function Navbar() {
  const { t, locale } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const { totalItems, setCartOpen } = useInquiryCart();
  const pathname = usePathname();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => { closeMobile(); setMegaOpen(false); }, [pathname, closeMobile]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { closeMobile(); setMegaOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMobile]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const { brand } = siteConfig;

  const navItems: NavItem[] = [
    { key: "home", label: t("nav.home"), href: "/" },
    { key: "products", label: t("nav.products"), href: "/products", mega: true },
    { key: "services", label: t("nav.services"), href: "/services" },
    { key: "newArrivals", label: t("nav.newArrivals"), href: "/new-arrivals" },
    { key: "flashDeals", label: t("nav.flashDeals"), href: "/flash-deals" },
    { key: "promotions", label: t("nav.promotions"), href: "/promotions" },
    { key: "rankings", label: t("nav.rankings"), href: "/rankings" },
    { key: "certifications", label: t("nav.certifications"), href: "/certifications" },
    { key: "tradeTerms", label: t("nav.tradeTerms"), href: "/trade-terms" },
    { key: "faq", label: t("nav.faq"), href: "/faq" },
    { key: "about", label: t("nav.about"), href: "/about" },
    { key: "contact", label: t("nav.contact"), href: "/contact" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Top brand bar */}
      <div className="bg-[#3D3730] text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <span className="text-sm font-bold tracking-wide text-white">{brand.name}</span>
            <span className="hidden sm:inline text-[10px] text-white/25 tracking-wider" suppressHydrationWarning>{locale === "zh" ? brand.sloganZh || brand.slogan : locale === "es" ? brand.sloganEs || brand.slogan : brand.slogan}</span>
          </Link>
        </div>
      </div>

      {/* Navigation bar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? "bg-white/95 dark:bg-[#1A1816]/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]"
            : "bg-[#F5F2EF]/90 dark:bg-[#12100E]/90 backdrop-blur-sm"
        } border-b border-[#E8E2DC] dark:border-white/5`}
      >
        <nav className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-[52px]">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-3">
            <Link href="/" className="text-sm font-bold text-[#3D3730] dark:text-[#D4C8B8] tracking-tight">
              {brand.name}
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              if (item.mega) {
                return (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={`relative flex items-center gap-1 px-3 py-[13px] text-[13px] font-medium tracking-wide transition-all duration-300 rounded-lg ${
                        isActive(item.href)
                          ? "text-[#3D3730] dark:text-white bg-[#E8E2DC]/60 dark:bg-white/10"
                          : "text-[#7B7068] dark:text-white/40 hover:text-[#3D3730] dark:hover:text-white hover:bg-[#E8E2DC]/30 dark:hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                      <IconChevronDown size={14} className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
                    </Link>
                    <AnimatePresence>
                      {megaOpen && (
                        <div className="absolute left-0 top-full pt-2">
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.15 }}
                            className="w-[740px] max-w-[90vw] bg-white dark:bg-[#1A1816] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-6"
                          >
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-white/5">
                              <span className="text-xs font-semibold uppercase tracking-wider text-[#7B7068] dark:text-white/40">{t("nav.productCategories")}</span>
                              <Link
                                href="/products"
                                onClick={() => setMegaOpen(false)}
                                className="text-xs font-medium text-[#B8A080] hover:underline"
                              >
                                {t("common.viewAll")}
                              </Link>
                            </div>
                            <div className="grid grid-cols-3 gap-x-5 gap-y-0.5">
                              {categories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/products?cat=${encodeURIComponent(cat.productCategory)}`}
                                  onClick={() => setMegaOpen(false)}
                                  className="flex items-center px-3 py-2 rounded-lg text-sm text-[#3D3730] dark:text-white/70 hover:bg-[#E8E2DC]/60 dark:hover:bg-white/5 hover:text-[#B8A080] transition-colors font-medium"
                                >
                                  {localizeCategoryName(cat, locale as Locale)}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`relative px-3 py-[13px] text-[13px] font-medium tracking-wide transition-all duration-300 rounded-lg ${
                    isActive(item.href)
                      ? "text-[#3D3730] dark:text-white bg-[#E8E2DC]/60 dark:bg-white/10"
                      : "text-[#7B7068] dark:text-white/40 hover:text-[#3D3730] dark:hover:text-white hover:bg-[#E8E2DC]/30 dark:hover:bg-white/5"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-[#B8A080]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg text-[#7B7068] dark:text-white/40 hover:text-[#3D3730] dark:hover:text-white hover:bg-[#E8E2DC]/40 dark:hover:bg-white/5 transition-all"
              aria-label="Inquiry cart"
            >
              <IconCart />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-[#B8A080] text-[#3D3730] text-[10px] font-bold flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-lg text-[#7B7068] dark:text-white/40 hover:text-[#3D3730] dark:hover:text-white hover:bg-[#E8E2DC]/40 dark:hover:bg-white/5 transition-all"
            >
              {mobileOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-[#3D3730]/98 dark:bg-black/98 backdrop-blur-xl" onClick={closeMobile} />
            <motion.nav initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative flex flex-col items-center justify-center h-full gap-4 overflow-y-auto py-16">
              {navItems.map((item, i) => {
                if (item.mega) {
                  return (
                    <motion.div key={item.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="w-full max-w-xs">
                      <button
                        onClick={() => setMobileProductsOpen((o) => !o)}
                        className="w-full flex items-center justify-center gap-1.5 text-xl font-semibold text-white/80 hover:text-white transition-colors"
                      >
                        {item.label}
                        <IconChevronDown size={16} className={`transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {mobileProductsOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-2">
                            <div className="grid grid-cols-2 gap-1 px-2">
                              {categories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/products?cat=${encodeURIComponent(cat.productCategory)}`}
                                  onClick={closeMobile}
                                  className="px-3 py-2 text-sm text-white/55 hover:text-white rounded-lg hover:bg-white/5 transition-colors text-center"
                                >
                                  {localizeCategoryName(cat, locale as Locale)}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }
                return (
                  <motion.div key={item.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                    <Link href={item.href} onClick={closeMobile} className="text-xl font-semibold text-white/80 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-32 h-px bg-white/10" />
              <motion.button
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                onClick={() => { closeMobile(); setCartOpen(true); }}
                className="text-lg font-medium text-white/70 hover:text-white flex items-center gap-2"
              >
                <IconCart /> {t("cart.title")}
                {totalItems > 0 && <span className="px-2 py-0.5 rounded-full bg-[#B8A080] text-[#3D3730] text-xs font-bold">{totalItems}</span>}
              </motion.button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
