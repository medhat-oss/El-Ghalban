// ============================================================
// El-Ghalban | app/layout.tsx — Root Layout
// Sets RTL direction, Cairo font, global providers
// ============================================================

import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "الغلبان | موبايلات وإكسسوارات وصيانة",
    template: "%s | الغلبان",
  },
  description:
    "الغلبان — متجرك المتخصص في الموبايلات والإكسسوارات وخدمات الصيانة. أفضل الأسعار وأعلى جودة في مصر.",
  keywords: ["موبايل", "اكسسوارات", "صيانة", "ايفون", "سامسونج", "الغلبان"],
  authors: [{ name: "الغلبان" }],
  creator: "الغلبان",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "الغلبان",
    title: "الغلبان | موبايلات وإكسسوارات وصيانة",
    description: "أفضل أسعار الموبايلات والإكسسوارات في مصر",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body className="font-cairo antialiased bg-white text-silver-900 dark:bg-[#0f172a] dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider>
          <CartProvider>
            {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "Cairo, sans-serif",
                direction: "rtl",
                textAlign: "right",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: "600",
              },
              success: {
                iconTheme: { primary: "#0ea5e9", secondary: "#ffffff" },
                style: { background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" },
              },
              error: {
                style: { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
              },
            }}
          />
        </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
