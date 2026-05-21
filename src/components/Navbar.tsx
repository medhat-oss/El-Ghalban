"use client";
// ============================================================
// El-Ghalban | components/Navbar.tsx — Main Navigation
// RTL, sticky, mobile-responsive with slide-out menu
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Globe } from "lucide-react";
import {
  Smartphone,
  Headphones,
  Wrench,
  Home,
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/",            key: "home",         icon: Home },
  { href: "/mobiles",     key: "mobiles",      icon: Smartphone },
  { href: "/accessories", key: "accessories",  icon: Headphones },
  { href: "/maintenance", key: "maintenance",  icon: Wrench },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navbar");
  const { itemCount, openCart } = useCart();
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [isScrolled, setIsScrolled]   = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    setMounted(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Sticky Navbar ─────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-navbar"
            : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">

            {/* ── Logo ─────────────────────────────────────── */}
            <Link
              href="/"
              prefetch={true}
              className="flex items-center gap-2 group flex-shrink-0"
              aria-label="الغلبان - الصفحة الرئيسية"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center
                              transition-transform duration-300 group-hover:scale-105 drop-shadow-sm">
                <Image src="/logo.png" alt="الغلبان Logo" fill className="object-contain" priority sizes="80px" />
              </div>
              <div className="flex flex-col leading-tight mt-1">
                <span className="text-sky-600 dark:text-sky-400 font-black text-2xl tracking-tight leading-none">
                  {locale === 'ar' ? 'الغلبان' : 'El-Ghalban'}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold leading-none mt-1">
                  {t('mobiles')} · {t('accessories')} · {t('maintenance')}
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ─────────────────────────── */}
            <ul className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, key, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href as any}
                    prefetch={true}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                      transition-colors duration-200 group
                      ${isActive(href)
                        ? "text-sky-600 dark:text-sky-300"
                        : "text-silver-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300"
                      }`}
                  >
                    {isActive(href) && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-sky-50 dark:bg-sky-500/20 rounded-xl"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon
                        size={16}
                        className={`transition-colors ${
                          isActive(href) ? "text-sky-500" : "text-silver-400 group-hover:text-sky-400"
                        }`}
                      />
                      {key === 'home' ? (locale === 'ar' ? 'الرئيسية' : 'Home') : t(key as any)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* ── Right-side Actions ────────────────────────── */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <button
                onClick={() => router.replace(pathname, { locale: locale === 'ar' ? 'en' : 'ar' })}
                aria-label="Toggle Language"
                className="relative flex items-center justify-center gap-1 w-auto px-2 h-10
                          rounded-xl bg-silver-50 dark:bg-silver-800 hover:bg-silver-100 dark:hover:bg-silver-700
                          text-silver-600 dark:text-silver-300 transition-all duration-200 font-semibold text-sm"
              >
                <Globe size={18} />
                {locale === 'ar' ? 'EN' : 'AR'}
              </button>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle Dark Mode"
                  className="relative flex items-center justify-center w-10 h-10
                            rounded-xl bg-silver-50 dark:bg-silver-800 hover:bg-silver-100 dark:hover:bg-silver-700
                            text-silver-600 dark:text-silver-300 transition-all duration-200"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={openCart}
                aria-label={locale === 'ar' ? `سلة التسوق - ${itemCount} منتج` : `Cart - ${itemCount} items`}
                className="relative flex items-center justify-center w-10 h-10
                           rounded-xl bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20
                           text-sky-600 dark:text-sky-400 transition-all duration-200
                           hover:scale-105 active:scale-95"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1.5 -start-1.5 min-w-[20px] h-5 px-1
                               bg-sky-500 text-white text-[10px] font-black
                               rounded-full flex items-center justify-center
                               border-2 border-white dark:border-silver-900 shadow-sm animate-pulse-soft"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>

              {/* Hamburger (mobile) */}
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label={locale === 'ar' ? "قائمة التنقل" : "Navigation Menu"}
                aria-expanded={isMenuOpen}
                className="md:hidden flex items-center justify-center w-10 h-10
                           rounded-xl hover:bg-silver-100 dark:hover:bg-silver-800 text-silver-600 dark:text-silver-300
                           transition-all duration-200"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </nav>
        </div>

        {/* ── Mobile Menu ────────────────────────────────────── */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-silver-100 dark:border-silver-800 bg-white/95 dark:bg-silver-900/95 backdrop-blur-md"
            >
              <ul className="px-4 py-3 space-y-1">
                {NAV_LINKS.map(({ href, key, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href as any}
                      prefetch={true}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                        transition-all duration-200
                        ${isActive(href)
                          ? "bg-sky-50 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-100 dark:border-sky-500/30"
                          : "text-silver-700 dark:text-slate-300 hover:bg-silver-50 dark:hover:bg-slate-800"
                        }`}
                    >
                      <Icon size={18} className={isActive(href) ? "text-sky-500" : "text-silver-400"} />
                      {key === 'home' ? (locale === 'ar' ? 'الرئيسية' : 'Home') : t(key as any)}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer to offset fixed navbar */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
