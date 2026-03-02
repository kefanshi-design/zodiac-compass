// components/Analytics.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.gtag) return;

    // ✅ Don't use useSearchParams (can break prerender/export on some builds)
    const search = typeof window !== "undefined" ? window.location.search : "";
    const url = `${pathname}${search}`;

    window.gtag("config", "G-SWHD49GC8X", {
      page_path: url,
    });
  }, [pathname]);

  return null;
}