"use client";

import { useRouter } from "next/navigation";

export default function EndingSection() {
  const router = useRouter();

  return (
    <section className="py-12 px-6 flex flex-col items-center gap-6">
      <p className="text-white/90 font-semibold text-center">
        Just watch out for rushing and you&apos;ll do great!
      </p>
      <p className="text-white/60 text-sm text-center">Thank you!</p>

      {/* Primary CTA */}
      <button
        onClick={() => router.push("/")}
        className="mt-4 w-full max-w-[380px] rounded-full bg-[#F2C9FF] text-[#1C1F4E] font-semibold py-4 active:scale-95 transition"
      >
        Back Home
      </button>

      {/* Secondary CTA */}
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeVoQqWB9zxflv5l2s5wALn5PsuhedDQuwF-ozAR_AEL8SX7w/viewform?usp=header"
        target="_blank"
        rel="noreferrer"
        className="w-full max-w-[380px] rounded-full py-4 text-center font-semibold transition active:scale-95
                   border-2 border-[#F2C9FF] text-white/90 hover:text-white"
      >
        Leave Your Idea
      </a>

      {/* Footer credit + link */}
      <div className="pt-2 text-center text-white/60 text-sm">
        <div>Designed &amp; launched by Kefan</div>
        <a
          href="https://www.kefanshi.com"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-[#F2C9FF] underline underline-offset-4 hover:opacity-90 transition"
        >
          → Meet the Designer
        </a>
      </div>
    </section>
  );
}