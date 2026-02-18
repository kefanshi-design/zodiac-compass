// app/result/page.tsx
import { Suspense } from "react";
import ResultClient from "./result-client";

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1C1F4E]" />}>
      <ResultClient />
    </Suspense>
  );
}
