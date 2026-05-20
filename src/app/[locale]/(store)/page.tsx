// ============================================================
// El-Ghalban | app/(store)/page.tsx — Home Page (الرئيسية)
// Server Component — fetches featured products from DB
// ============================================================
export const dynamic = 'force-dynamic';
import React from "react";
import Link from "next/link";
import {
  Smartphone, Headphones, Wrench, ArrowLeft, Zap,
  ShieldCheck, Truck, Star, MessageCircle, ShoppingCart,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import type { ProductWithCategory } from "@/types";
import { getTranslations, getLocale } from "next-intl/server";

// ─── Data Fetching ───────────────────────────────────────────
async function getFeaturedProducts(): Promise<ProductWithCategory[]> {
  try {
    const products = await prisma.product.findMany({
      where:   { isFeatured: true, isAvailable: true },
      include: { category: true, images: true },
      orderBy: { createdAt: "desc" },
      take:    8,
    });
    return products as unknown as ProductWithCategory[];
  } catch {
    return [];
  }
}

async function getLatestProducts(): Promise<ProductWithCategory[]> {
  try {
    const products = await prisma.product.findMany({
      where:   { isAvailable: true },
      include: { category: true, images: true },
      orderBy: { createdAt: "desc" },
      take:    6,
    });
    return products as unknown as ProductWithCategory[];
  } catch {
    return [];
  }
}

// ─── Page ────────────────────────────────────────────────────
export default async function HomePage() {
  const [featuredProducts, latestProducts, tHero, tCats, tStore, tWhyUs, tBanner, tContact] =
    await Promise.all([
      getFeaturedProducts(),
      getLatestProducts(),
      getTranslations("Hero"),
      getTranslations("Categories"),
      getTranslations("Store"),
      getTranslations("WhyUs"),
      getTranslations("Banner"),
      getTranslations("Contact"),
    ]);

  const locale = await getLocale();
  const WHATSAPP = process.env.NEXT_PUBLIC_STORE_WHATSAPP ?? "201000000000";

  return (
    <div className="bg-white dark:bg-slate-900 transition-colors duration-300">

      {/* ════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        {/* Soft Glowing Orbs */}
        <div className="absolute inset-0 opacity-40 dark:opacity-30 pointer-events-none">
          <div className="absolute top-0 -start-1/4 w-[500px] h-[500px] bg-sky-200 dark:bg-sky-500/30 rounded-full blur-[100px] dark:blur-[120px]" />
          <div className="absolute bottom-0 -end-1/4 w-[400px] h-[400px] bg-violet-200 dark:bg-violet-500/20 rounded-full blur-[80px] dark:blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* ── Hero Text ─────────────────────────────────── */}
            <div className="flex-1 text-center lg:text-right space-y-8">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 bg-white dark:bg-white/10 backdrop-blur-md
                              text-sky-700 dark:text-sky-100 text-sm font-bold px-4 py-2 rounded-full border border-sky-100 dark:border-white/10 shadow-sm animate-fade-up">
                <Zap size={16} className="text-sky-500 dark:text-sky-400" />
                {tHero("badge")}
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
                {tHero("title1")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400 dark:from-sky-400 dark:to-sky-200">
                  {tHero("title2")}
                </span>
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
                {tHero("subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
                <Link
                  href="/mobiles"
                  className="inline-flex items-center justify-center gap-2
                             bg-sky-600 dark:bg-white text-white dark:text-slate-900 font-bold px-8 py-4 rounded-2xl
                             hover:bg-sky-700 dark:hover:bg-sky-50 transition-all duration-300 shadow-apple-md hover:shadow-apple-lg
                             hover:-translate-y-1 text-base group"
                >
                  <Smartphone size={20} className="text-sky-100 dark:text-sky-500 group-hover:scale-110 transition-transform" />
                  {tHero("cta_mobiles")}
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2
                             bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold
                             px-8 py-4 rounded-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700
                             shadow-apple-sm hover:shadow-apple-md hover:-translate-y-1 text-base group"
                >
                  <MessageCircle size={20} className="text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                  {tHero("cta_whatsapp")}
                </a>
              </div>
            </div>

            {/* ── Hero Stats ────────────────────────────────── */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-6 w-full lg:w-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: ShieldCheck, label: tHero("stat_quality"),   value: "100%" },
                { icon: Truck,       label: tHero("stat_delivery"),  value: locale === "ar" ? "مجاني" : "Free" },
                { icon: Star,        label: tHero("stat_customers"), value: "+500" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="glass-panel p-5 text-center min-w-[120px] bg-white/80 dark:bg-slate-900/40 border-slate-200 dark:border-white/5"
                >
                  <div className="w-12 h-12 bg-slate-50 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <Icon size={24} className="text-sky-500 dark:text-sky-400" />
                  </div>
                  <p className="text-slate-900 dark:text-white font-black text-2xl tracking-tight">{value}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CATEGORY QUICK LINKS
          ════════════════════════════════════════════════════ */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              href:  "/mobiles",
              icon:  Smartphone,
              title: tCats("mobiles"),
              desc:  tCats("mobiles_desc"),
              color: "from-sky-500 to-sky-700",
              bg:    "bg-sky-50",
              text:  "text-sky-600",
            },
            {
              href:  "/accessories",
              icon:  Headphones,
              title: tCats("accessories"),
              desc:  tCats("accessories_desc"),
              color: "from-violet-500 to-violet-700",
              bg:    "bg-violet-50",
              text:  "text-violet-600",
            },
            {
              href:  "/maintenance",
              icon:  Wrench,
              title: tCats("maintenance"),
              desc:  tCats("maintenance_desc"),
              color: "from-emerald-500 to-emerald-700",
              bg:    "bg-emerald-50",
              text:  "text-emerald-600",
            },
          ].map(({ href, icon: Icon, title, desc, color, bg, text }) => (
            <Link
              key={href}
              href={href}
              className={`glass-panel p-8 flex flex-col items-center text-center
                          border border-slate-200 dark:border-slate-800 
                          hover:bg-white dark:hover:bg-slate-800/80
                          transition-all duration-300 hover:-translate-y-2 hover:shadow-apple-md group`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl
                               flex items-center justify-center mb-5 shadow-lg
                               group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={28} className="text-white" />
              </div>
              <h3 className={`font-black text-xl text-slate-900 dark:text-white`}>{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{desc}</p>
              <span className={`mt-4 ${text} dark:text-sky-400 text-sm font-bold flex items-center gap-1
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-2 group-hover:translate-y-0`}>
                {tCats("browse")} <ArrowLeft size={16} className={locale === "ar" ? "rotate-180" : ""} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FEATURED PRODUCTS
          ════════════════════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="py-10 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">{tStore("featured")} ⭐</h2>
                <p className="section-subtitle">{tStore("featuredSubtitle")}</p>
              </div>
              <Link href="/mobiles" className="btn-ghost hidden sm:flex items-center gap-1 text-sm">
                {tStore("viewAll")} <ArrowLeft size={14} className={locale === "ar" ? "rotate-180" : ""} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════
          OFFERS BANNER
          ════════════════════════════════════════════════════ */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[2rem] p-10 md:p-16 border border-slate-800
                        relative overflow-hidden text-center shadow-apple-lg flex flex-col items-center group">
          {/* Subtle Glow Background */}
          <div className="absolute inset-0 bg-gradient-glow opacity-50 pointer-events-none group-hover:opacity-80 transition-opacity duration-700" />
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 text-sm font-bold px-5 py-2 mb-6 rounded-full tracking-wide">
              🔥 {tBanner("badge")}
            </span>
            <h2 className="text-white font-black text-3xl md:text-5xl mb-4 leading-tight">
              {tBanner("title")}
            </h2>
            <p className="text-slate-400 text-lg mb-8 font-medium">
              {tBanner("subtitle")}
            </p>
            <Link
              href="/mobiles"
              className="inline-flex items-center gap-2 bg-sky-500 text-white font-bold
                         px-8 py-4 rounded-2xl hover:bg-sky-400 transition-all duration-300
                         shadow-btn hover:shadow-btn-hover text-base hover:-translate-y-1"
            >
              <ShoppingCart size={20} />
              {tBanner("cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          LATEST PRODUCTS
          ════════════════════════════════════════════════════ */}
      {latestProducts.length > 0 && (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">{tStore("latest")} 🆕</h2>
                <p className="section-subtitle">{tStore("latestSubtitle")}</p>
              </div>
              <Link href="/accessories" className="btn-ghost hidden sm:flex items-center gap-1 text-sm">
                {tStore("viewAll")} <ArrowLeft size={14} className={locale === "ar" ? "rotate-180" : ""} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════
          WHY US SECTION
          ════════════════════════════════════════════════════ */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title text-center">{tWhyUs("title")} 🏆</h2>
          <p className="section-subtitle text-center">{tWhyUs("subtitle")}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              { icon: "🚀", title: tWhyUs("delivery"), desc: tWhyUs("delivery_desc") },
              { icon: "💯", title: tWhyUs("quality"),  desc: tWhyUs("quality_desc") },
              { icon: "💰", title: tWhyUs("price"),    desc: tWhyUs("price_desc") },
              { icon: "🛡️", title: tWhyUs("payment"),  desc: tWhyUs("payment_desc") },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 flex flex-col items-center text-center
                                         card-lift">
                <span className="text-4xl mb-3">{icon}</span>
                <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">{title}</h3>
                <p className="text-slate-500 dark:text-slate-300 text-sm mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          WHATSAPP CTA
          ════════════════════════════════════════════════════ */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6
                        bg-green-50 dark:bg-slate-800 border border-green-200 dark:border-slate-700 rounded-3xl p-8">
          <div>
            <h3 className="font-black text-silver-900 dark:text-slate-100 text-xl md:text-2xl">
              {tContact("title")} 💬
            </h3>
            <p className="text-silver-500 dark:text-slate-300 mt-2">
              {tContact("subtitle")}
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(locale === "ar" ? "مرحباً، أريد الاستفسار عن منتجاتكم" : "Hello, I would like to inquire about your products")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-3 bg-green-500 hover:bg-green-600
                       text-white font-black px-8 py-4 rounded-2xl transition-all duration-200
                       shadow-lg hover:shadow-xl hover:scale-105 text-lg"
          >
            <MessageCircle size={24} />
            {tContact("cta")}
          </a>
        </div>
      </section>
    </div>
  );
}


