"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.gtag) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");

    window.gtag("config", "G-SWHD49GC8X", {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}