"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingCart, Check } from "lucide-react";
import toast from "react-hot-toast";

interface AddToCartButtonProps {
  product: any;
  primaryImage: string;
}

export default function AddToCartButton({ product, primaryImage }: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const t = useTranslations("Store");
  const locale = useLocale();
  const isAr = locale === "ar";
  
  const added = items.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!product.isAvailable) return;
    addItem({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: primaryImage,
      quantity: 1,
      categorySlug: product.category.slug,
    });
    toast.success(
      isAr ? `تمت الإضافة: ${product.nameAr}` : `Added: ${product.name}`,
      { icon: "🛒" }
    );
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!product.isAvailable || added}
      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-lg font-black transition-all duration-300
        ${!product.isAvailable
          ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          : added
            ? "bg-green-500 text-white"
            : "bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-1"
        }`}
    >
      {!product.isAvailable ? (
        t("outOfStock")
      ) : added ? (
        <>
          <Check size={24} />
          {t("added")}
        </>
      ) : (
        <>
          <ShoppingCart size={24} />
          {t("addToCart")}
        </>
      )}
    </button>
  );
}
