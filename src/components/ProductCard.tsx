"use client";
// ============================================================
// El-Ghalban | components/ProductCard.tsx
// Reusable product card with Add-to-Cart functionality
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Star, Check, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { ProductWithCategory } from "@/types";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: ProductWithCategory;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const primaryImage = product.images?.[0] || "/placeholder.png";
  const hasDiscount  = product.oldPrice && product.oldPrice > product.price;
  const discountPct  = hasDiscount
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product.isAvailable) return;

    addItem({
      id:          product.id,
      name:        product.name,
      nameAr:      product.nameAr,
      price:       product.price,
      image:       primaryImage,
      quantity:    1,
      categorySlug: product.category.slug,
    });

    setAdded(true);
    toast.success(`تمت الإضافة: ${product.nameAr}`, {
      icon: "🛒",
    });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article
      className="card card-lift group flex flex-col h-full"
      aria-label={product.nameAr}
    >
      {/* ── Product Image ───────────────────────────────────── */}
      <div className="relative img-zoom-wrap bg-silver-50 aspect-square">
        <Image
          src={primaryImage}
          alt={product.nameAr}
          fill
          className="object-contain p-3 transition-transform duration-400"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2 start-2 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="badge-new flex items-center gap-1">
              <Star size={9} fill="white" /> مميز
            </span>
          )}
          {hasDiscount && (
            <span className="badge-sale flex items-center gap-1">
              <Tag size={9} /> خصم {discountPct}%
            </span>
          )}
          {!product.isAvailable && (
            <span className="badge-unavailable">غير متاح</span>
          )}
        </div>

        {/* Brand pill */}
        {product.brand && (
          <div className="absolute bottom-2 end-2">
            <span className="bg-white/90 backdrop-blur-sm border border-silver-200
                             text-silver-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {product.brand}
            </span>
          </div>
        )}
      </div>

      {/* ── Product Info ────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category chip */}
        <span className="text-sky-500 text-[11px] font-bold uppercase tracking-wide">
          {product.category.nameAr}
        </span>

        {/* Name */}
        <h3 className="font-bold text-silver-800 text-sm sm:text-base line-clamp-2 leading-snug flex-1">
          {product.nameAr}
        </h3>

        {/* Description */}
        {product.descriptionAr && (
          <p className="text-silver-400 text-xs line-clamp-2 leading-relaxed">
            {product.descriptionAr}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="text-sky-600 font-black text-lg price-tag">
            {product.price.toFixed(2)}
            <span className="text-xs font-semibold text-silver-400 me-1"> ج.م</span>
          </span>
          {hasDiscount && (
            <span className="text-silver-400 text-xs line-through price-tag">
              {product.oldPrice!.toFixed(2)} ج.م
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.isAvailable || added}
          aria-label={`إضافة ${product.nameAr} إلى السلة`}
          className={`w-full flex items-center justify-center gap-2
                      py-2.5 rounded-xl text-sm font-bold
                      transition-all duration-300 mt-1
                      ${!product.isAvailable
                        ? "bg-silver-100 text-silver-400 cursor-not-allowed"
                        : added
                          ? "bg-green-500 text-white shadow-none scale-95"
                          : "btn-primary"
                      }`}
        >
          {!product.isAvailable ? (
            "غير متاح حالياً"
          ) : added ? (
            <>
              <Check size={16} />
              تمت الإضافة
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              أضف للسلة
            </>
          )}
        </button>
      </div>
    </article>
  );
}
