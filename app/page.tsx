"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#14163D] text-white flex flex-col items-center px-6 py-10">
      {/* middle area: keep wheel centered */}
      <div className="w-full flex-1 flex items-center justify-center">
        <section className="relative w-full max-w-[420px] aspect-square">
          {/* Outer Zodiac ring (CCW) */}
          <div className="absolute inset-0 spin-ccw-slower">
            <Image
              src="/wheel-zodiac.png"
              alt="Zodiac ring"
              fill
              priority
              className="object-contain select-none pointer-events-none"
              sizes="(max-width: 480px) 92vw, 420px"
            />
          </div>

          {/* Middle Stars ring (CW) */}
          <div className="absolute inset-0 scale-[0.70] spin-cw-slow">
            <Image
              src="/wheel-stars.png"
              alt="Stars ring"
              fill
              priority
              className="object-contain select-none pointer-events-none"
              sizes="(max-width: 480px) 74vw, 310px"
            />
          </div>

          {/* Center logo (fixed) */}
          <div className="absolute inset-0 scale-[0.52]">
            <Image
              src="/wheel-logo.png"
              alt="Zodiac Compass logo"
              fill
              priority
              className="object-contain select-none pointer-events-none"
              sizes="(max-width: 480px) 52vw, 220px"
            />
          </div>
        </section>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push("/profile")}
        className="w-full max-w-[380px] rounded-full bg-[#F2C9FF] text-[#1C1F4E] font-semibold py-4 active:scale-[0.99] transition"
      >
        Start Your Journey →
      </button>
    </main>
  );
}