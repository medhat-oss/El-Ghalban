"use client";
// El-Ghalban | OrderStatusBadge.tsx — Inline status updater

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const STATUSES: Record<string, { label: string; class: string }> = {
  PENDING:    { label: "قيد الانتظار",  class: "bg-amber-100 text-amber-700 border-amber-200" },
  CONFIRMED:  { label: "مؤكد",          class: "bg-sky-100 text-sky-700 border-sky-200" },
  PROCESSING: { label: "قيد التجهيز",   class: "bg-violet-100 text-violet-700 border-violet-200" },
  SHIPPED:    { label: "تم الشحن",      class: "bg-blue-100 text-blue-700 border-blue-200" },
  DELIVERED:  { label: "تم التسليم",    class: "bg-green-100 text-green-700 border-green-200" },
  CANCELLED:  { label: "ملغي",          class: "bg-red-100 text-red-600 border-red-200" },
};

export default function OrderStatusBadge({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router  = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: string) => {
    if (newStatus === status) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(newStatus);
        toast.success("تم تحديث حالة الطلب");
        router.refresh();
      } else {
        toast.error(data.error ?? "فشل التحديث");
      }
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const info = STATUSES[status] ?? { label: status, class: "bg-silver-100 text-silver-600 border-silver-200" };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer
                  transition-all duration-200 disabled:opacity-60 appearance-none
                  ${info.class}`}
    >
      {Object.entries(STATUSES).map(([val, { label }]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  );
}
