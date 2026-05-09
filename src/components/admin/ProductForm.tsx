"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Upload, X, Plus, Star, Eye, EyeOff,
  Package, DollarSign, Tag, Hash, Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import type { ProductFormData, Category } from "@/types";

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  categories:   Category[];
  productId?:   string;
  mode:         "create" | "edit";
}

const DEFAULT_FORM: ProductFormData = {
  name:          "",
  nameAr:         "",
  description:   "",
  descriptionAr: "",
  price:         0,
  oldPrice:      undefined,
  images:        [],
  isAvailable:   true,
  isFeatured:    false,
  stock:         0,
  brand:         "",
  model:         "",
  categoryId:    "",
};

// ── 1. نقل الـ Section ليكون خارج المكون (لمنع التقل) ──
const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-silver-100 shadow-card p-6">
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-silver-100">
      <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
        <Icon size={16} className="text-sky-600" />
      </div>
      <h3 className="font-black text-silver-800">{title}</h3>
    </div>
    {children}
  </div>
);

export default function ProductForm({ initialData, categories, productId, mode }: ProductFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<ProductFormData>({
    ...DEFAULT_FORM,
    ...initialData,
  });
  const [errors, setErrors]     = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Helpers ──
  const setField = useCallback((key: keyof ProductFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, [errors]);

  const validate = (): boolean => {
    const e: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.nameAr.trim())    e.nameAr    = "الاسم بالعربية مطلوب";
    if (!form.name.trim())      e.name      = "الاسم بالإنجليزية مطلوب";
    if (!form.categoryId)       e.categoryId = "الفئة مطلوبة";
    if (!form.price || form.price <= 0) e.price = "السعر يجب أن يكون أكبر من صفر";
    if (form.images.length === 0) e.images = "يجب إضافة صورة واحدة على الأقل";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Image Logic ──
  const uploadImage = useCallback(async (file: File) => {
    if (form.images.length >= 5) { toast.error("الحد الأقصى 5 صور"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setField("images", [...form.images, data.url]);
        toast.success("تم الرفع بنجاح ✅");
      }
    } catch {
      toast.error("حدث خطأ أثناء الرفع");
    } finally {
      setUploading(false);
    }
  }, [form.images, setField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { toast.error("يرجى تصحيح الأخطاء أولاً"); return; }
    setSaving(true);
    try {
      const url  = mode === "create" ? "/api/products" : `/api/products/${productId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if ((await res.json()).success) {
        toast.success(mode === "create" ? "تم إضافة المنتج بنجاح! 🎉" : "تم تحديث المنتج ✅");
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  // ── 2. نقل الـ Field ليكون داخل المكون لكن بتعريف ثابت ──
  const renderField = (label: string, keyName: keyof ProductFormData, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-bold text-silver-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[keyName] === null ? "" : ((form[keyName] as string | number) ?? "")}
        onChange={(e) => {
          let val: any = e.target.value;
          if (type === "number") {
            if (val === "") {
              val = keyName === "oldPrice" ? null : 0;
            } else {
              val = parseFloat(val) || 0;
            }
          }
          setField(keyName, val);
        }}
        placeholder={placeholder}
        className={`input-field ${errors[keyName] ? "border-red-400" : ""}`}
      />
      {errors[keyName] && <p className="text-red-500 text-xs mt-1">{errors[keyName]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* ── القسم 1: معلومات المنتج ── */}
      <Section icon={Package} title="معلومات المنتج">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("الاسم بالعربية *", "nameAr", "text", "مثال: آيفون 15 برو")}
          {renderField("الاسم بالإنجليزية *", "name", "text", "e.g. iPhone 15 Pro")}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-silver-700 mb-1.5">وصف المنتج (عربي)</label>
            <textarea
              value={form.descriptionAr ?? ""}
              onChange={(e) => setField("descriptionAr", e.target.value)}
              rows={3}
              className="input-field resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-silver-700 mb-1.5">وصف المنتج (English)</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              className="input-field resize-none"
            />
          </div>
        </div>
      </Section>

      {/* ── القسم 2: التصنيف والماركة ── */}
      <Section icon={Tag} title="التصنيف والماركة">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-silver-700 mb-1.5">الفئة *</label>
            <select
              value={form.categoryId}
              onChange={(e) => setField("categoryId", e.target.value)}
              className={`input-field ${errors.categoryId ? "border-red-400" : ""}`}
            >
              <option value="">— اختر الفئة —</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.nameAr}</option>)}
            </select>
          </div>
          {renderField("الماركة", "brand", "text", "مثال: Apple")}
          {renderField("الموديل", "model", "text", "مثال: A2896")}
        </div>
      </Section>

      {/* ── القسم 3: السعر والمخزون ── */}
      <Section icon={DollarSign} title="السعر والمخزون">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderField("السعر (ج.م) *", "price", "number", "0.00")}
          {renderField("السعر القديم", "oldPrice", "number", "0.00")}
          {renderField("الكمية", "stock", "number", "0")}
        </div>
      </Section>

      {/* ── القسم 4: الصور ── */}
      <Section icon={ImageIcon} title="صور المنتج">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${uploading ? "opacity-50" : "hover:bg-sky-50"}`}
        >
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => Array.from(e.target.files ?? []).forEach(uploadImage)} />
          <Upload size={32} className="mx-auto text-silver-300 mb-3" />
          <p className="font-bold text-silver-600">اسحب الصور هنا أو انقر للاختيار</p>
        </div>
        <div className="grid grid-cols-5 gap-3 mt-4">
          {form.images.map((url, index) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden border">
              <Image src={url} alt="img" fill className="object-cover" />
              <button type="button" onClick={() => setField("images", form.images.filter((_, i) => i !== index))} className="absolute top-1 end-1 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
            </div>
          ))}
        </div>
      </Section>

      {/* ── القسم 5: إعدادات الظهور ── */}
      <Section icon={Eye} title="إعدادات الظهور">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer">
            <input type="checkbox" checked={form.isAvailable} onChange={(e) => setField("isAvailable", e.target.checked)} className="w-5 h-5" />
            <div><p className="font-bold">متاح للبيع</p></div>
          </label>
          <label className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setField("isFeatured", e.target.checked)} className="w-5 h-5" />
            <div><p className="font-bold">منتج مميز ⭐</p></div>
          </label>
        </div>
      </Section>

      <div className="flex gap-4 pb-10">
        <button type="submit" disabled={saving || uploading} className="btn-primary flex-1 py-3.5">
          {saving ? "جاري الحفظ..." : "حفظ المنتج"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="btn-secondary px-8">إلغاء</button>
      </div>
    </form>
  );
}