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

// ─── Data Fetching ───────────────────────────────────────────
async function getFeaturedProducts(): Promise<ProductWithCategory[]> {
  try {
    const products = await prisma.product.findMany({
      where:   { isFeatured: true, isAvailable: true },
      include: { category: true },
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
      include: { category: true },
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
  const [featuredProducts, latestProducts] = await Promise.all([
    getFeaturedProducts(),
    getLatestProducts(),
  ]);

  const WHATSAPP = process.env.NEXT_PUBLIC_STORE_WHATSAPP ?? "201000000000";

  return (
    <div className="bg-white dark:bg-slate-900 transition-colors duration-300">

      {/* ════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════ */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 start-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 end-10 w-56 h-56 bg-white rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* ── Hero Text ─────────────────────────────────── */}
            <div className="flex-1 text-center lg:text-right space-y-6">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm
                              text-white text-sm font-bold px-4 py-1.5 rounded-full border border-white/30">
                <Zap size={14} fill="white" />
                أحدث الموبايلات والإكسسوارات
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                مرحباً بك في
                <br />
                <span className="text-sky-200">الغلبان</span>
              </h1>

              <p className="text-sky-100 text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
                اكتشف أفضل الأسعار على الموبايلات والإكسسوارات مع خدمة توصيل مجانية
                وضمان الجودة على جميع منتجاتنا.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/mobiles"
                  className="inline-flex items-center justify-center gap-2
                             bg-white text-sky-600 font-black px-8 py-3.5 rounded-xl
                             hover:bg-sky-50 transition-all duration-200 shadow-lg hover:shadow-xl
                             hover:-translate-y-0.5 text-base"
                >
                  <Smartphone size={20} />
                  تصفح الموبايلات
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2
                             bg-green-500 hover:bg-green-600 text-white font-bold
                             px-8 py-3.5 rounded-xl transition-all duration-200
                             shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
                >
                  <MessageCircle size={20} />
                  تواصل معنا
                </a>
              </div>
            </div>

            {/* ── Hero Stats ────────────────────────────────── */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-5">
              {[
                { icon: ShieldCheck, label: "ضمان الجودة",   value: "100%" },
                { icon: Truck,       label: "توصيل مجاني",   value: "مجاني" },
                { icon: Star,        label: "عملاء راضون",   value: "+500" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-4
                             border border-white/20 text-center min-w-[100px]"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon size={20} className="text-white" />
                  </div>
                  <p className="text-white font-black text-xl">{value}</p>
                  <p className="text-sky-200 text-xs font-medium mt-0.5">{label}</p>
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
              title: "موبايلات",
              desc:  "أحدث الهواتف الذكية",
              color: "from-sky-500 to-sky-700",
              bg:    "bg-sky-50",
              text:  "text-sky-600",
            },
            {
              href:  "/accessories",
              icon:  Headphones,
              title: "إكسسوارات",
              desc:  "سماعات، شواحن، وأكثر",
              color: "from-violet-500 to-violet-700",
              bg:    "bg-violet-50",
              text:  "text-violet-600",
            },
            {
              href:  "/maintenance",
              icon:  Wrench,
              title: "صيانة",
              desc:  "خدمة إصلاح احترافية",
              color: "from-emerald-500 to-emerald-700",
              bg:    "bg-emerald-50",
              text:  "text-emerald-600",
            },
          ].map(({ href, icon: Icon, title, desc, color, bg, text }) => (
            <Link
              key={href}
              href={href}
              className={`${bg} dark:bg-slate-800 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center text-center
                          border border-transparent hover:border-sky-200 dark:hover:border-sky-500
                          transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl
                               flex items-center justify-center mb-4 shadow-lg
                               group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={30} className="text-white" />
              </div>
              <h3 className={`font-black text-xl ${text} dark:text-sky-400`}>{title}</h3>
              <p className="text-silver-500 dark:text-slate-300 text-sm mt-1">{desc}</p>
              <span className={`mt-3 ${text} dark:text-sky-400 text-sm font-bold flex items-center gap-1
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                تصفح الآن <ArrowLeft size={14} className="rotate-180" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FEATURED PRODUCTS
          ════════════════════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="py-10 bg-silver-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">منتجات مميزة ⭐</h2>
                <p className="section-subtitle">أكثر المنتجات شعبية وطلباً</p>
              </div>
              <Link href="/mobiles" className="btn-ghost hidden sm:flex items-center gap-1 text-sm">
                عرض الكل <ArrowLeft size={14} className="rotate-180" />
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
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sky-600 to-sky-800 rounded-3xl p-8 md:p-12
                        relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 start-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 end-0 w-48 h-48 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative">
            <span className="badge-sale text-sm px-4 py-1.5 mb-4 inline-block">
              🔥 عروض حصرية
            </span>
            <h2 className="text-white font-black text-2xl md:text-3xl mb-3">
              توصيل مجاني على جميع الطلبات
            </h2>
            <p className="text-sky-200 text-base mb-6">
              اطلب الآن واستلم في أسرع وقت مع ضمان الجودة والكاش عند الاستلام
            </p>
            <Link
              href="/mobiles"
              className="inline-flex items-center gap-2 bg-white text-sky-600 font-black
                         px-8 py-3 rounded-xl hover:bg-sky-50 transition-all duration-200
                         shadow-lg hover:shadow-xl text-base"
            >
              <ShoppingCart size={20} />
              اطلب الآن
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
                <h2 className="section-title">أحدث المنتجات 🆕</h2>
                <p className="section-subtitle">وصل حديثاً إلى متجرنا</p>
              </div>
              <Link href="/accessories" className="btn-ghost hidden sm:flex items-center gap-1 text-sm">
                عرض الكل <ArrowLeft size={14} className="rotate-180" />
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
      <section className="py-12 bg-silver-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title text-center">لماذا الغلبان؟ 🏆</h2>
          <p className="section-subtitle text-center">نفخر بتقديم أفضل تجربة تسوق</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              { icon: "🚀", title: "أسرع توصيل",    desc: "نوصل في أسرع وقت ممكن" },
              { icon: "💯", title: "ضمان الجودة",   desc: "كل المنتجات أصلية 100%" },
              { icon: "💰", title: "أفضل الأسعار",  desc: "أسعار لا تجدها في مكان آخر" },
              { icon: "🛡️", title: "دفع آمن",       desc: "الدفع كاش عند الاستلام" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 flex flex-col items-center text-center
                                         card-lift">
                <span className="text-4xl mb-3">{icon}</span>
                <h3 className="font-black text-silver-800 dark:text-slate-100 text-base">{title}</h3>
                <p className="text-silver-400 dark:text-slate-300 text-sm mt-1">{desc}</p>
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
              تحتاج مساعدة؟ نحن هنا! 💬
            </h3>
            <p className="text-silver-500 dark:text-slate-300 mt-2">
              تواصل معنا مباشرة على واتساب لأي استفسار أو طلب خاص.
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن منتجاتكم")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-3 bg-green-500 hover:bg-green-600
                       text-white font-black px-8 py-4 rounded-2xl transition-all duration-200
                       shadow-lg hover:shadow-xl hover:scale-105 text-lg"
          >
            <MessageCircle size={24} />
            ابدأ محادثة
          </a>
        </div>
      </section>
    </div>
  );
}


