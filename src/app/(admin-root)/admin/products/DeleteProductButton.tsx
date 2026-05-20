"use client";
// El-Ghalban | DeleteProductButton.tsx

import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props { id: string; name: string; }

export default function DeleteProductButton({ id, name }: Props) {
  const router  = useRouter();
  const [open, setOpen]     = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("تم حذف المنتج بنجاح");
        router.refresh();
      } else {
        toast.error(data.error ?? "فشل في حذف المنتج");
      }
    } catch {
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50
                   text-red-500 hover:bg-red-100 font-bold text-xs transition-all"
      >
        <Trash2 size={13} /> حذف
      </button>

      {/* Confirmation Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-fade-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-black text-silver-900 text-lg">حذف المنتج</h3>
                <p className="text-silver-500 text-sm mt-1 leading-relaxed">
                  هل أنت متأكد من حذف <span className="font-bold text-silver-800">{name}</span>؟
                  <br />هذا الإجراء لا يمكن التراجع عنه.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black
                           py-2.5 rounded-xl transition-all disabled:opacity-60"
              >
                {loading ? "جاري الحذف..." : "نعم، احذف"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 btn-secondary py-2.5"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
