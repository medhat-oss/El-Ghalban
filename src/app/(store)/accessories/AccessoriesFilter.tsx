"use client";
// El-Ghalban | Accessories Filter Sidebar

import React, { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";

interface Props {
  currentMin?: string;
  currentMax?: string;
  currentSort?: string;
  currentSub?: string;
}

const SORT_OPTIONS = [
  { value: "newest",    label: "الأحدث أولاً" },
  { value: "featured",  label: "المميز أولاً" },
  { value: "price_asc", label: "السعر: من الأقل" },
  { value: "price_desc",label: "السعر: من الأعلى" },
];

export default function AccessoriesFilter({ currentMin, currentMax, currentSort, currentSub }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(currentMin ?? "");
  const [maxPrice, setMaxPrice] = useState(currentMax ?? "");
  const [sortBy, setSortBy]     = useState(currentSort ?? "newest");

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
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-silver-100 dark:border-slate-700">
      <button
        className="w-full flex items-center justify-between p-4"
        onClick={() => setIsOpen((v) => !v)}
      >
        <div className="flex items-center gap-2 font-black text-silver-800 dark:text-slate-100">
          <SlidersHorizontal size={18} className="text-violet-500" />
          تصفية
          {hasActive && <span className="w-2 h-2 rounded-full bg-violet-500" />}
        </div>
        <ChevronDown size={18} className={`text-silver-400 dark:text-slate-400 transition-transform lg:hidden ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-300 lg:!max-h-none lg:!opacity-100
                       ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 space-y-4 border-t border-silver-100 dark:border-slate-700 pt-4">
          <div>
            <label className="block text-xs font-bold text-silver-500 dark:text-slate-300 uppercase tracking-wide mb-2">ترتيب</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field py-2 text-sm">
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-silver-500 dark:text-slate-300 uppercase tracking-wide mb-2">نطاق السعر (ج.م)</label>
            <div className="flex items-center gap-2">
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="من" min="0" className="input-field py-2 text-sm text-center" />
              <span className="text-silver-400 dark:text-slate-400 flex-shrink-0">—</span>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="إلى" min="0" className="input-field py-2 text-sm text-center" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={applyFilters} disabled={isPending} className="btn-primary flex-1 py-2.5 text-sm">
              {isPending ? "..." : "تطبيق"}
            </button>
            {hasActive && (
              <button onClick={resetFilters} disabled={isPending} className="btn-secondary px-3 py-2.5">
                <RotateCcw size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
