import React from "react";

export default function ProductDetailsSkeleton() {
  return (
    <>
      <div className="w-48 h-4 bg-slate-200 dark:bg-slate-800/50 rounded-full mb-8 animate-pulse" />
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-apple-lg border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row animate-pulse">
        <div className="w-full lg:w-1/2 p-6 lg:p-12 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-center border-e border-slate-100 dark:border-slate-800">
          <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800/50 rounded-xl" />
        </div>
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col bg-white dark:bg-slate-900">
          <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800/50 rounded-full mb-3" />
          <div className="w-3/4 h-10 bg-slate-200 dark:bg-slate-800/50 rounded-xl mb-6" />
          <div className="w-1/3 h-10 bg-slate-200 dark:bg-slate-800/50 rounded-xl mb-8" />
          <div className="space-y-3 mb-10">
            <div className="w-full h-4 bg-slate-200 dark:bg-slate-800/50 rounded-full" />
            <div className="w-full h-4 bg-slate-200 dark:bg-slate-800/50 rounded-full" />
            <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800/50 rounded-full" />
            <div className="w-4/6 h-4 bg-slate-200 dark:bg-slate-800/50 rounded-full" />
          </div>
          <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="w-full h-12 bg-slate-200 dark:bg-slate-800/50 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}
