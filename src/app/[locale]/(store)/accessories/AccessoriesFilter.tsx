"use client";
// El-Ghalban | Accessories Filter Sidebar

import React, { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";

interface Props {
  currentMin?: string;
  currentMax?: string;
  currentSort?: string;
  currentSub?: string;
}

export default function AccessoriesFilter({ currentMin, currentMax, currentSort, currentSub }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const locale   = useLocale();
  const isEn     = locale === 'en';
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(currentMin ?? "");
  const [maxPrice, setMaxPrice] = useState(currentMax ?? "");
  const [sortBy, setSortBy]     = useState(currentSort ?? "newest");

  const SORT_OPTIONS = [
    { value: "newest",    label: isEn ? "Latest" : "الأحدث أولاً" },
    { value: "featured",  label: isEn ? "Featured" : "المميز أولاً" },
    { value: "price_asc", label: isEn ? "Price: Low to High" : "السعر: من الأقل" },
    { value: "price_desc",label: isEn ? "Price: High to Low" : "السعر: من الأعلى" },
  ];

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (currentSub) params.set("sub", currentSub);
    if (minPrice)   params.set("min", minPrice);
    if (maxPrice)   params.set("max", maxPrice);
    if (sortBy)     params.set("sort", sortBy);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const resetFilters = () => {
    setMinPrice(""); setMaxPrice(""); setSortBy("newest");
    startTransition(() => router.push(pathname));
  };

  const hasActive = Boolean(currentMin || currentMax || (currentSort && currentSort !== "newest"));

  return (
    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl backdrop-blur-md" dir={isEn ? 'ltr' : 'rtl'}>
      <button
        className="w-full flex items-center justify-between p-4"
        onClick={() => setIsOpen((v) => !v)}
      >
        <div className="flex items-center gap-2 font-black text-neutral-950 dark:text-neutral-50">
          <SlidersHorizontal size={18} className="text-neutral-500 dark:text-neutral-400" />
          {isEn ? "Filters" : "تصفية"}
          {hasActive && <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100" />}
        </div>
        <ChevronDown size={18} className={`text-neutral-500 dark:text-neutral-400 transition-transform lg:hidden ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-300 lg:!max-h-none lg:!opacity-100
                       ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 space-y-4 border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <div>
            <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">{isEn ? "Sort By" : "ترتيب حسب"}</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="w-full bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-sm focus:border-neutral-500 outline-none transition-colors appearance-none"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">{isEn ? "Price Range (EGP)" : "نطاق السعر (ج.م)"}</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)} 
                placeholder={isEn ? "Min" : "من"} 
                min="0" 
                className="w-full bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 rounded-xl px-2 py-2 text-sm text-center placeholder-neutral-400 focus:border-neutral-500 outline-none transition-colors" 
              />
              <span className="text-neutral-500 dark:text-neutral-400 font-bold flex-shrink-0">—</span>
              <input 
                type="number" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)} 
                placeholder={isEn ? "Max" : "إلى"} 
                min="0" 
                className="w-full bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 rounded-xl px-2 py-2 text-sm text-center placeholder-neutral-400 focus:border-neutral-500 outline-none transition-colors" 
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={applyFilters} disabled={isPending} className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 font-medium rounded-xl flex-1 py-2.5 text-sm transition-all hover:opacity-90 active:scale-[0.98]">
              {isPending ? (isEn ? "Applying..." : "...") : (isEn ? "Apply" : "تطبيق")}
            </button>
            {hasActive && (
              <button onClick={resetFilters} disabled={isPending} className="bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-xl px-3 py-2.5 transition-all border border-transparent active:scale-[0.98]" aria-label={isEn ? "Reset Filters" : "إعادة تعيين الفلاتر"}>
                <RotateCcw size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
