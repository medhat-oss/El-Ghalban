"use client";
// ============================================================
// El-Ghalban | components/Navbar.tsx — Main Navigation
// RTL, sticky, mobile-responsive with slide-out menu
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Smartphone,
  Headphones,
  Wrench,
  Home,
  ShoppingCart,
  Menu,
  X,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/components/ThemeProvider";

const NAV_LINKS = [
  { href: "/",            label: "الرئيسية",   icon: Home },
  { href: "/mobiles",     label: "موبايلات",   icon: Smartphone },
  { href: "/accessories", label: "إكسسوارات",  icon: Headphones },
  { href: "/maintenance", label: "صيانة",       icon: Wrench },
] as const;

export default function Navbar() {
  const pathname = usePathname();
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
            ? "bg-white/95 dark:bg-slate-900/80 backdrop-blur-md shadow-nav border-b border-silver-100 dark:border-slate-800"
            : "bg-white dark:bg-slate-900/80 dark:backdrop-blur-md border-b border-silver-100 dark:border-slate-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">

            {/* ── Logo ─────────────────────────────────────── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label="الغلبان - الصفحة الرئيسية"
            >
              <div className="relative w-9 h-9 bg-gradient-to-br from-sky-500 to-sky-700
                              rounded-xl flex items-center justify-center
                              shadow-btn group-hover:shadow-btn-hover
                              transition-all duration-200 group-hover:scale-105">
                <Zap size={18} className="text-white" fill="white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sky-600 dark:text-sky-400 font-black text-xl tracking-tight leading-none">
                  الغلبان
                </span>
                <span className="text-silver-400 dark:text-slate-400 text-[10px] font-medium leading-none">
                  موبايلات · إكسسوارات · صيانة
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ─────────────────────────── */}
            <ul className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                      transition-all duration-200 group
                      ${isActive(href)
                        ? "bg-sky-50 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300"
                        : "text-silver-600 dark:text-slate-300 hover:bg-silver-50 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-300"
                      }`}
                  >
                    <Icon
                      size={16}
                      className={`transition-colors ${
                        isActive(href) ? "text-sky-500" : "text-silver-400 group-hover:text-sky-400"
                      }`}
                    />
                    {label}
                    {isActive(href) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 ms-1" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ── Right-side Actions ────────────────────────── */}
            <div className="flex items-center gap-2">
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
                aria-label={`سلة التسوق - ${itemCount} منتج`}
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
                aria-label="قائمة التنقل"
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
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
                      border-t border-silver-100 dark:border-silver-800 bg-white dark:bg-silver-900
                      ${isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <ul className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                    transition-all duration-200
                    ${isActive(href)
                      ? "bg-sky-50 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-100 dark:border-sky-500/30"
                      : "text-silver-700 dark:text-slate-300 hover:bg-silver-50 dark:hover:bg-slate-800"
                    }`}
                >
                  <Icon size={18} className={isActive(href) ? "text-sky-500" : "text-silver-400"} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Spacer to offset fixed navbar */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
