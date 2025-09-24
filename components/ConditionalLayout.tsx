"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GradualBlur from "./GradualBlur";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  // Check if current path is admin-related (login or dashboard)
  const isAdminPage = pathname?.startsWith("/admin");
  
  // Check if current path is contact page
  const isContactPage = pathname === "/contact";

  if (isAdminPage) {
    // For admin pages, return only children without navbar/footer
    return <>{children}</>;
  }

  // For regular pages, include navbar and footer
  return (
    <>
      {mounted && <Navbar />}
      {children}
      {mounted && <Footer />}
      {/* Add GradualBlur at bottom for all pages except admin and contact */}
      {mounted && !isContactPage && (
        <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-40">
          <GradualBlur />
        </div>
      )}
    </>
  );
}
