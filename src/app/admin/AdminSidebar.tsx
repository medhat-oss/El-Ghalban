"use client";
// ============================================================
// El-Ghalban | app/admin/AdminSidebar.tsx
// Dark sidebar with links and sign-out
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, PlusCircle, ShoppingBag,
  LogOut, Zap, Menu, X, ChevronLeft,
} from "lucide-react";

const NAV = [
  { href: "/admin",              icon: LayoutDashboard, label: "الرئيسية"        },
  { href: "/admin/products",     icon: Package,         label: "إدارة المنتجات" },
  { href: "/admin/products/new", icon: PlusCircle,      label: "إضافة منتج"    },
  { href: "/admin/orders",       icon: ShoppingBag,     label: "الطلبات"        },
];

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none">الغلبان</p>
            <p className="text-slate-400 text-[10px] leading-none mt-0.5">لوحة التحكم</p>
          </div>
        </div>
      </div>

      {/* Admin info */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center text-white font-black text-sm">
            {adminName.charAt(0)}
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">{adminName}</p>
            <p className="text-slate-400 text-[11px]">مدير النظام</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                        transition-all duration-200 group
                        ${isActive(href)
                          ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
          >
            <Icon size={18} className={isActive(href) ? "text-sky-400" : "text-slate-500 group-hover:text-slate-300"} />
            {label}
            {isActive(href) && <ChevronLeft size={14} className="ms-auto text-sky-400 rotate-180" />}
          </Link>
        ))}
      </nav>

      {/* Store link */}
      <div className="px-3 pb-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400
                     hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
        >
          <Zap size={15} className="text-slate-500" />
          عرض المتجر
        </Link>
      </div>

      {/* Sign out */}
      <div className="px-3 pb-5 border-t border-white/10 pt-3">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                     font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300
                     transition-all duration-200"
        >
          <LogOut size={17} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="admin-sidebar hidden lg:flex flex-col w-60 min-h-screen flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile: hamburger + slide-over */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 start-4 z-50 w-10 h-10 bg-slate-800 rounded-xl
                     flex items-center justify-center text-white shadow-lg"
        >
          <Menu size={20} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />
            <aside className="admin-sidebar fixed inset-y-0 start-0 z-50 w-64 flex flex-col">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 end-4 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </aside>
          </>
        )}
      </div>
    </>
  );
}
