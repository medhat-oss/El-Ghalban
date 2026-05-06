// ============================================================
// El-Ghalban | app/(store)/layout.tsx — Customer Store Layout
// Wraps all public pages with Navbar, Cart panel, Footer
// ============================================================

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart   from "@/components/Cart";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Cart />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
