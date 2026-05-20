// ============================================================
// El-Ghalban | app/(admin-root)/admin/layout.tsx — Admin Layout
// Standalone root layout for the admin section with ThemeProvider
// ============================================================
export const dynamic = 'force-dynamic';
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Cairo } from "next/font/google";
import "../../globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata = { title: { default: "لوحة التحكم", template: "%s | لوحة التحكم — الغلبان" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Login page — show without sidebar
  if (!session || session.user?.role !== "admin") {
    return (
      <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
        <body className="font-cairo antialiased">
          <ThemeProvider>
            <div className="min-h-screen bg-silver-100 dark:bg-[#0f172a] transition-colors duration-300">
              {children}
              <Toaster position="bottom-center" />
            </div>
          </ThemeProvider>
        </body>
      </html>
    );
  }

  // Authenticated admin — full dashboard layout
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body className="font-cairo antialiased">
        <ThemeProvider>
          <div className="min-h-screen bg-silver-100 dark:bg-[#0f172a] flex transition-colors duration-300">
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
        </ThemeProvider>
      </body>
    </html>
  );
}