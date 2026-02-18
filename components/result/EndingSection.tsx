"use client";

import { useRouter } from "next/navigation";

export default function EndingSection() {
  const router = useRouter();

  return (
    <section className="py-12 px-6 flex flex-col items-center gap-8">
      <p className="text-white/90 font-semibold text-center">
        Just watch out for rushing and you&apos;ll do great!
      </p>
      <p className="text-white/60 text-sm text-center">Thank you!</p>

      <button
        onClick={() => router.push("/")}
        className="mt-4 w-full max-w-[380px] rounded-full bg-[#F2C9FF] text-[#1C1F4E] font-semibold py-4 active:scale-95 transition"
      >
        Back Home
      </button>
    </section>
  );
}
