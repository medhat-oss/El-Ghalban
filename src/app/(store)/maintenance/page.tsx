"use client";
// ============================================================
// El-Ghalban | app/(store)/maintenance/page.tsx — صيانة
// ============================================================
export const dynamic = 'force-dynamic';
import React, { useState } from "react";
import {
  Wrench, Smartphone, Monitor, Battery, Wifi, HardDrive,
  ShieldCheck, Clock, MessageCircle, Phone, CheckCircle, Send,
} from "lucide-react";
import toast from "react-hot-toast";

const WHATSAPP = process.env.NEXT_PUBLIC_STORE_WHATSAPP ?? "201000000000";

const HARDWARE_SERVICES = [
  { icon: Monitor,     title: "إصلاح الشاشات",       desc: "استبدال شاشات مكسورة أو ميتة — أصلية 100%",      price: "يبدأ من 300 ج.م" },
  { icon: Battery,     title: "استبدال البطاريات",    desc: "بطاريات أصلية لجميع ماركات الموبايل",             price: "يبدأ من 150 ج.م" },
  { icon: HardDrive,   title: "إصلاح البوردات",       desc: "لحام ميكروسكوبي وإصلاح دوائر البوردة الأم",       price: "يبدأ من 200 ج.م" },
  { icon: Smartphone,  title: "إصلاح الكاميرات",      desc: "استبدال كاميرات أمامية وخلفية لجميع الطرازات",    price: "يبدأ من 200 ج.م" },
  { icon: Wrench,      title: "إصلاح مشاكل الصوت",   desc: "سماعة أذن، سماعة داخلية، ميكروفون",               price: "يبدأ من 100 ج.م" },
  { icon: ShieldCheck, title: "تنظيف وصيانة دورية",  desc: "تنظيف شامل من الداخل لتحسين الأداء",              price: "يبدأ من 80 ج.م" },
];

const SOFTWARE_SERVICES = [
  { icon: HardDrive,  title: "فلاش وتحديث النظام",  desc: "تحديث iOS / Android وإعادة تهيئة الجهاز" },
  { icon: Wifi,       title: "فتح الشبكات",          desc: "فتح الشبكة لجميع الشبكات المحلية والدولية" },
  { icon: ShieldCheck,title: "إزالة بصمة الشاشة",   desc: "إزالة Pattern / PIN / بصمة الإصبع" },
  { icon: Monitor,    title: "إزالة حساب iCloud",    desc: "إزالة حساب Apple ID المنسي" },
  { icon: HardDrive,  title: "استرداد البيانات",     desc: "استرداد الصور والملفات المحذوفة" },
  { icon: Smartphone, title: "تركيب التطبيقات",      desc: "تركيب التطبيقات المدفوعة وتحديثها" },
];

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Oppo", "Vivo", "Huawei", "Realme", "Tecno", "Infinix", "جميع الماركات"];

interface FormData {
  name: string; phone: string; device: string; issue: string;
}

