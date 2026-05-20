"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X, ShoppingCart, Trash2, Plus, Minus, Package,
  User, Phone, MapPin, MessageCircle, CheckCircle, ChevronLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { generateWhatsAppUrl, DELIVERY_FEE } from "@/lib/whatsapp";
import type { CustomerInfo } from "@/types";
import toast from "react-hot-toast";

type CheckoutStep = "cart" | "checkout" | "success";

const INITIAL_CUSTOMER: CustomerInfo = {
  name: "", phone: "", address: "", city: "", notes: "",
};

export default function Cart() {
  const { items, isOpen, itemCount, subtotal, total, closeCart,
          removeItem, updateQuantity, clearCart } = useCart();

  const [step, setStep]       = useState<CheckoutStep>("cart");
  const [customer, setCustomer] = useState<CustomerInfo>(INITIAL_CUSTOMER);
  const [errors, setErrors]   = useState<Partial<CustomerInfo>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => { 
        setStep("cart"); 
        setCustomer(INITIAL_CUSTOMER); 
        setErrors({}); 
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const validateCustomer = (): boolean => {
    const e: Partial<CustomerInfo> = {};
    if (!customer.name.trim())    e.name    = "الاسم مطلوب";
    if (!customer.phone.trim())   e.phone   = "رقم الهاتف مطلوب";
    else if (!/^[\d\s+\-()]{10,15}$/.test(customer.phone.trim()))
                                  e.phone   = "رقم هاتف غير صحيح";
    if (!customer.address.trim()) e.address = "العنوان مطلوب";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirmOrder = async () => {
    if (!validateCustomer()) return;
    setIsLoading(true);
    try {
      // 1. Save order to the database
      const payload = {
        customerName: customer.name,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        notes: customer.notes,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total,
        items,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save order");
      }

      // 2. Generate WhatsApp URL
      const url = generateWhatsAppUrl(
        { customer, items, subtotal, deliveryFee: DELIVERY_FEE, total },
        process.env.NEXT_PUBLIC_STORE_WHATSAPP
      );

      setStep("success");
      await new Promise((r) => setTimeout(r, 1200));
      window.open(url, "_blank", "noopener,noreferrer");
      clearCart();
      setTimeout(closeCart, 2000);
    } catch {
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: keyof CustomerInfo, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <>
      {/* 1. Backdrop المصلح باستخدام Tailwind */}
      <div
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* 2. Panel السلة */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 end-0 z-[70] w-full max-w-md bg-white dark:bg-slate-900 shadow-apple-lg flex flex-col border-s border-slate-200 dark:border-slate-800
                    transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${isOpen ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {step === "checkout" && (
              <button onClick={() => setStep("cart")} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                <ChevronLeft size={20} className="rotate-180" /> {/* تعديل اتجاه السهم للعربي */}
              </button>
            )}
            <div>
              <h2 className="font-black text-gray-900 text-lg">
                {step === "cart" && "سلة التسوق"}
                {step === "checkout" && "بيانات الشحن"}
                {step === "success" && "تم الطلب!"}
              </h2>
            </div>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-transform hover:rotate-90">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {step === "cart" && items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-6">
              <ShoppingCart size={48} className="text-gray-200" />
              <p className="font-bold text-gray-700">السلة فاضية يا غلبان!</p>
              <button onClick={closeCart} className="bg-sky-600 text-white px-6 py-2 rounded-full">ابدأ التسوق</button>
            </div>
          )}

          {step === "cart" && items.length > 0 && (
             <ul className="divide-y divide-gray-50 px-4">
               {items.map((item) => (
                 <li key={item.id} className="py-4 flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="relative w-20 h-20 bg-gray-50 rounded-xl border overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.nameAr} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 line-clamp-1">{item.nameAr}</h3>
                      <p className="text-sky-600 font-black mt-1">{item.price} ج.م</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border rounded-lg flex items-center justify-center">-</button>
                        <span className="font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border rounded-lg flex items-center justify-center">+</button>
                        <button onClick={() => removeItem(item.id)} className="mr-auto text-red-400"><Trash2 size={16}/></button>
                      </div>
                    </div>
                 </li>
               ))}
             </ul>
          )}

          {step === "checkout" && (
            <div className="p-6 space-y-5">
               {/* الحقول الخاصة ببيانات العميل */}
               <div className="space-y-4">
                  <input 
                    placeholder="الاسم بالكامل" 
                    className={`w-full p-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/50 rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-300 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    value={customer.name}
                  />
                  {errors.name && <span className="text-red-500 text-xs px-2">{errors.name}</span>}
                  
                  <input 
                    placeholder="رقم الموبايل" 
                    className={`w-full p-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/50 rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-300 ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    value={customer.phone}
                  />
                  {errors.phone && <span className="text-red-500 text-xs px-2">{errors.phone}</span>}
                  
                  <textarea 
                    placeholder="العنوان بالتفصيل" 
                    className={`w-full p-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/50 rounded-2xl outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-300 min-h-[120px] resize-none ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                    onChange={(e) => handleFieldChange("address", e.target.value)}
                    value={customer.address}
                  />
                  {errors.address && <span className="text-red-500 text-xs px-2">{errors.address}</span>}
               </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-xl font-bold">زي الفل!</h3>
              <p className="text-gray-500 mt-2">بنحولك للواتساب عشان تأكد الطلب مع الغلبان..</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && step !== "success" && (
          <div className="p-5 border-t space-y-4 bg-gray-50/50">
            <div className="flex justify-between items-center font-black text-lg">
              <span>الإجمالي:</span>
              <span className="text-sky-600">{total} ج.م</span>
            </div>
            <button
              onClick={() => step === "cart" ? setStep("checkout") : handleConfirmOrder()}
              disabled={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "جاري المعالجة..." : step === "cart" ? "متابعة الطلب" : "تأكيد الطلب عبر واتساب"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}