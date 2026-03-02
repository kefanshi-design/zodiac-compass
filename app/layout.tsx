// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";

import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import Analytics from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zodiac Compass",
  description: "Discover your Chinese Zodiac and energy balance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>

        {/* ✅ Route-aware GA page_view (wrap to satisfy prerender) */}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>

        {/* ✅ Google Analytics base tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SWHD49GC8X"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SWHD49GC8X');
          `}
        </Script>
      </body>
    </html>
  );
}