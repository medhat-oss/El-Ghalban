import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import { Tag } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import AddToCartButton from "./AddToCartButton";
import ProductDetailsSkeleton from "@/components/ProductDetailsSkeleton";

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: {
    locale: string;
    id: string;
  };
}

async function ProductData({ id, locale }: { id: string; locale: string }) {
  const t = await getTranslations("Store");

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, nameAr: true, slug: true } },
      images: { select: { id: true, url: true, isMain: true } },
    },
  });

  if (!product) {
    notFound();
  }

  const isAr = locale === "ar";
  const productName = isAr ? product.nameAr : product.name;
  const productDescription = isAr
    ? (product.descriptionAr || product.description)
    : (product.description || product.descriptionAr);
  const categoryName = isAr ? product.category.nameAr : product.category.name;

  const oldPriceNum = product.oldPrice != null ? Number(product.oldPrice) : 0;
  const priceNum = product.price != null ? Number(product.price) : 0;
  const hasDiscount = oldPriceNum > priceNum;
  const discountPct = hasDiscount
    ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)
    : 0;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
        <Link href="/" className="hover:text-sky-500 transition-colors">
          {isAr ? "الرئيسية" : "Home"}
        </Link>
        <span className="text-neutral-400 dark:text-neutral-600">/</span>
        <Link href={`/${product.category.slug}` as any} className="hover:text-sky-500 transition-colors uppercase">
          {categoryName}
        </Link>
        <span className="text-neutral-400 dark:text-neutral-600">/</span>
        <span className="text-slate-900 dark:text-slate-300 line-clamp-1">{productName}</span>
      </nav>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-apple-lg border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left side — Product Image Gallery */}
        <div className="w-full lg:w-1/2 p-6 lg:p-12 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-center border-e border-slate-100 dark:border-slate-800">
          <ImageGallery images={product.images || []} productName={productName} />
        </div>

        {/* Right side: Details */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col bg-white dark:bg-slate-900">
          <span className="text-sky-500 text-sm font-bold uppercase tracking-wide mb-3 block">
            {categoryName}
          </span>

          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-6">
            {productName}
          </h1>

          {/* Price section */}
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <span className="text-sky-600 dark:text-sky-400 font-black text-4xl">
              {product.price.toFixed(2)}
              <span className="text-xl font-bold text-neutral-500 dark:text-neutral-400 ms-2">{t("currency")}</span>
            </span>
            {hasDiscount && (
              <>
                <span className="text-neutral-500 dark:text-neutral-400 text-xl line-through decoration-neutral-300 dark:decoration-neutral-600">
                  {oldPriceNum.toFixed(2)} {t("currency")}
                </span>
                <span className="bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 px-3 py-1.5 rounded-xl text-sm font-black flex items-center gap-1">
                  <Tag size={16} />
                  {t("discount")} {discountPct}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {productDescription && (
            <div className="mb-10 prose prose-slate dark:prose-invert max-w-none">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                {t("description")}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">
                {productDescription}
              </p>
            </div>
          )}

          {/* Add to cart component */}
          <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
            <AddToCartButton 
              product={product as any} 
              primaryImage={product.images?.[0]?.url || "/placeholder.png"} 
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id, locale } = params;

  return (
    <div className="min-h-screen bg-silver-50 dark:bg-[#0f172a] py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<ProductDetailsSkeleton />}>
          <ProductData id={id} locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
