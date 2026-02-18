// app/path/page.tsx
import { Suspense } from "react";
import PathClient from "./path-client";

export default function PathPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1C1F4E]" />}>
      <PathClient />
    </Suspense>
  );
}