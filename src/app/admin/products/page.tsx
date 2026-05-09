// ============================================================
// El-Ghalban | app/admin/products/page.tsx — Products List
// Server component with inline client delete button
// ============================================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PlusCircle, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "./DeleteProductButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "إدارة المنتجات" };
export const revalidate = 0;

async function getProducts() {
  try {
    return await prisma.product.findMany({
      include:  { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch { return []; }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { nameAr: "asc" } });
  } catch { return []; }
}

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-silver-900 dark:text-slate-100">إدارة المنتجات 📦</h1>
          <p className="text-silver-500 dark:text-slate-400 text-sm mt-1">{products.length} منتج في المتجر</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm">
          <PlusCircle size={17} />
          إضافة منتج
        </Link>
      </div>

      {/* Categories summary */}
      <div className="flex flex-wrap gap-3">
        <span className="bg-silver-100 text-silver-700 font-bold text-sm px-4 py-1.5 rounded-full">
          الكل: {products.length}
        </span>
        {categories.map((cat) => (
          <span key={cat.id} className="bg-sky-50 text-sky-700 font-bold text-sm px-4 py-1.5 rounded-full border border-sky-200">
            {cat.nameAr}: {products.filter((p) => p.categoryId === cat.id).length}
          </span>
        ))}
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-silver-100 dark:border-slate-700 shadow-card p-16 text-center">
          <p className="text-silver-400 dark:text-slate-400 text-lg font-bold">لا توجد منتجات بعد</p>
          <Link href="/admin/products/new" className="btn-primary mt-4 inline-flex items-center gap-2">
            <PlusCircle size={17} /> أضف أول منتج
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-silver-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-silver-50 dark:bg-slate-700 border-b border-silver-100 dark:border-slate-600">
                <tr>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">المنتج</th>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">الفئة</th>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">السعر</th>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">المخزون</th>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">الحالة</th>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-silver-50 dark:divide-slate-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-silver-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-silver-100 dark:bg-slate-700 flex-shrink-0 border border-silver-200 dark:border-slate-600">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.nameAr}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-silver-300 dark:text-slate-500 text-xl">📦</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-silver-800 dark:text-slate-100 truncate max-w-[180px]">{product.nameAr}</p>
                          {product.brand && <p className="text-silver-400 dark:text-slate-400 text-xs">{product.brand}</p>}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="bg-sky-50 text-sky-700 font-bold text-xs px-2.5 py-1 rounded-full">
                        {(product as { category: { nameAr: string } }).category.nameAr}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <p className="font-black text-sky-600">{product.price.toFixed(2)} ج.م</p>
                      {product.oldPrice && (
                        <p className="text-silver-400 text-xs line-through">{product.oldPrice.toFixed(2)}</p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span className={`font-bold text-sm ${product.stock > 5 ? "text-green-600" : product.stock > 0 ? "text-amber-600" : "text-red-500"}`}>
                        {product.stock}
                      </span>
                    </td>

                    {/* Availability */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full w-fit
                          ${product.isAvailable ? "bg-green-100 text-green-700" : "bg-silver-100 text-silver-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${product.isAvailable ? "bg-green-500" : "bg-silver-400"}`} />
                          {product.isAvailable ? "متاح" : "غير متاح"}
                        </span>
                        {product.isFeatured && (
                          <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 w-fit">
                            ⭐ مميز
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50
                                     text-sky-600 hover:bg-sky-100 font-bold text-xs transition-all"
                        >
                          <Pencil size={13} /> تعديل
                        </Link>
                        <DeleteProductButton id={product.id} name={product.nameAr} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
