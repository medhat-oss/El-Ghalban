// ============================================================
// El-Ghalban | app/admin/orders/page.tsx — Orders List
// ============================================================

import React from "react";
import { prisma } from "@/lib/prisma";
import OrderStatusBadge from "./OrderStatusBadge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "الطلبات" };
export const revalidate = 0;

async function getOrders() {
  try {
    return await prisma.order.findMany({ 
      include: { 
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: "desc" } 
    });
  } catch { return []; }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const totalRevenue = orders
    .filter((o) => ["CONFIRMED", "DELIVERED", "SHIPPED"].includes(o.status))
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-silver-900 dark:text-slate-100">الطلبات 🛍️</h1>
          <p className="text-silver-500 dark:text-slate-400 text-sm mt-1">{orders.length} طلب إجمالي</p>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-2xl px-5 py-3 text-center">
          <p className="text-sky-600 font-black text-xl">{totalRevenue.toFixed(2)} ج.م</p>
          <p className="text-sky-400 text-xs font-semibold">إجمالي الإيرادات</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-silver-100 dark:border-slate-700 shadow-card p-16 text-center">
          <p className="text-silver-400 dark:text-slate-400 text-lg font-bold">لا توجد طلبات بعد</p>
          <p className="text-silver-300 dark:text-slate-500 text-sm mt-1">ستظهر الطلبات هنا بعد استلامها عبر واتساب</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-silver-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-silver-50 dark:bg-slate-700 border-b border-silver-100 dark:border-slate-600">
                <tr>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">رقم الطلب</th>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">العميل</th>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">الهاتف</th>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">المنتجات</th>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">الإجمالي</th>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">الحالة</th>
                  <th className="px-4 py-3 text-right font-black text-silver-600 dark:text-slate-300">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-silver-50 dark:divide-slate-700">
                {orders.map((order: any) => {
                  return (
                    <tr key={order.id} className="hover:bg-silver-50/50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-silver-100 dark:bg-slate-700 text-silver-600 dark:text-slate-300 px-2 py-1 rounded-lg">
                          {order.orderNumber.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-silver-800 dark:text-slate-100">{order.customerName}</p>
                        <p className="text-silver-400 dark:text-slate-400 text-xs truncate max-w-[140px]">{order.address}</p>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`tel:${order.phone}`} className="text-sky-600 font-semibold hover:underline" dir="ltr">
                          {order.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-silver-700 dark:text-slate-300 text-xs leading-relaxed max-w-[180px]">
                          {order.items.slice(0, 2).map((item: any) => `${item.product.nameAr} (${item.quantity})`).join("، ")}
                          {order.items.length > 2 && ` و${order.items.length - 2} أخرى`}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-black text-sky-600">{order.total.toFixed(2)} ج.م</span>
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge orderId={order.id} currentStatus={order.status} />
                      </td>
                      <td className="px-4 py-3 text-silver-400 text-xs whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                          day:   "numeric",
                          month: "short",
                          year:  "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
