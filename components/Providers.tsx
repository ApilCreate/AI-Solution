"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "../app/contexts/ThemeContext";
import RouteCurtain from "./RouteCurtain";

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

