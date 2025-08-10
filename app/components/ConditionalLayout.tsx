"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current path is admin-related (login or dashboard)
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    // For admin pages, return only children without navbar/footer
    return <>{children}</>;
  }

  // For regular pages, include navbar and footer
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
