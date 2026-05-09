// ============================================================
// El-Ghalban | app/admin/products/new/page.tsx — Add Product
// ============================================================

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "إضافة منتج جديد" };

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { nameAr: "asc" } });
  } catch { return []; }
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-silver-500 dark:text-slate-400">
        <Link href="/admin/products" className="hover:text-sky-600 font-semibold flex items-center gap-1">
          <ArrowRight size={14} className="rotate-180" />
          إدارة المنتجات
        </Link>
        <span>/</span>
        <span className="text-silver-800 dark:text-slate-100 font-bold">إضافة منتج جديد</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-silver-900 dark:text-slate-100">إضافة منتج جديد ➕</h1>
        <p className="text-silver-500 dark:text-slate-400 text-sm mt-1">
          أضف منتجاً جديداً وسيظهر تلقائياً في الصفحة المناسبة
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800/50 rounded-2xl p-6">
          <p className="font-bold text-amber-800 dark:text-amber-500">⚠️ لا توجد فئات في قاعدة البيانات.</p>
          <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
            يرجى تشغيل <code className="bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded font-mono text-xs">npm run db:seed</code> أولاً لإضافة الفئات الافتراضية.
          </p>
        </div>
      ) : (
        <ProductForm categories={categories as never} mode="create" />
      )}
    </div>
  );
}
