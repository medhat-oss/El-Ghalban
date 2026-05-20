// ============================================================
// El-Ghalban | app/(store)/mobiles/page.tsx — Mobiles Page
// Server Component with client-side filter sidebar
// ============================================================
export const dynamic = 'force-dynamic';
import React from "react";
import { Smartphone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import MobilesFilter from "./MobilesFilter";
import type { ProductWithCategory } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "موبايلات",
  description: "تصفح أحدث الهواتف الذكية بأفضل الأسعار في مصر",
};

export const revalidate = 60; // ISR — revalidate every minute

interface MobilesPageProps {
  searchParams: { brand?: string; min?: string; max?: string; sort?: string };
}

async function getMobiles(filters: MobilesPageProps["searchParams"]): Promise<{
  products: ProductWithCategory[];
  brands: string[];
}> {
  try {
    // Get mobiles category
    const category = await prisma.category.findUnique({
      where: { slug: "mobiles" },
    });

    if (!category) return { products: [], brands: [] };

    const whereClause: Record<string, unknown> = {
      categoryId:  category.id,
      isAvailable: true,
    };

    if (filters.brand) whereClause.brand = filters.brand;
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
    const orderBy = orderByMap[filters.sort ?? "newest"] ?? { createdAt: "desc" };

    const [products, allBrands] = await Promise.all([
      prisma.product.findMany({
        where:   whereClause,
        include: { category: true, images: true },
        orderBy,
      }),
      prisma.product.findMany({
        where:  { categoryId: category.id, brand: { not: null } },
        select: { brand: true },
        distinct: ["brand"],
      }),
    ]);

    const brands = allBrands
      .map((p) => p.brand)
      .filter((b): b is string => Boolean(b))
      .sort();

    return {
      products: products as unknown as ProductWithCategory[],
      brands,
    };
  } catch {
    return { products: [], brands: [] };
  }
}

export default async function MobilesPage({ searchParams }: MobilesPageProps) {
  const { products, brands } = await getMobiles(searchParams);

  return (
    <div className="min-h-screen bg-silver-50 dark:bg-[#0f172a]">
      {/* ── Page Header ────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Smartphone size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-3xl">موبايلات 📱</h1>
              <p className="text-sky-200 text-sm mt-1">
                {products.length} منتج متاح — أفضل أسعار الهواتف في مصر
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
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Smartphone size={60} className="text-silver-200 dark:text-slate-700 mb-4" />
                <h3 className="font-black text-silver-600 dark:text-slate-100 text-xl">لا توجد منتجات</h3>
                <p className="text-silver-400 dark:text-slate-400 mt-2">جرّب تغيير معايير الفلتر</p>
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
