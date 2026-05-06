// ============================================================
// El-Ghalban | app/(store)/accessories/page.tsx
// ============================================================

import React from "react";
import { Headphones } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import AccessoriesFilter from "./AccessoriesFilter";
import type { ProductWithCategory } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إكسسوارات",
  description: "سماعات، شواحن، باور بانك، وأكثر — أفضل إكسسوارات الموبايلات",
};

export const revalidate = 60;

const SUBCATEGORIES = [
  { value: "",            label: "الكل",         emoji: "✨" },
  { value: "سماعات",      label: "سماعات",        emoji: "🎧" },
  { value: "باور بانك",   label: "باور بانك",     emoji: "🔋" },
  { value: "شواحن",       label: "شواحن",         emoji: "⚡" },
  { value: "كفرات",       label: "كفرات وحماية",  emoji: "🛡️" },
  { value: "كابلات",      label: "كابلات",        emoji: "🔌" },
];

interface AccessoriesPageProps {
  searchParams: { sub?: string; min?: string; max?: string; sort?: string };
}

async function getAccessories(filters: AccessoriesPageProps["searchParams"]): Promise<ProductWithCategory[]> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: "accessories" },
    });
    if (!category) return [];

    const whereClause: Record<string, unknown> = {
      categoryId:  category.id,
      isAvailable: true,
    };

    // Subcategory: stored in the `model` field or brand
    if (filters.sub) whereClause.brand = filters.sub;
    if (filters.min || filters.max) {
      whereClause.price = {
        ...(filters.min ? { gte: parseFloat(filters.min) } : {}),
        ...(filters.max ? { lte: parseFloat(filters.max) } : {}),
      };
    }

    const orderByMap: Record<string, Record<string, string>> = {
      price_asc:  { price: "asc" },
      price_desc: { price: "desc" },
      newest:     { createdAt: "desc" },
      featured:   { isFeatured: "desc" },
    };

    const products = await prisma.product.findMany({
      where:   whereClause,
      include: { category: true },
      orderBy: orderByMap[filters.sort ?? "newest"] ?? { createdAt: "desc" },
    });

    return products as unknown as ProductWithCategory[];
  } catch {
    return [];
  }
}

export default async function AccessoriesPage({ searchParams }: AccessoriesPageProps) {
  const products = await getAccessories(searchParams);
  const currentSub = searchParams.sub ?? "";

  return (
    <div className="min-h-screen bg-silver-50">
      {/* ── Page Header ────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-violet-600 to-violet-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Headphones size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-3xl">إكسسوارات 🎧</h1>
              <p className="text-violet-200 text-sm mt-1">
                {products.length} منتج — سماعات، شواحن، باور بانك، وأكثر
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Subcategory Tabs ───────────────────────────────── */}
      <div className="bg-white border-b border-silver-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {SUBCATEGORIES.map(({ value, label, emoji }) => {
              const params = new URLSearchParams(
                value ? { sub: value, ...(searchParams.sort ? { sort: searchParams.sort } : {}) }
                       : (searchParams.sort ? { sort: searchParams.sort } : {})
              );
              return (
                <a
                  key={value}
                  href={`/accessories?${params.toString()}`}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold
                              whitespace-nowrap transition-all duration-200 flex-shrink-0
                              ${currentSub === value
                                ? "bg-violet-600 text-white shadow-md"
                                : "bg-silver-100 text-silver-600 hover:bg-violet-50 hover:text-violet-600"
                              }`}
                >
                  <span>{emoji}</span>
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <AccessoriesFilter
              currentMin={searchParams.min}
              currentMax={searchParams.max}
              currentSort={searchParams.sort}
              currentSub={currentSub}
            />
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Headphones size={60} className="text-silver-200 mb-4" />
                <h3 className="font-black text-silver-600 text-xl">لا توجد إكسسوارات</h3>
                <p className="text-silver-400 mt-2">جرّب تغيير معايير الفلتر</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
