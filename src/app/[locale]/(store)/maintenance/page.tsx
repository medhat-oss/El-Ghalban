"use client";
// ============================================================
// El-Ghalban | app/(store)/maintenance/page.tsx — Maintenance
// ============================================================
export const dynamic = 'force-dynamic';
import React, { useState } from "react";
import {
  Wrench, Smartphone, Monitor, Battery, Wifi, HardDrive,
  ShieldCheck, Clock, MessageCircle, Phone, CheckCircle, Send,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "next-intl";

const WHATSAPP = process.env.NEXT_PUBLIC_STORE_WHATSAPP ?? "201000000000";

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Oppo", "Vivo", "Huawei", "Realme", "Tecno", "Infinix", "جميع الماركات"];
const BRANDS_EN = ["Apple", "Samsung", "Xiaomi", "Oppo", "Vivo", "Huawei", "Realme", "Tecno", "Infinix", "All Brands"];

interface FormData {
  name: string; phone: string; device: string; issue: string;
}

export default function MaintenancePage() {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [form, setForm]       = useState<FormData>({ name: "", phone: "", device: "", issue: "" });
  const [errors, setErrors]   = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const getHardwareServices = (en: boolean) => [
    { icon: Monitor,     title: en ? "Screen Replacement" : "إصلاح الشاشات",       desc: en ? "Replace broken or dead screens — 100% original" : "استبدال شاشات مكسورة أو ميتة — أصلية 100%",      price: en ? "Starts at 300 EGP" : "يبدأ من 300 ج.م" },
    { icon: Battery,     title: en ? "Screen & Battery Replacement" : "تغيير شاشات وبطاريات",    desc: en ? "Original batteries for all mobile brands" : "بطاريات أصلية لجميع ماركات الموبايل",             price: en ? "Starts at 150 EGP" : "يبدأ من 150 ج.م" },
    { icon: HardDrive,   title: en ? "Motherboard & IC Repair" : "إصلاح الماذر بورد والـ IC",       desc: en ? "Microscopic soldering and mainboard circuit repair" : "لحام ميكروسكوبي وإصلاح دوائر البوردة الأم",       price: en ? "Starts at 200 EGP" : "يبدأ من 200 ج.م" },
    { icon: Smartphone,  title: en ? "Device Diagnostics & Inspection" : "فحص الهواتف والأجهزة",      desc: en ? "Comprehensive diagnostics for front/rear cameras and hardware" : "استبدال كاميرات أمامية وخلفية لجميع الطرازات",    price: en ? "Starts at 200 EGP" : "يبدأ من 200 ج.م" },
    { icon: Wrench,      title: en ? "Audio Issues Repair" : "إصلاح مشاكل الصوت",   desc: en ? "Earpiece, internal speaker, and microphone repair" : "سماعة أذن، سماعة داخلية، ميكروفون",               price: en ? "Starts at 100 EGP" : "يبدأ من 100 ج.م" },
    { icon: ShieldCheck, title: en ? "Periodic Cleaning & Maintenance" : "تنظيف وصيانة دورية",  desc: en ? "Comprehensive internal cleaning to improve performance" : "تنظيف شامل من الداخل لتحسين الأداء",              price: en ? "Starts at 80 EGP" : "يبدأ من 80 ج.م" },
  ];

  const getSoftwareServices = (en: boolean) => [
    { icon: HardDrive,  title: en ? "Flash & System Update" : "فلاش وتحديث النظام",  desc: en ? "iOS/Android update and device formatting" : "تحديث iOS / Android وإعادة تهيئة الجهاز" },
    { icon: Wifi,       title: en ? "Network Unlocking" : "فتح الشبكات",          desc: en ? "Unlock local and international networks" : "فتح الشبكة لجميع الشبكات المحلية والدولية" },
    { icon: ShieldCheck,title: en ? "Screen Lock Removal" : "إزالة بصمة الشاشة",   desc: en ? "Remove Pattern / PIN / Fingerprint lock" : "إزالة Pattern / PIN / بصمة الإصبع" },
    { icon: Monitor,    title: en ? "iCloud Removal" : "إزالة حساب iCloud",    desc: en ? "Remove forgotten Apple ID account" : "إزالة حساب Apple ID المنسي" },
    { icon: HardDrive,  title: en ? "Data Recovery" : "استرداد البيانات",     desc: en ? "Recover deleted photos and files" : "استرداد الصور والملفات المحذوفة" },
    { icon: Smartphone, title: en ? "App Installation" : "تركيب التطبيقات",      desc: en ? "Install and update paid applications" : "تركيب التطبيقات المدفوعة وتحديثها" },
  ];

  const hardwareServices = getHardwareServices(isEn);
  const softwareServices = getSoftwareServices(isEn);
  const brandsList = isEn ? BRANDS_EN : BRANDS;

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim())  e.name  = isEn ? "Name is required" : "الاسم مطلوب";
    if (!form.phone.trim()) e.phone = isEn ? "Phone is required" : "رقم الهاتف مطلوب";
    if (!form.device.trim()) e.device = isEn ? "Device type is required" : "نوع الجهاز مطلوب";
    if (!form.issue.trim()) e.issue = isEn ? "Issue description is required" : "وصف المشكلة مطلوب";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleWhatsApp = () => {
    if (!validate()) return;
    const msg = isEn
      ? `🔧 *Maintenance Request — El-Ghalban*\n\n👤 Name: ${form.name}\n📱 Phone: ${form.phone}\n📱 Device: ${form.device}\n🔧 Issue: ${form.issue}\n\nPlease contact me to schedule a repair.`
      : `🔧 *طلب صيانة — الغلبان*\n\n👤 الاسم: ${form.name}\n📱 الهاتف: ${form.phone}\n📱 الجهاز: ${form.device}\n🔧 المشكلة: ${form.issue}\n\nأرجو التواصل لتحديد موعد الصيانة.`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    toast.success(isEn ? "Maintenance request sent via WhatsApp!" : "تم إرسال طلب الصيانة على واتساب!");
  };

  const field = (key: keyof FormData, label: string, type: string, placeholder: string, isTextarea = false) => (
    <div key={key}>
      <label className="block text-sm font-bold text-slate-300 dark:text-slate-300 mb-1.5">{label}</label>
      {isTextarea ? (
        <textarea
          value={form[key]}
          onChange={(e) => { setForm((p) => ({ ...p, [key]: e.target.value })); if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined })); }}
          placeholder={placeholder}
          rows={4}
          className={`w-full bg-neutral-900/50 border ${errors[key] ? "border-red-500" : "border-neutral-800 focus:border-sky-500"} rounded-xl p-3 text-slate-100 placeholder-slate-500 resize-none transition-colors outline-none`}
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={(e) => { setForm((p) => ({ ...p, [key]: e.target.value })); if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined })); }}
          placeholder={placeholder}
          className={`w-full bg-neutral-900/50 border ${errors[key] ? "border-red-500" : "border-neutral-800 focus:border-sky-500"} rounded-xl p-3 text-slate-100 placeholder-slate-500 transition-colors outline-none`}
        />
      )}
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100" dir={isEn ? 'ltr' : 'rtl'}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-900/80 to-slate-900 border-b border-emerald-900/50 py-12 relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <Wrench size={32} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-white font-black text-4xl mb-2 tracking-tight">
                {isEn ? "Maintenance & Repair Department" : "قسم الصيانة والتصليح"}
              </h1>
              <p className="text-emerald-200/80 text-base max-w-2xl">
                {isEn ? "Fast, reliable, and premium quality repairs. Hardware and software solutions for all mobile devices." : "صيانة سريعة واعتمادية بأعلى جودة. حلول هاردوير وسوفتوير لجميع الهواتف المحمولة."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 relative">
        
        {/* Background glow behind content */}
        <div className="absolute left-0 top-1/3 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* ── Trust Badges ─────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, label: isEn ? "Repair Warranty" : "ضمان على الإصلاح",  value: isEn ? "3 Months" : "3 أشهر" },
            { icon: Clock,       label: isEn ? "Repair Time" : "وقت الإصلاح",        value: isEn ? "Same Day" : "نفس اليوم" },
            { icon: CheckCircle, label: isEn ? "Original Parts" : "قطع غيار أصلية",      value: isEn ? "100% Authentic" : "100% أصلية" },
            { icon: Smartphone,  label: isEn ? "Supported Brands" : "ماركات مدعومة",      value: isEn ? "+10 Brands" : "+10 ماركة" },
          ].map(({ icon: Icon, label, value }, i) => (
            <div key={i} className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 text-center shadow-lg transition-transform hover:-translate-y-1">
              <Icon size={32} className="text-emerald-500 mx-auto mb-4" />
              <p className="font-black text-white text-xl">{value}</p>
              <p className="text-slate-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Hardware Services ────────────────────────────── */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span className="text-emerald-500">🔩</span>
              {isEn ? "Hardware Repair" : "إصلاح الهاردوير"}
            </h2>
            <p className="text-slate-400 mt-2">{isEn ? "Physical device component repair and replacement services" : "خدمات إصلاح المكونات المادية للجهاز واستبدال القطع"}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hardwareServices.map(({ icon: Icon, title, desc, price }) => (
              <div key={title} className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 flex gap-5 shadow-lg transition-transform hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-neutral-900/80 group">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                  <Icon size={26} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{title}</h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">{desc}</p>
                  <span className="inline-block mt-4 text-emerald-400 font-black text-sm bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                    {price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Software Services ────────────────────────────── */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span className="text-sky-500">💻</span>
              {isEn ? "Software Services" : "خدمات السوفتوير"}
            </h2>
            <p className="text-slate-400 mt-2">{isEn ? "Programming, network unlocking, and system solutions" : "برمجة وفتح شبكات وحلول النظام"}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {softwareServices.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 flex gap-5 shadow-lg transition-transform hover:-translate-y-1 hover:border-sky-500/30 hover:bg-neutral-900/80 group">
                <div className="w-14 h-14 bg-sky-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500/20 transition-colors">
                  <Icon size={26} className="text-sky-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{title}</h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Supported Brands ─────────────────────────────── */}
        <div>
          <h2 className="text-xl font-black text-white mb-6">📱 {isEn ? "Supported Brands" : "الماركات المدعومة"}</h2>
          <div className="flex flex-wrap gap-3">
            {brandsList.map((brand) => (
              <span
                key={brand}
                className="bg-neutral-900/80 border border-neutral-800 text-slate-300 font-medium
                           px-5 py-2.5 rounded-xl text-sm hover:border-emerald-500/50 hover:text-white hover:bg-neutral-800
                           transition-all duration-200 shadow-sm"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* ── Booking Section ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
          {/* Contact Form */}
          <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-3xl p-8 shadow-xl">
            <h2 className="font-black text-white text-2xl mb-2">{isEn ? "Book a Maintenance Appointment 📅" : "احجز موعد صيانة 📅"}</h2>
            <p className="text-slate-400 text-sm mb-8">{isEn ? "Send your device details and we will contact you immediately" : "أرسل تفاصيل جهازك وسنتواصل معك فوراً"}</p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4 bg-neutral-900/40 rounded-2xl border border-neutral-800">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle size={40} className="text-emerald-500" />
                </div>
                <p className="font-black text-white text-xl">{isEn ? "Request Sent Successfully!" : "تم إرسال طلبك بنجاح!"}</p>
                <p className="text-slate-400 text-sm max-w-xs">{isEn ? "Our technical team will contact you shortly to schedule your repair." : "سيتواصل معك فريق الدعم الفني قريباً لتحديد الموعد."}</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", device: "", issue: "" }); }} 
                        className="mt-4 px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors font-medium border border-neutral-700">
                  {isEn ? "Submit Another Request" : "إرسال طلب آخر"}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {field("name",   isEn ? "Full Name *" : "الاسم الكامل *",       "text", isEn ? "e.g., John Doe" : "مثال: محمد أحمد")}
                {field("phone",  isEn ? "Phone Number *" : "رقم الهاتف *",          "tel",  "01XXXXXXXXX")}
                {field("device", isEn ? "Device Type & Model *" : "نوع الجهاز والطراز *",  "text", isEn ? "e.g., iPhone 14 Pro Max" : "مثال: iPhone 14 Pro Max")}
                {field("issue",  isEn ? "Issue Description *" : "وصف المشكلة *",          "text", isEn ? "Please describe the problem in detail..." : "اشرح المشكلة بالتفصيل...", true)}
                <div className="pt-4">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-3
                               bg-emerald-600 hover:bg-emerald-500 text-white font-black
                               py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40"
                  >
                    <MessageCircle size={22} />
                    {isEn ? "Send Request via WhatsApp" : "إرسال الطلب عبر واتساب"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Direct Contact & Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-900/30 to-neutral-900/60 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-8 shadow-xl">
              <h3 className="font-black text-white text-xl mb-6">{isEn ? "Direct Contact 📞" : "تواصل مباشر 📞"}</h3>
              <div className="space-y-4">
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-green-600 hover:bg-green-500
                             text-white font-bold py-3.5 px-5 rounded-xl transition-all
                             duration-300 shadow-lg hover:-translate-y-0.5"
                >
                  <MessageCircle size={22} />
                  {isEn ? "WhatsApp — Contact Now" : "واتساب — تواصل الآن"}
                </a>
                <a
                  href={`tel:+${WHATSAPP}`}
                  className="flex items-center gap-4 bg-neutral-800 hover:bg-neutral-700
                             text-white font-bold py-3.5 px-5 rounded-xl border border-neutral-700
                             transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Phone size={22} />
                  {isEn ? "Call Us Directly" : "اتصل بنا مباشرة"}
                </a>
              </div>
            </div>

            <div className="bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 rounded-3xl p-8 shadow-xl">
              <h3 className="font-black text-white text-xl mb-5">{isEn ? "Working Hours 🕐" : "أوقات العمل 🕐"}</h3>
              <div className="space-y-4">
                {[
                  { day: isEn ? "Saturday — Thursday" : "السبت — الخميس", time: isEn ? "10 AM — 10 PM" : "10 صباحاً — 10 مساءً" },
                  { day: isEn ? "Friday" : "الجمعة",                      time: isEn ? "2 PM — 10 PM" : "2 ظهراً — 10 مساءً" },
                ].map(({ day, time }) => (
                  <div key={day} className="flex justify-between items-center text-sm border-b border-neutral-800 pb-3 last:border-0 last:pb-0">
                    <span className="font-medium text-slate-300">{day}</span>
                    <span className="text-emerald-400 font-black bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-900/20 border border-amber-500/30 rounded-3xl p-6 shadow-xl backdrop-blur-md">
              <p className="text-amber-400 font-bold text-sm flex items-start gap-3 leading-relaxed">
                <span className="text-2xl drop-shadow-md">⚡</span>
                <span>
                  {isEn ? "Express Repair Service Available! Many common issues are fixed the same day. Contact us now to inquire." : "خدمة الإصلاح السريع متاحة! كثير من الأعطال تُصلح في نفس اليوم. تواصل معنا الآن للاستفسار."}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
