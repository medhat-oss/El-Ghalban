// ============================================================
// El-Ghalban | app/(store)/mobiles/page.tsx — Mobiles Page
// Server Component with client-side filter sidebar and Suspense
// ============================================================
export const dynamic = 'force-dynamic';
import React, { Suspense } from "react";
import { Smartphone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import MobilesFilter from "./MobilesFilter";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import type { ProductWithCategory } from "@/types";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "موبايلات",
  description: "تصفح أحدث الهواتف الذكية بأفضل الأسعار في مصر",
};

export const revalidate = 60; // ISR — revalidate every minute

interface MobilesPageProps {
  searchParams: { brand?: string; min?: string; max?: string; sort?: string };
}

async function getMobilesFiltersData(filters: MobilesPageProps["searchParams"]) {
  const category = await prisma.category.findUnique({
    where: { slug: "mobiles" },
  });

  if (!category) return { brands: [], count: 0, whereClause: {} };

  const whereClause: Record<string, any> = {
    categoryId: category.id,
    isAvailable: true,
  };

  if (filters.brand) whereClause.brand = filters.brand;
  if (filters.min || filters.max) {
    whereClause.price = {
      ...(filters.min ? { gte: parseFloat(filters.min) } : {}),
      ...(filters.max ? { lte: parseFloat(filters.max) } : {}),
    };
  }

  const [brandsQuery, count] = await Promise.all([
    prisma.product.findMany({
      where: { categoryId: category.id, brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  return {
    brands: brandsQuery
      .map((p) => p.brand)
      .filter((b): b is string => Boolean(b))
      .sort(),
    count,
    whereClause,
  };
}

async function MobilesGridData({
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

  const orderBy = orderByMap[sort ?? "newest"] ?? { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: { select: { id: true, name: true, nameAr: true, slug: true } },
      images: { select: { id: true, url: true, isMain: true } },
    },
    orderBy,
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Smartphone size={60} className="text-silver-200 dark:text-slate-700 mb-4" />
        <h3 className="font-black text-silver-600 dark:text-slate-100 text-xl">
          {isEn ? "No products found" : "لا توجد منتجات"}
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

export default async function MobilesPage({ searchParams }: MobilesPageProps) {
  const locale = await getLocale();
  const isEn = locale === 'en';
  const { brands, count, whereClause } = await getMobilesFiltersData(searchParams);

  return (
    <div className="min-h-screen bg-silver-50 dark:bg-[#0f172a]" dir={isEn ? 'ltr' : 'rtl'}>
      {/* ── Page Header ────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Smartphone size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-3xl">{isEn ? "Mobiles & Phones" : "موبايلات 📱"}</h1>
              <p className="text-sky-200 text-sm mt-1">
                {count} {isEn ? "products available — Best phone prices in Egypt" : "منتج متاح — أفضل أسعار الهواتف في مصر"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Area ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar Filters ─────────────────────────────── */}
          <aside className="lg:w-64 flex-shrink-0">
            <MobilesFilter
              brands={brands}
              currentBrand={searchParams.brand}
              currentMin={searchParams.min}
              currentMax={searchParams.max}
              currentSort={searchParams.sort}
            />
          </aside>

          {/* ── Product Grid ─────────────────────────────────── */}
          <div className="flex-1">
            <Suspense fallback={<ProductGridSkeleton />} key={JSON.stringify(searchParams)}>
              <MobilesGridData whereClause={whereClause} sort={searchParams.sort} isEn={isEn} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
