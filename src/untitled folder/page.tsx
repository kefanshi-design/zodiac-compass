// app/animation/page.tsx
import { Suspense } from "react";
import AnimationClient from "./animation-client";

export default function AnimationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1E214A]" />}>
      <AnimationClient />
    </Suspense>
  );
}