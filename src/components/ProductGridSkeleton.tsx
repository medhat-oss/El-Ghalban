import React from "react";

export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] flex flex-col h-full overflow-hidden animate-pulse">
          <div className="relative w-full aspect-square bg-slate-200 dark:bg-slate-800/50" />
          <div className="flex flex-col flex-1 p-4 gap-3">
            <div className="w-16 h-3 bg-slate-200 dark:bg-slate-800/50 rounded-full" />
            <div className="w-full h-4 bg-slate-200 dark:bg-slate-800/50 rounded-full" />
            <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800/50 rounded-full" />
            <div className="mt-auto pt-3">
              <div className="w-1/2 h-6 bg-slate-200 dark:bg-slate-800/50 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
