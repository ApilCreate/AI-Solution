"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "../app/contexts/ThemeContext";

// Lazy load RouteCurtain only when needed (reduces initial bundle)
const RouteCurtain = dynamic(() => import("./RouteCurtain"), {
  ssr: false,
  loading: () => null,
});

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <RouteCurtain />
      {children}
    </ThemeProvider>
  );
}

