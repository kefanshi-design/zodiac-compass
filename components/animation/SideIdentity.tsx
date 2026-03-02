// components/animation/SideIdentity.tsx
"use client";

import Image from "next/image";

type Stage = 1 | 2 | 3 | 4;

type Props = {
  stage: Stage;
  zodiacSrc: string;
  constellationSrc: string;
  zodiacKey: string;
  constellationKey: string;
};

export default function SideIdentity({
  stage,
  zodiacSrc,
  constellationSrc,
  zodiacKey,
  constellationKey,
}: Props) {
  // Stage 3: 2s reveal
  const sideStyle = {
    opacity: stage >= 3 ? 1 : 0,
    transform: stage >= 3 ? "translateY(0px) scale(1)" : "translateY(12px) scale(0.96)",
    transition:
      stage >= 3
        ? "opacity 2000ms ease-out, transform 2000ms ease-out"
        : "opacity 240ms ease-out, transform 240ms ease-out",
  } as const;

  return (
    <>
      {/* Left zodiac */}
      <div
        className="absolute left-[-120px] top-1/2 -translate-y-1/2 hidden lg:block"
        style={sideStyle}
      >
        <div className="relative w-[180px] h-[180px]">
          <div className="absolute inset-0 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm" />
          <Image
            src={zodiacSrc}
            alt={zodiacKey}
            fill
            className="object-contain p-6 drop-shadow-[0_0_18px_rgba(242,201,255,0.18)]"
          />
        </div>
      </div>

      {/* Right constellation */}
      <div
        className="absolute right-[-120px] top-1/2 -translate-y-1/2 hidden lg:block"
        style={sideStyle}
      >
        <div className="relative w-[180px] h-[180px]">
          <div className="absolute inset-0 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm" />
          <Image
            src={constellationSrc}
            alt={constellationKey}
            fill
            className="object-contain p-6 drop-shadow-[0_0_18px_rgba(242,201,255,0.18)]"
          />
        </div>
      </div>
    </>
  );
}