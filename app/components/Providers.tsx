"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ThemeProvider } from "../contexts/ThemeContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider 
      basePath="/api/auth"
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

