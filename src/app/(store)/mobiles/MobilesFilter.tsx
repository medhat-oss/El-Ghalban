"use client";
// ============================================================
// El-Ghalban | app/(store)/mobiles/MobilesFilter.tsx
// Client-side filter sidebar using URL search params
// ============================================================

import React, { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";

interface MobilesFilterProps {
  brands:       string[];
  currentBrand?: string;
  currentMin?:   string;
  currentMax?:   string;
  currentSort?:  string;
}

const SORT_OPTIONS = [
  { value: "newest",     label: "الأحدث أولاً" },
  { value: "featured",   label: "المميز أولاً" },
  { value: "price_asc",  label: "السعر: من الأقل" },
  { value: "price_desc", label: "السعر: من الأعلى" },
];

export default function MobilesFilter({
  brands, currentBrand, currentMin, currentMax, currentSort,
}: MobilesFilterProps) {
  const router    = useRouter();
  const pathname  = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState(currentBrand ?? "");
  const [minPrice, setMinPrice]           = useState(currentMin ?? "");
  const [maxPrice, setMaxPrice]           = useState(currentMax ?? "");
  const [sortBy, setSortBy]               = useState(currentSort ?? "newest");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set("brand", selectedBrand);
    if (minPrice)      params.set("min",   minPrice);
    if (maxPrice)      params.set("max",   maxPrice);
    if (sortBy)        params.set("sort",  sortBy);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    setSelectedBrand(""); setMinPrice(""); setMaxPrice(""); setSortBy("newest");
    startTransition(() => { router.push(pathname); });
  };

  const hasActiveFilters = Boolean(currentBrand || currentMin || currentMax || (currentSort && currentSort !== "newest"));

  return (
    <div className="bg-white rounded-2xl shadow-card border border-silver-100">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between p-4 lg:cursor-default"
        onClick={() => setIsOpen((v) => !v)}
      >
        <div className="flex items-center gap-2 font-black text-silver-800">
          <SlidersHorizontal size={18} className="text-sky-500" />
          تصفية النتائج
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-sky-500" />
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-silver-400 transition-transform lg:hidden ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Filter Body */}
      <div className={`overflow-hidden transition-all duration-300 lg:!max-h-none lg:!opacity-100
                       ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 space-y-5 border-t border-silver-100 pt-4">

          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold text-silver-500 uppercase tracking-wide mb-2">
              ترتيب حسب
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-2 text-sm"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-silver-500 uppercase tracking-wide mb-2">
                الماركة
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedBrand("")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all
                              ${selectedBrand === ""
                                ? "border-sky-500 bg-sky-50 text-sky-600"
                                : "border-silver-200 text-silver-600 hover:border-sky-300"}`}
                >
                  الكل
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand === selectedBrand ? "" : brand)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all
                                ${selectedBrand === brand
                                  ? "border-sky-500 bg-sky-50 text-sky-600"
                                  : "border-silver-200 text-silver-600 hover:border-sky-300"}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-silver-500 uppercase tracking-wide mb-2">
              نطاق السعر (ج.م)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="من"
                min="0"
                className="input-field py-2 text-sm text-center"
              />
              <span className="text-silver-400 font-bold flex-shrink-0">—</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="إلى"
                min="0"
                className="input-field py-2 text-sm text-center"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={applyFilters}
              disabled={isPending}
              className="btn-primary flex-1 py-2.5 text-sm"
            >
              {isPending ? "جاري التطبيق..." : "تطبيق"}
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                disabled={isPending}
                className="btn-secondary px-3 py-2.5"
                aria-label="إعادة تعيين الفلاتر"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
