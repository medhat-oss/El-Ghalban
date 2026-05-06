// ============================================================
// El-Ghalban | app/admin/layout.tsx — Admin Dashboard Layout
// Dark sidebar with navigation links
// ============================================================
export const dynamic = 'force-dynamic';
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";
import { Toaster } from "react-hot-toast";

export const metadata = { title: { default: "لوحة التحكم", template: "%s | لوحة التحكم — الغلبان" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  /* 
     تعديل جوهري: لو المستخدم مش مسجل دخول، هنعرض له الصفحة "كما هي" 
     بدون Sidebar. الميدل وير هو اللي هيتكفل بحمايته لو حاول يدخل 
     صفحات الأدمن الحقيقية، لكن الحركة دي هتخلي صفحة اللوجن تفتح بسلام.
  */
  if (!session || session.user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-silver-100" dir="rtl">
        {children}
        <Toaster position="bottom-center" />
      </div>
    );
  }

  // لو المستخدم أدمن ومسجل دخول، اعرض الشكل الكامل للوحة التحكم
  return (
    <div className="min-h-screen bg-silver-100 flex" dir="rtl">
      {/* Sidebar */}
      <AdminSidebar adminName={session.user?.name ?? "المدير"} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { fontFamily: "Cairo, sans-serif", direction: "rtl", textAlign: "right" },
        }}
      />
    </div>
  );
}