// ============================================================
// El-Ghalban | app/admin/page.tsx — Dashboard Home
// Server component with stats cards
// ============================================================

import React from "react";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, PlusCircle, Eye, Smartphone, Headphones } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "الرئيسية" };

async function getDashboardStats() {
  try {
    const [
      totalProducts,
      availableProducts,
      featuredProducts,
      totalOrders,
      pendingOrders,
      mobilesCount,
      accessoriesCount,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isAvailable: true } }),
      prisma.product.count({ where: { isFeatured: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count({ where: { category: { slug: "mobiles" } } }),
      prisma.product.count({ where: { category: { slug: "accessories" } } }),
    ]);

    // Revenue: sum of confirmed/delivered orders
    const revenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["CONFIRMED", "DELIVERED", "SHIPPED"] } },
    });

    // Latest orders
    const latestOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Latest products
    const latestProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: true },
    });

    return {
      totalProducts,
      availableProducts,
      featuredProducts,
      totalOrders,
      pendingOrders,
      mobilesCount,
      accessoriesCount,
      revenue: revenue._sum.total ?? 0,
      latestOrders,
      latestProducts,
    };
  } catch {
    return null;
  }
}

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  PENDING:    { label: "قيد الانتظار",   class: "bg-amber-100 text-amber-700" },
  CONFIRMED:  { label: "مؤكد",           class: "bg-sky-100 text-sky-700" },
  PROCESSING: { label: "قيد التجهيز",    class: "bg-violet-100 text-violet-700" },
  SHIPPED:    { label: "تم الشحن",       class: "bg-blue-100 text-blue-700" },
  DELIVERED:  { label: "تم التسليم",     class: "bg-green-100 text-green-700" },
  CANCELLED:  { label: "ملغي",           class: "bg-red-100 text-red-700" },
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-silver-500">فشل في تحميل بيانات لوحة التحكم</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-silver-900">لوحة التحكم 📊</h1>
          <p className="text-silver-500 text-sm mt-1">مرحباً بك في لوحة إدارة الغلبان</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm">
          <PlusCircle size={18} />
          إضافة منتج
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "إجمالي المنتجات",
            value: stats.totalProducts,
            sub:   `${stats.availableProducts} متاح`,
            icon:  Package,
            color: "sky",
          },
          {
            label: "إجمالي الطلبات",
            value: stats.totalOrders,
            sub:   `${stats.pendingOrders} قيد الانتظار`,
            icon:  ShoppingBag,
            color: "violet",
          },
          {
            label: "الموبايلات",
            value: stats.mobilesCount,
            sub:   "في المتجر",
            icon:  Smartphone,
            color: "emerald",
          },
          {
            label: "الإيرادات (ج.م)",
            value: stats.revenue.toFixed(0),
            sub:   "طلبات مؤكدة",
            icon:  TrendingUp,
            color: "amber",
          },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-5 border border-silver-100 shadow-card"
          >
            <div className={`w-11 h-11 rounded-xl bg-${color}-100 flex items-center justify-center mb-3`}>
              <Icon size={22} className={`text-${color}-600`} />
            </div>
            <p className="text-2xl font-black text-silver-900">{value}</p>
            <p className="text-sm font-bold text-silver-700 mt-0.5">{label}</p>
            <p className="text-xs text-silver-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/products/new", icon: PlusCircle,  label: "إضافة منتج جديد",    color: "sky" },
          { href: "/admin/products",     icon: Package,      label: "إدارة المنتجات",      color: "violet" },
          { href: "/admin/orders",       icon: ShoppingBag,  label: "عرض الطلبات",         color: "emerald" },
        ].map(({ href, icon: Icon, label, color }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 bg-${color}-50 border-2 border-${color}-200
                         hover:border-${color}-400 rounded-2xl p-4
                         transition-all duration-200 hover:shadow-md group`}
          >
            <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center`}>
              <Icon size={20} className={`text-${color}-600`} />
            </div>
            <span className={`font-bold text-${color}-700 group-hover:text-${color}-800`}>{label}</span>
          </Link>
        ))}
      </div>

      {/* Bottom row: Latest orders + products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Latest Orders */}
        <div className="bg-white rounded-2xl shadow-card border border-silver-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-silver-100">
            <h2 className="font-black text-silver-800">آخر الطلبات</h2>
            <Link href="/admin/orders" className="text-sky-500 hover:text-sky-700 text-sm font-bold flex items-center gap-1">
              <Eye size={14} /> عرض الكل
            </Link>
          </div>
          {stats.latestOrders.length === 0 ? (
            <p className="text-silver-400 text-sm text-center py-8">لا توجد طلبات بعد</p>
          ) : (
            <div className="divide-y divide-silver-50">
              {stats.latestOrders.map((order) => {
                const statusInfo = STATUS_MAP[order.status] ?? { label: order.status, class: "bg-silver-100 text-silver-600" };
                return (
                  <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-silver-800 text-sm">{order.customerName}</p>
                      <p className="text-silver-400 text-xs">{order.phone}</p>
                    </div>
                    <div className="text-end">
                      <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                      <p className="text-sky-600 font-black text-sm mt-1">{order.total.toFixed(2)} ج.م</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Latest Products */}
        <div className="bg-white rounded-2xl shadow-card border border-silver-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-silver-100">
            <h2 className="font-black text-silver-800">آخر المنتجات</h2>
            <Link href="/admin/products" className="text-sky-500 hover:text-sky-700 text-sm font-bold flex items-center gap-1">
              <Eye size={14} /> إدارة الكل
            </Link>
          </div>
          {stats.latestProducts.length === 0 ? (
            <p className="text-silver-400 text-sm text-center py-8">لا توجد منتجات بعد</p>
          ) : (
            <div className="divide-y divide-silver-50">
              {stats.latestProducts.map((product) => (
                <div key={product.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-silver-800 text-sm truncate">{product.nameAr}</p>
                    <p className="text-silver-400 text-xs">{(product as { category: { nameAr: string } }).category.nameAr}</p>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <p className="text-sky-600 font-black text-sm">{product.price.toFixed(2)} ج.م</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      product.isAvailable ? "bg-green-100 text-green-700" : "bg-silver-100 text-silver-500"
                    }`}>
                      {product.isAvailable ? "متاح" : "غير متاح"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
