// ============================================================
// El-Ghalban | app/admin/products/[id]/edit/page.tsx
// ============================================================
export const dynamic = 'force-dynamic';
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import type { Metadata } from "next";

interface EditProductPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    return { title: `تعديل: ${product?.nameAr ?? "منتج"}` };
  } catch {
    return { title: "تعديل المنتج" };
  }
}

async function getProductAndCategories(id: string) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { nameAr: "asc" } }),
  ]);
  return { product, categories };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { product, categories } = await getProductAndCategories(params.id);

  if (!product) notFound();

  const initialData = {
    name:          product.name,
    nameAr:        product.nameAr,
    description:   product.description ?? "",
    descriptionAr: product.descriptionAr ?? "",
    price:         product.price,
    oldPrice:      product.oldPrice ?? undefined,
    images:        product.images,
    isAvailable:   product.isAvailable,
    isFeatured:    product.isFeatured,
    stock:         product.stock,
    brand:         product.brand ?? "",
    model:         product.model ?? "",
    categoryId:    product.categoryId,
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-silver-500">
        <Link href="/admin/products" className="hover:text-sky-600 font-semibold flex items-center gap-1">
          <ArrowRight size={14} className="rotate-180" />
          إدارة المنتجات
        </Link>
        <span>/</span>
        <span className="text-silver-800 font-bold truncate max-w-xs">{product.nameAr}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-silver-900">تعديل المنتج ✏️</h1>
        <p className="text-silver-500 text-sm mt-1">
          تعديل بيانات: <span className="font-bold text-silver-700">{product.nameAr}</span>
        </p>
      </div>

      <ProductForm
        initialData={initialData}
        categories={categories as never}
        productId={product.id}
        mode="edit"
      />
    </div>
  );
}