export default function MaintenancePage() {
  const [form, setForm]       = useState<FormData>({ name: "", phone: "", device: "", issue: "" });
  const [errors, setErrors]   = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim())  e.name  = "الاسم مطلوب";
    if (!form.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    if (!form.device.trim()) e.device = "نوع الجهاز مطلوب";
    if (!form.issue.trim()) e.issue = "وصف المشكلة مطلوب";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleWhatsApp = () => {
    if (!validate()) return;
    const msg = `🔧 *طلب صيانة — الغلبان*\n\n` +
                `👤 الاسم: ${form.name}\n` +
                `📱 الهاتف: ${form.phone}\n` +
                `📱 الجهاز: ${form.device}\n` +
                `🔧 المشكلة: ${form.issue}\n\n` +
                `أرجو التواصل لتحديد موعد الصيانة.`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    toast.success("تم إرسال طلب الصيانة على واتساب!");
  };

  const field = (key: keyof FormData, label: string, type: string, placeholder: string, isTextarea = false) => (
    <div key={key}>
      <label className="block text-sm font-bold text-silver-700 mb-1.5">{label}</label>
      {isTextarea ? (
        <textarea
          value={form[key]}
          onChange={(e) => { setForm((p) => ({ ...p, [key]: e.target.value })); if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined })); }}
          placeholder={placeholder}
          rows={4}
          className={`input-field resize-none ${errors[key] ? "border-red-400" : ""}`}
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={(e) => { setForm((p) => ({ ...p, [key]: e.target.value })); if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined })); }}
          placeholder={placeholder}
          className={`input-field ${errors[key] ? "border-red-400" : ""}`}
        />
      )}
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-silver-50">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Wrench size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-3xl">خدمات الصيانة 🔧</h1>
              <p className="text-emerald-200 text-sm mt-1">
                إصلاح احترافي بضمان — هاردوير وسوفتوير لجميع الماركات
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* ── Trust Badges ─────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: ShieldCheck, label: "ضمان على الإصلاح",  value: "3 أشهر" },
            { icon: Clock,       label: "وقت الإصلاح",        value: "نفس اليوم" },
            { icon: CheckCircle, title:"قطع غيار أصلية",      value: "100% أصلية" },
            { icon: Smartphone,  label: "ماركات مدعومة",      value: "+10 ماركة" },
          ].map(({ icon: Icon, label, value }, i) => (
            <div key={i} className="card p-4 text-center">
              <Icon size={28} className="text-emerald-500 mx-auto mb-2" />
              <p className="font-black text-silver-800 text-lg">{value}</p>
              <p className="text-silver-400 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Hardware Services ────────────────────────────── */}
        <div>
          <h2 className="section-title">🔩 إصلاح الهاردوير</h2>
          <p className="section-subtitle">خدمات إصلاح المكونات المادية للجهاز</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HARDWARE_SERVICES.map(({ icon: Icon, title, desc, price }) => (
              <div key={title} className="card p-5 card-lift flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-silver-800">{title}</h3>
                  <p className="text-silver-500 text-xs mt-1 leading-relaxed">{desc}</p>
                  <span className="inline-block mt-2 text-emerald-600 font-black text-sm bg-emerald-50 px-2 py-0.5 rounded-lg">
                    {price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Software Services ────────────────────────────── */}
        <div>
          <h2 className="section-title">💻 خدمات السوفتوير</h2>
          <p className="section-subtitle">برمجة وفتح شبكات وحلول النظام</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOFTWARE_SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-5 card-lift flex gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-sky-600" />
                </div>
                <div>
                  <h3 className="font-bold text-silver-800">{title}</h3>
                  <p className="text-silver-500 text-xs mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Supported Brands ─────────────────────────────── */}
        <div>
          <h2 className="section-title">📱 الماركات المدعومة</h2>
          <div className="flex flex-wrap gap-3">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="bg-white border-2 border-silver-200 text-silver-700 font-bold
                           px-4 py-2 rounded-xl text-sm hover:border-sky-300 hover:text-sky-600
                           transition-all duration-200"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* ── Booking Section ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="card p-6">
            <h2 className="font-black text-silver-900 text-xl mb-1">احجز موعد صيانة 📅</h2>
            <p className="text-silver-400 text-sm mb-6">أرسل تفاصيل جهازك وسنتواصل معك فوراً</p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <p className="font-black text-silver-800 text-lg">تم إرسال طلبك!</p>
                <p className="text-silver-500 text-sm">سيتواصل معك فريقنا قريباً</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", device: "", issue: "" }); }} className="btn-secondary text-sm">
                  إرسال طلب آخر
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {field("name",   "الاسم الكامل *",       "text", "مثال: محمد أحمد")}
                {field("phone",  "رقم الهاتف *",          "tel",  "01XXXXXXXXX")}
                {field("device", "نوع الجهاز والطراز *",  "text", "مثال: iPhone 14 Pro")}
                {field("issue",  "وصف المشكلة *",          "text", "اشرح المشكلة بالتفصيل...", true)}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2
                               bg-green-500 hover:bg-green-600 text-white font-black
                               py-3.5 rounded-xl transition-all duration-200 shadow-md"
                  >
                    <MessageCircle size={20} />
                    إرسال عبر واتساب
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Direct Contact */}
          <div className="space-y-5">
            <div className="card p-6 bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
              <h3 className="font-black text-sky-800 text-lg mb-4">تواصل مباشر 📞</h3>
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-500 hover:bg-green-600
                             text-white font-bold py-3 px-4 rounded-xl transition-all
                             duration-200 hover:scale-[1.02]"
                >
                  <MessageCircle size={20} />
                  واتساب — تواصل الآن
                </a>
                <a
                  href={`tel:+${WHATSAPP}`}
                  className="flex items-center gap-3 bg-white hover:bg-sky-50
                             text-sky-700 font-bold py-3 px-4 rounded-xl border-2 border-sky-200
                             transition-all duration-200 hover:border-sky-400"
                >
                  <Phone size={20} />
                  اتصل بنا
                </a>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-black text-silver-800 mb-3">أوقات العمل 🕐</h3>
              <div className="space-y-2">
                {[
                  { day: "السبت — الخميس", time: "10 صباحاً — 10 مساءً" },
                  { day: "الجمعة",          time: "2 ظهراً — 10 مساءً" },
                ].map(({ day, time }) => (
                  <div key={day} className="flex justify-between items-center text-sm">
                    <span className="font-bold text-silver-700">{day}</span>
                    <span className="text-sky-600 font-bold bg-sky-50 px-3 py-1 rounded-lg">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 bg-amber-50 border-amber-200">
              <p className="text-amber-700 font-bold text-sm flex items-start gap-2">
                <span className="text-2xl">⚡</span>
                <span>
                  خدمة الإصلاح السريع متاحة! كثير من الأعطال تُصلح في نفس اليوم.
                  تواصل معنا الآن للاستفسار.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
