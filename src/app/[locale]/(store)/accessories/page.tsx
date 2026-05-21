// ============================================================
// El-Ghalban | app/(store)/accessories/page.tsx
// Server Component with Suspense
// ============================================================
export const dynamic = 'force-dynamic';
import React, { Suspense } from "react";
import { Headphones } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import AccessoriesFilter from "./AccessoriesFilter";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import type { ProductWithCategory } from "@/types";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

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

async function getAccessoriesFiltersData(filters: AccessoriesPageProps["searchParams"]) {
  const category = await prisma.category.findUnique({
    where: { slug: "accessories" },
  });

  if (!category) return { count: 0, whereClause: {} };

  const whereClause: Record<string, any> = {
    categoryId: category.id,
    isAvailable: true,
  };

  if (filters.sub) whereClause.brand = filters.sub;
  if (filters.min || filters.max) {
    whereClause.price = {
      ...(filters.min ? { gte: parseFloat(filters.min) } : {}),
      ...(filters.max ? { lte: parseFloat(filters.max) } : {}),
    };
  }

  const count = await prisma.product.count({ where: whereClause });

  return { count, whereClause };
}

async function AccessoriesGridData({
  whereClause,
  sort,
  isEn,
}: {
  whereClause: Record<string, any>;
  sort?: string;
  isEn: boolean;
}) {
  const orderByMap: Record<string, Record<string, string>> = {
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    newest: { createdAt: "desc" },
    featured: { isFeatured: "desc" },
  };

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: { select: { id: true, name: true, nameAr: true, slug: true } },
      images: { select: { id: true, url: true, isMain: true } },
    },
    orderBy: orderByMap[sort ?? "newest"] ?? { createdAt: "desc" },
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Headphones size={60} className="text-silver-200 dark:text-slate-700 mb-4" />
        <h3 className="font-black text-silver-600 dark:text-slate-100 text-xl">
          {isEn ? "No accessories found" : "لا توجد إكسسوارات"}
        </h3>
        <p className="text-silver-400 dark:text-slate-400 mt-2">
          {isEn ? "Try changing the filter criteria" : "جرّب تغيير معايير الفلتر"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product as unknown as ProductWithCategory} />
      ))}
    </div>
  );
}

export default async function AccessoriesPage({ searchParams }: AccessoriesPageProps) {
  const currentSub = searchParams.sub ?? "";
  const locale = await getLocale();
  const isEn = locale === 'en';
  const { count, whereClause } = await getAccessoriesFiltersData(searchParams);

  return (
    <div className="min-h-screen bg-silver-50 dark:bg-[#0f172a]" dir={isEn ? 'ltr' : 'rtl'}>
      {/* ── Page Header ────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-violet-600 to-violet-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Headphones size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-3xl">{isEn ? "Accessories 🎧" : "إكسسوارات 🎧"}</h1>
              <p className="text-violet-200 text-sm mt-1">
                {count} {isEn ? "products — Headphones, chargers, power banks, and more" : "منتج — سماعات، شواحن، باور بانك، وأكثر"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Subcategory Tabs ───────────────────────────────── */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-silver-100 dark:border-slate-800 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {SUBCATEGORIES.map(({ value, label, emoji }) => {
              const displayLabel = isEn 
                ? (label === "الكل" ? "All" : label === "سماعات" ? "Audio" : label === "باور بانك" ? "Power Banks" : label === "شواحن" ? "Chargers" : label === "كفرات وحماية" ? "Cases" : label === "كابلات" ? "Cables" : label)
                : label;

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
                                  : "bg-silver-100 text-silver-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/50 dark:hover:text-violet-400"
                                }`}
                >
                  <span>{emoji}</span>
                  {displayLabel}
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
            <Suspense fallback={<ProductGridSkeleton />} key={JSON.stringify(searchParams)}>
              <AccessoriesGridData whereClause={whereClause} sort={searchParams.sort} isEn={isEn} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
