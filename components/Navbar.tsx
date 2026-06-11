"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCart, IconMenu, IconClose } from "@/components/icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useT } from "@/lib/LanguageContext";
import { useInquiryCart } from "@/lib/InquiryContext";
import { siteConfig } from "@/data/site-config";

export function Navbar() {
  const { t } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setCartOpen } = useInquiryCart();
  const pathname = usePathname();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => { closeMobile(); }, [pathname, closeMobile]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMobile(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMobile]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const { brand } = siteConfig;
  const navigation = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.products"), href: "/products" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <>
      {/* Top brand bar */}
      <div className="bg-[#3D3730] text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <span className="text-sm font-bold tracking-wide text-white">{brand.name}</span>
            <span className="hidden sm:inline text-[10px] text-white/25 tracking-wider">{brand.slogan}</span>
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
            {navigation.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-[13px] text-[13px] font-medium tracking-wide transition-all duration-300 rounded-lg ${
                    isActive
                      ? "text-[#3D3730] dark:text-white bg-[#E8E2DC]/60 dark:bg-white/10"
                      : "text-[#7B7068] dark:text-white/40 hover:text-[#3D3730] dark:hover:text-white hover:bg-[#E8E2DC]/30 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {isActive && (
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
            <motion.nav initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative flex flex-col items-center justify-center h-full gap-6">
              {navigation.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                  <Link href={link.href} onClick={closeMobile} className="text-2xl font-semibold text-white/80 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
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
