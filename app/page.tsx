"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import LanguageToggle from "@/components/LanguageToggle";
import { useLang } from "@/components/LanguageProvider";
import { t } from "@/src/lib/i18n";

export default function Page() {
  const router = useRouter();
  const { lang } = useLang();

  return (
    <main className="relative min-h-screen text-white flex flex-col items-center px-6 py-10 overflow-hidden bg-[#1C1F4E]">
      {/* Top-right language toggle */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle />
      </div>

      {/* BG (uses your globals.css classes) */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="zc-aurora a1" />
        <div className="zc-aurora a2" />
        <div className="zc-aurora a3" />
        <div className="zc-star-noise" />
      </div>

      {/* Wheel */}
      <div className="w-full flex-1 z-10 flex items-center justify-center">
        <section className="relative w-full aspect-square max-w-[300px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[520px] mb-12 md:mb-16">
          <div className="absolute inset-0 spin-ccw-slower">
            <Image
              src="/wheel-zodiac.png"
              alt="Zodiac ring"
              fill
              priority
              className="object-contain select-none pointer-events-none"
              sizes="(max-width:640px) 90vw, (max-width:1024px) 460px, 520px"
            />
          </div>

          <div className="absolute inset-0 scale-[0.70] spin-cw-slow">
            <Image
              src="/wheel-stars.png"
              alt="Stars ring"
              fill
              priority
              className="object-contain select-none pointer-events-none"
            />
          </div>

          <div className="absolute inset-0 scale-[0.52]">
            <Image
              src="/wheel-logo.png"
              alt="Zodiac Compass logo"
              fill
              priority
              className="object-contain select-none pointer-events-none"
            />
          </div>
        </section>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push("/path")}
        className="w-full z-10 max-w-[380px] rounded-full bg-[#F2C9FF] text-[#1C1F4E] font-semibold py-4 active:scale-[0.99] transition"
      >
        {t(lang, "homeCta")}
      </button>
    </main>
  );
}