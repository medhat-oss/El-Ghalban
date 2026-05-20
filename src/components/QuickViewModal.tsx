"use client";

import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Tag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ImageGallery from "./ImageGallery";
import type { ProductWithCategory } from "@/types";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductWithCategory | null;
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const { addItem, items } = useCart();
  const t = useTranslations("Store");
  const locale = useLocale();
  const isAr = locale === "ar";

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!product) return null;

  // Locale-aware text
  const productName = isAr ? product.nameAr : product.name;
  const productDescription = isAr
    ? (product.descriptionAr || product.description)
    : (product.description || product.descriptionAr);
  const categoryName = isAr ? product.category.nameAr : product.category.name;

  const added = items.some((item) => item.id === product.id);
  const primaryImage =
    product.images?.find((img) => img.isMain)?.url ??
    product.images?.[0]?.url ??
    "/placeholder.png";
  const oldPriceNum = product.oldPrice != null ? Number(product.oldPrice) : 0;
  const priceNum = product.price != null ? Number(product.price) : 0;
  const hasDiscount = oldPriceNum > priceNum;
  const discountPct = hasDiscount
    ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)
    : 0;

  // FIX 1: Close modal automatically after adding to cart
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
    onClose(); // ← closes the modal right after adding
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={isAr ? "إغلاق" : "Close"}
              className="absolute top-4 end-4 z-10 w-10 h-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left side — Product Image Gallery */}
            <div className="w-full md:w-[45%] p-6 md:p-10 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border-e border-slate-100 dark:border-slate-800">
              <ImageGallery images={product.images || []} productName={productName} />
            </div>

            {/* Right side: Details */}
            <div className="w-full md:w-[55%] p-8 md:p-10 flex flex-col overflow-y-auto bg-white dark:bg-slate-900">
              {/* FIX 3: Locale-aware category & product name */}
              <span className="text-sky-500 text-sm font-bold uppercase tracking-wide mb-2 block">
                {categoryName}
              </span>

              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                {productName}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="text-sky-600 dark:text-sky-400 font-black text-3xl">
                  {product.price.toFixed(2)}
                  <span className="text-lg font-semibold text-slate-400 ms-1">{t("currency")}</span>
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-slate-400 text-lg line-through">
                      {oldPriceNum.toFixed(2)} {t("currency")}
                    </span>
                    <span className="bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Tag size={12} />
                      {t("discount")} {discountPct}%
                    </span>
                  </>
                )}
              </div>

              {/* FIX 3: Locale-aware description */}
              {productDescription && (
                <div className="mb-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                    {t("description")}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {productDescription}
                  </p>
                </div>
              )}

              {/* Add to cart */}
              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable || added}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-lg font-bold transition-all duration-300
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
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
