"use client";
// ============================================================
// El-Ghalban | components/ProductCard.tsx
// Reusable product card with Add-to-Cart, Quick View, i18n
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Star, Check, Tag, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { ProductWithCategory } from "@/types";
import toast from "react-hot-toast";
import QuickViewModal from "./QuickViewModal";
import { useTranslations, useLocale } from "next-intl";

interface ProductCardProps {
  product: ProductWithCategory;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const t = useTranslations("Store");
  const locale = useLocale();

  // Locale-aware product text
  const isAr = locale === "ar";
  const productName = isAr ? product.nameAr : product.name;
  const productDescription = isAr
    ? (product.descriptionAr || product.description)
    : (product.description || product.descriptionAr);
  const categoryName = isAr ? product.category.nameAr : product.category.name;

  // Prefer the image flagged as main; fall back to first image; then placeholder
  const primaryImage =
    product.images?.find((img) => img.isMain)?.url ??
    product.images?.[0]?.url ??
    "/placeholder.png";

  const [imgSrc, setImgSrc] = useState(primaryImage);

  const oldPriceNum = product.oldPrice != null ? Number(product.oldPrice) : 0;
  const priceNum    = product.price != null ? Number(product.price) : 0;
  const hasDiscount = oldPriceNum > priceNum;
  const discountPct = hasDiscount
    ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product.isAvailable) return;

    addItem({
      id:           product.id,
      name:         product.name,
      nameAr:       product.nameAr,
      price:        product.price,
      image:        primaryImage,
      quantity:     1,
      categorySlug: product.category.slug,
    });

    setAdded(true);
    toast.success(
      isAr ? `تمت الإضافة: ${product.nameAr}` : `Added: ${product.name}`,
      { icon: "🛒" }
    );
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] group flex flex-col h-full overflow-hidden transition-all duration-500 hover:shadow-apple-md hover:-translate-y-1 relative"
      aria-label={productName}
    >
      {/* ── Product Image ───────────────────────────────────── */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center overflow-hidden transition-colors duration-300">
        <Image
          src={imgSrc}
          alt={productName}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setImgSrc("/placeholder.png")}
        />

        {/* Quick View Button overlay */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setIsQuickViewOpen(true)}
            className="bg-white text-sky-600 hover:bg-sky-500 hover:text-white rounded-full px-4 py-2 shadow-lg translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 font-bold text-sm"
          >
            <Eye size={16} />
            <span>{t("quickView")}</span>
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5 z-10">
          {product.isFeatured && (
            <span className="bg-sky-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-sky-400 backdrop-blur-md">
              <Star size={10} fill="white" /> {t("featured_badge")}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-rose-400 backdrop-blur-md">
              <Tag size={10} /> {t("discount")} {discountPct}%
            </span>
          )}
          {!product.isAvailable && (
            <span className="bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {t("unavailable_badge")}
            </span>
          )}
        </div>

        {/* Brand pill */}
        {product.brand && (
          <div className="absolute bottom-2 end-2">
            <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-silver-200 dark:border-slate-700 text-silver-600 dark:text-silver-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {product.brand}
            </span>
          </div>
        )}
      </div>

      {/* ── Product Info ────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category chip */}
        <span className="text-sky-500 text-[11px] font-bold uppercase tracking-wide">
          {categoryName}
        </span>

        {/* Name */}
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base line-clamp-2 leading-snug flex-1">
          {productName}
        </h3>

        {/* Description */}
        {productDescription && (
          <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
            {productDescription}
          </p>
        )}

        {/* Price */}
        <div className="flex items-end gap-2 mt-auto pt-3">
          <span className="text-slate-900 dark:text-white font-black text-xl tracking-tight flex items-baseline gap-1">
            {product.price.toFixed(2)}
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("currency")}
            </span>
          </span>
          {hasDiscount && (
            <span className="text-slate-400 dark:text-slate-500 text-sm line-through font-medium mb-0.5">
              {oldPriceNum.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Container - Reveals smoothly */}
        <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 group-hover:mt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.isAvailable || added}
            aria-label={isAr ? `إضافة ${product.nameAr} إلى السلة` : `Add ${product.name} to cart`}
            className={`w-full flex items-center justify-center gap-2
                        py-2.5 rounded-xl text-sm font-bold border
                        transition-all duration-300
                        ${!product.isAvailable
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-transparent cursor-not-allowed"
                          : added
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-none scale-95"
                            : "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-500/20 hover:bg-sky-500 hover:text-white hover:border-sky-500 shadow-sm"
                        }`}
          >
            {!product.isAvailable ? (
              t("outOfStockFull")
            ) : added ? (
              <>
                <Check size={16} />
                {t("added")}
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                {t("addToCart")}
              </>
            )}
          </button>
        </div>
      </div>

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={product}
      />
    </article>
  );
}
