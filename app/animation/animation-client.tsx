// app/animation/animation-client.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import LanguageToggle from "@/components/LanguageToggle";
import { getZodiacAnimal } from "@/src/lib/zodiacEngine";
import { getConstellation } from "@/src/lib/constellationEngine";

type Stage = 1 | 2 | 3 | 4;

export default function AnimationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timersRef = useRef<number[]>([]);
  const [stage, setStage] = useState<Stage>(1);

  // ✅ 预览模式：?preview=1 时不自动跳转 result，方便你反复调动画
  const isPreview = searchParams.get("preview") === "1";

  // ====== Read query (or fallback) ======
  const payload = useMemo(() => {
    const name = searchParams.get("name") ?? "";
    const day = searchParams.get("day") ?? "";
    const month = searchParams.get("month") ?? "";
    const year = searchParams.get("year") ?? "";
    const path = searchParams.get("path") ?? "";
    return { name, day, month, year, path };
  }, [searchParams]);

  const resultHref = useMemo(() => {
    const qs = new URLSearchParams(payload).toString();
    return `/result?${qs}`;
  }, [payload]);

  function clearTimers() {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }

  function goResult() {
    clearTimers();
    router.push(resultHref);
  }

  // ====== Stage timeline (Storyboard v2) ======
  // 1) Home spin (0.8s)
  // 2) Scale down (0.8s) + side reveal starts
  // 3) Hold / fully visible (2.0s)
  // 4) Fade out (0.6s) -> route (unless preview)
  useEffect(() => {
    clearTimers();

    const t1 = 800;
    const t2 = 800;
    const t3 = 1000;
    const t4 = 600;

    timersRef.current = [
      window.setTimeout(() => setStage(2), t1),
      window.setTimeout(() => setStage(3), t1 + t2),
      window.setTimeout(() => setStage(4), t1 + t2 + t3),
    ];

    if (!isPreview) {
      timersRef.current.push(
        window.setTimeout(() => goResult(), t1 + t2 + t3 + t4),
      );
    }

    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultHref, isPreview]);

  // ====== Compute zodiac/constellation ======
  const dayNum = Number(payload.day);
  const monthNum = Number(payload.month);
  const yearNum = Number(payload.year);

  const isValidDob =
    Number.isFinite(dayNum) &&
    Number.isFinite(monthNum) &&
    Number.isFinite(yearNum) &&
    dayNum >= 1 &&
    dayNum <= 31 &&
    monthNum >= 1 &&
    monthNum <= 12 &&
    yearNum >= 1900;

  const computed = useMemo(() => {
    // ✅ 没有 DOB 时也能 preview（默认 dog/sagittarius 方便你看）
    if (!isValidDob) return { zodiac: "dog", constellation: "sagittarius" };

    const zodiac = getZodiacAnimal(yearNum);
    const constellation = getConstellation(monthNum, dayNum);

    return {
      zodiac: String(zodiac).toLowerCase(),
      constellation: String(constellation).toLowerCase(),
    };
  }, [isValidDob, dayNum, monthNum, yearNum]);

  const zodiacSrc = `/assets/zodiac/${computed.zodiac}.png`;
  const constellationSrc = `/assets/constellation/${computed.constellation}.png`;

  // ====== Motion styles (minimal, clean) ======
  // Stage 1: full size
  // Stage 2+: scale down and stay centered
  const wheelWrapStyle: React.CSSProperties = {
    transform: stage >= 2 ? "scale(0.42)" : "scale(1)", // 你可以微调 0.38~0.52
    transition: "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
    willChange: "transform",
  };

  // Scene fade out
  const sceneStyle: React.CSSProperties =
    stage === 4
      ? {
          opacity: 0,
          transform: "scale(1.02)",
          filter: "blur(1.5px)",
          transition: "opacity 600ms ease-out, transform 600ms ease-out, filter 600ms ease-out",
        }
      : {
          opacity: 1,
          transform: "scale(1)",
          filter: "blur(0px)",
          transition: "opacity 240ms ease-out, transform 240ms ease-out, filter 240ms ease-out",
        };

  // Side reveal: starts at stage 2, fully visible by stage 3
  const sideStyle: React.CSSProperties = {
    opacity: stage >= 2 ? 1 : 0,
    transform: stage >= 2 ? "translateY(0px) scale(1)" : "translateY(16px) scale(0.98)",
    transition: "opacity 800ms ease-out, transform 800ms ease-out",
    pointerEvents: "none",
  };

  // Optional: small hold pulse at stage 3 (subtle)
  const sidePulseStyle: React.CSSProperties =
    stage >= 3
      ? { animation: "zcSoftPulse 2200ms ease-in-out infinite" }
      : { animation: "none" };

  // Label (optional)
  const labelStyle: React.CSSProperties = {
    opacity: stage >= 2 ? 1 : 0,
    transform: stage >= 2 ? "translateY(0px)" : "translateY(6px)",
    transition: "opacity 420ms ease-out, transform 420ms ease-out",
  };

  return (
    <main className="relative min-h-screen text-white flex flex-col items-center px-6 py-10 overflow-hidden bg-[#1C1F4E]">
      {/* Top-right language toggle */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle />
      </div>

      {/* BG (same as Home) */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="zc-aurora a1" />
        <div className="zc-aurora a2" />
        <div className="zc-aurora a3" />
        <div className="zc-star-noise" />
      </div>

      {/* Keyframes (tiny pulse only) */}
      <style jsx global>{`
        @keyframes zcSoftPulse {
          0%, 100% { transform: scale(1); opacity: 0.92; }
          50% { transform: scale(1.03); opacity: 1; }
        }
      `}</style>


      {/* Scene */}
      <div className="w-full flex-1 z-10 flex items-center justify-center" style={sceneStyle}>
        <section className="relative w-full aspect-square max-w-[520px]">
          {/* ===== Wheel (reuse Home’s clean spin) ===== */}
          <div className="absolute inset-0 grid place-items-center" style={wheelWrapStyle}>
            {/* Outer ring */}
            <div className="absolute inset-0 spin-ccw-slower">
              <Image
                src="/wheel-zodiac.png"
                alt="Zodiac ring"
                fill
                priority
                className="object-contain select-none pointer-events-none"
              />
            </div>

            {/* Inner ring */}
            <div className="absolute inset-0 scale-[0.70] spin-cw-slow">
              <Image
                src="/wheel-stars.png"
                alt="Stars ring"
                fill
                priority
                className="object-contain select-none pointer-events-none"
              />
            </div>

            {/* Logo */}
            <div className="absolute inset-0 scale-[0.52]">
              <Image
                src="/wheel-logo.png"
                alt="Zodiac Compass logo"
                fill
                priority
                className="object-contain select-none pointer-events-none"
              />
            </div>
          </div>

          {/* ===== Side icons (appear after scale down) ===== */}
          <div
            className="absolute left-[-40px] md:left-[-120px] top-1/2 -translate-y-1/2"
            style={{ ...sideStyle, ...sidePulseStyle }}
          >
            <div className="relative w-[140px] h-[140px] md:w-[180px] md:h-[180px]">
              <Image
                src={zodiacSrc}
                alt={computed.zodiac}
                fill
                className="object-contain select-none pointer-events-none drop-shadow-[0_0_18px_rgba(242,201,255,0.14)]"
              />
            </div>
          </div>

          <div
            className="absolute right-[-40px] md:right-[-120px] top-1/2 -translate-y-1/2"
            style={{ ...sideStyle, ...sidePulseStyle }}
          >
            <div className="relative w-[140px] h-[140px] md:w-[180px] md:h-[180px]">
              <Image
                src={constellationSrc}
                alt={computed.constellation}
                fill
                className="object-contain select-none pointer-events-none drop-shadow-[0_0_18px_rgba(242,201,255,0.14)]"
              />
            </div>
          </div>

          {/* ===== Label ===== */}
          <div className="absolute bottom-[-72px] left-1/2 -translate-x-1/2" style={labelStyle}>
            <div className="px-4 py-2 rounded-full bg-white/6 border border-white/10 backdrop-blur-md text-white/85 text-sm">
              <span className="font-medium capitalize">{computed.zodiac}</span>
              <span className="mx-2 text-white/40">·</span>
              <span className="font-medium capitalize">{computed.constellation}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Debug helper (optional) */}
      {isPreview && (
        <div className="z-10 text-xs text-white/45 pb-6">
          Open with: <span className="text-white/65">/animation?preview=1</span>
          <span className="mx-2">·</span>
          Example:
          <span className="text-white/65">
            {" "}
            /animation?preview=1&day=10&month=12&year=1994
          </span>
        </div>
      )}
    </main>
  );
}