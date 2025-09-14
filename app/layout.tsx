import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";
import Providers from "./components/Providers";
import { ThemeProvider } from "./contexts/ThemeContext";

export const metadata: Metadata = {
  title: "AI Solutions",
  description: "AI-powered software company site",
  metadataBase: new URL('https://ai-solution.vercel.app'),
  keywords: ['AI', 'artificial intelligence', 'software', 'solutions', 'technology'],
  authors: [{ name: 'AI Solutions Team' }],
  openGraph: {
    title: 'AI Solutions - Transform Your Business with AI',
    description: 'AI-powered software company site',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Solutions',
    description: 'AI-powered software company site',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://prod.spline.design" />
        
        {/* Optimized font loading with display=swap */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Monoton&display=swap"
          rel="stylesheet"
        />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Reduce layout shift with font-display */}
        <style>{`
          @font-face {
            font-family: 'Manrope';
            font-display: swap;
          }
          @font-face {
            font-family: 'Monoton';
            font-display: swap;
          }
        `}</style>
      </head>
      <body className="font-manrope transition-colors duration-300">
        <ThemeProvider>
          <Providers>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
