"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useT } from "@/lib/LanguageContext";
import { siteConfig } from "@/data/site-config";

export function Navbar() {
  const { t } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMobile]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const { brand, contact } = siteConfig;
  const navigation = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.products"), href: "/products" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass bg-white/75 dark:bg-brand-900/80 shadow-sm border-b border-black/5 dark:border-white/5"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            {brand.logo.image ? (
              <img
                src={brand.logo.image}
                alt={brand.name}
                className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-sm transition-transform duration-300 group-hover:scale-105">
                {brand.logo.text}
              </div>
            )}
            <span
              className={`text-lg font-bold tracking-tight transition-colors duration-300 ${
                scrolled ? "text-brand-800 dark:text-white" : "text-white"
              }`}
            >
              {brand.name}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            <ThemeToggle />
            <LanguageSwitcher />
            {navigation.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                    scrolled
                      ? isActive
                        ? "text-accent-dark dark:text-accent"
                        : "text-text-secondary/80 hover:text-text-primary dark:text-white/40 dark:hover:text-white"
                      : isActive
                        ? "text-accent"
                        : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            <div className="w-px h-5 bg-current opacity-15 mx-2" />
            <a
              href={contact.phone.href}
              className={`ml-1 flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-500 ${
                scrolled
                  ? "bg-brand-800 text-white hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-800/20"
                  : "glass-subtle bg-white/10 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-white/5"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{contact.phone.display}</span>
              <span className="xl:hidden">{t("nav.call")}</span>
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled
                ? "text-brand-800 hover:bg-black/5"
                : "text-white hover:bg-white/10"
            }`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-brand-900/98 dark:bg-black/98 backdrop-blur-xl"
              onClick={closeMobile}
            />
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative flex flex-col items-center justify-center h-full gap-6"
            >
              {navigation.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-semibold text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                href={contact.phone.href}
                className="mt-4 px-8 py-3 rounded-full bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-colors"
              >
                {contact.phone.display}
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
