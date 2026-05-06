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
    <footer className="bg-silver-900 text-silver-300 mt-16">
      {/* ── Main Footer ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand ─────────────────────────────────────────── */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700
                              rounded-xl flex items-center justify-center shadow-lg">
                <Zap size={20} className="text-white" fill="white" />
              </div>
              <div>
                <p className="text-white font-black text-xl leading-none">الغلبان</p>
                <p className="text-silver-400 text-[11px] leading-none mt-0.5">
                  موبايلات · إكسسوارات · صيانة
                </p>
              </div>
            </div>
            <p className="text-silver-400 text-sm leading-relaxed">
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
            <h3 className="text-white font-bold text-base mb-4">روابط سريعة</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/",            label: "الرئيسية" },
                { href: "/mobiles",     label: "موبايلات" },
                { href: "/accessories", label: "إكسسوارات" },
                { href: "/maintenance", label: "خدمات الصيانة" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-silver-400 hover:text-sky-400 text-sm
                               transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-silver-600 group-hover:bg-sky-400 transition-colors" />
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
      <div className="border-t border-silver-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
                        flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-silver-500 text-xs">
            © {year} الغلبان للموبايلات والإكسسوارات. جميع الحقوق محفوظة.
          </p>
          <p className="text-silver-600 text-xs flex items-center gap-1">
            الدفع عند الاستلام فقط <span className="text-sky-500">●</span> توصيل مجاني
          </p>
        </div>
      </div>
    </footer>
  );
}
