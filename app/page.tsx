"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#1C1F4E] text-white flex flex-col items-center px-6 py-10">
      
      {/* middle area */}
      <div className="w-full flex-1 flex items-center justify-center">
        
        {/* ✅ 控制圆盘尺寸 + 和 CTA 的距离 */}
        <section className="relative w-full aspect-square 
          max-w-[300px] 
          sm:max-w-[380px] 
          md:max-w-[460px] 
          lg:max-w-[520px]
          mb-12 md:mb-16"
        >
          {/* Outer Zodiac ring */}
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

          {/* Stars ring */}
          <div className="absolute inset-0 scale-[0.70] spin-cw-slow">
            <Image
              src="/wheel-stars.png"
              alt="Stars ring"
              fill
              priority
              className="object-contain select-none pointer-events-none"
            />
          </div>

          {/* Center logo */}
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

      {/* ✅ CTA */}
      <button
        onClick={() => router.push("/profile")}
        className="w-full max-w-[380px] rounded-full bg-[#F2C9FF] text-[#1C1F4E] font-semibold py-4 active:scale-[0.99] transition"
      >
        Start Your Journey →
      </button>
    </main>
  );
}