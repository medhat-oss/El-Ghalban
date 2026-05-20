// ============================================================
// El-Ghalban | components/Footer.tsx — Site Footer
// ============================================================

import React from "react";
import Link from "next/link";
import { Phone, MapPin, Mail, Zap, MessageCircle } from "lucide-react";

const PHONE = process.env.NEXT_PUBLIC_STORE_WHATSAPP ?? "201XXXXXXXXX";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 mt-24 border-t border-slate-900 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-900 to-transparent opacity-50" />
      
      {/* ── Main Footer ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* ── Brand ─────────────────────────────────────────── */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Zap size={20} className="text-white" fill="white" />
              </div>
              <div>
                <p className="text-white font-black text-2xl tracking-tight leading-none">الغلبان</p>
                <p className="text-sky-400 text-xs font-bold leading-none mt-1">
                  موبايلات · إكسسوارات · صيانة
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              متجرك المتخصص في أحدث الموبايلات وأفضل الإكسسوارات بأسعار لا تُقاوم،
              مع خدمة صيانة احترافية تضمن لك أعلى جودة.
            </p>
            <a
              href={`https://wa.me/${PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700
                         text-white font-bold text-sm px-4 py-2.5 rounded-xl
                         transition-all duration-200 hover:scale-105"
            >
              <MessageCircle size={16} />
              تواصل على واتساب
            </a>
          </div>

          {/* ── Quick Links ─────────────────────────────────── */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">روابط سريعة</h3>
            <ul className="space-y-3">
              {[
                { href: "/",            label: "الرئيسية" },
                { href: "/mobiles",     label: "موبايلات" },
                { href: "/accessories", label: "إكسسوارات" },
                { href: "/maintenance", label: "خدمات الصيانة" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-400 hover:text-white text-sm font-medium
                               transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-sky-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ─────────────────────────────────────── */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">خدماتنا</h3>
            <ul className="space-y-2.5">
              {[
                "صيانة الشاشات",
                "استبدال البطاريات",
                "إصلاح البوردات",
                "فلاش وتحديث النظام",
                "فتح شبكات",
                "تنظيف وصيانة دورية",
              ].map((s) => (
                <li key={s}>
                  <span className="text-silver-400 text-sm flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-silver-600" />
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ──────────────────────────────────────── */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:+${PHONE}`}
                  className="flex items-center gap-3 text-silver-400 hover:text-sky-400
                             text-sm transition-colors"
                >
                  <div className="w-8 h-8 bg-silver-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={14} className="text-sky-400" />
                  </div>
                  <span dir="ltr">+{PHONE}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_STORE_EMAIL ?? "info@elghalban.com"}`}
                  className="flex items-center gap-3 text-silver-400 hover:text-sky-400
                             text-sm transition-colors"
                >
                  <div className="w-8 h-8 bg-silver-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-sky-400" />
                  </div>
                  <span>info@elghalban.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-silver-400 text-sm">
                <div className="w-8 h-8 bg-silver-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} className="text-sky-400" />
                </div>
                <span>
                  {process.env.NEXT_PUBLIC_STORE_ADDRESS ?? "القاهرة، مصر"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ──────────────────────────────────────── */}
      <div className="border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6
                        flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm font-medium">
            © {year} الغلبان. جميع الحقوق محفوظة.
          </p>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
            الدفع عند الاستلام <span className="text-sky-500 text-xs">●</span> توصيل مجاني
          </p>
        </div>
      </div>
    </footer>
  );
}
