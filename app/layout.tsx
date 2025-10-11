import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "../components/ConditionalLayout";
import Providers from "../components/Providers";
import { ThemeProvider } from "./contexts/ThemeContext";
import ClientOnlyComponents from "../components/ClientOnlyComponents";
import FontLoader from "../components/FontLoader";

export const metadata: Metadata = {
  title: "AI Solutions - Transform Your Business with AI",
  description: "Innovate, automate, and thrive with AI-driven solutions. Empower your business with advanced automation, analytics, and intelligent workflows.",
  metadataBase: new URL('https://ai-solution.vercel.app'),
  keywords: ['AI', 'artificial intelligence', 'software', 'solutions', 'technology', 'automation', 'machine learning', 'business intelligence', 'AI integration', 'enterprise AI'],
  authors: [{ name: 'AI Solutions Team' }],
  openGraph: {
    title: 'AI Solutions - Transform Your Business with AI',
    description: 'Innovate, automate, and thrive with AI-driven solutions. Empower your business with advanced artificial intelligence technology.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Solutions - Transform Your Business with AI',
    description: 'Innovate, automate, and thrive with AI-driven solutions. Empower your business with advanced artificial intelligence technology.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* Fallback system fonts to prevent layout shift */}
        <style>{`
          body {
            font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          }
        `}</style>
      </head>
      <body className="font-manrope transition-colors duration-300">
        <FontLoader />
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
        <ClientOnlyComponents />
      </body>
    </html>
  );
}
