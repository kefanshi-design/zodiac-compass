"use client";

import { useRouter } from "next/navigation";

export default function EndingSection() {
  const router = useRouter();

  return (
    <section className="relative px-6 pt-10 pb-14">
      {/* Subtle ending transition */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[140px]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(28,31,78,0.00) 0%, rgba(28,31,78,0.42) 55%, rgba(28,31,78,1.00) 100%)",
        }}
      />

      <div className="relative flex flex-col items-center">
        <p className="text-white/90 font-semibold text-center">
          Just watch out for rushing and you&apos;ll do great!
        </p>
    
        {/* Primary CTA */}
        <button
          onClick={() => router.push("/")}
          className="mt-16 w-full max-w-[420px] rounded-full bg-[#F2C9FF] text-[#1C1F4E] font-semibold py-4 active:scale-95 transition"
        >
          Back Home
        </button>

        {/* Inline secondary links */}
        <div className="mt-8 flex items-center gap-3 text-sm">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeVoQqWB9zxflv5l2s5wALn5PsuhedDQuwF-ozAR_AEL8SX7w/viewform?usp=header"
            target="_blank"
            rel="noreferrer"
            className="text-white/60 underline underline-offset-4 hover:text-white/90 transition"
          >
            Leave your idea
          </a>

          <span className="text-white/35">·</span>

          <a
            href="https://www.kefanshi.com"
            target="_blank"
            rel="noreferrer"
            className="text-white/60 underline underline-offset-4 hover:text-white/90 transition"
          >
            Meet the designer
          </a>
        </div>

        {/* Credit */}
        <div className="mt-3 text-center text-white/45 text-sm">
          Designed &amp; launched by Kefan
        </div>
      </div>
    </section>
  );
}