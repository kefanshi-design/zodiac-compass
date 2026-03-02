// app/animation/animation-client.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

type Stage = 1 | 2 | 3 | 4;

export default function AnimationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timersRef = useRef<number[]>([]);
  const [stage, setStage] = useState<Stage>(1);

  // ✅ 读取 Profile 传来的原始参数（你现在的链路应该是这些）
  const payload = useMemo(() => {
    const name = searchParams.get("name") ?? "";
    const day = searchParams.get("day") ?? "";
    const month = searchParams.get("month") ?? "";
    const year = searchParams.get("year") ?? "";
    const path = searchParams.get("path") ?? "";
    return { name, day, month, year, path };
  }, [searchParams]);

  // ✅ 把 query 原样带到 result（最稳）
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

  useEffect(() => {
    clearTimers();

    // 时间轴：1s → 2s → 2s → 1s（总 6s）
    timersRef.current = [
      window.setTimeout(() => setStage(2), 1000),
      window.setTimeout(() => setStage(3), 3000),
      window.setTimeout(() => setStage(4), 5000),
      window.setTimeout(() => goResult(), 6000),
    ];

    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultHref]); // 当 query 变了，重新跑一次时间轴

  // ✅ 让外盘在 Stage1 快速转，之后“停住”在一个固定角度（看起来像精准落点）
  // 你后面要做“聚焦某个星座/生肖扇区”，就是把 settleDeg 改成计算出来的角度。
  const settleDeg = -18; // 你可以随时换成计算结果
  const outerStyle =
    stage === 1
      ? {
          animation: "zcSpinFast 1000ms cubic-bezier(0.12, 0.8, 0.18, 1) forwards",
        }
      : {
          transform: `rotate(${settleDeg}deg)`,
          transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
        };

  // ✅ 中盘：一直慢慢转（更有“活着”的感觉）
  const starsStyle = {
    animation: "zcSpinSlow 9000ms linear infinite",
  } as const;

  // ✅ Stage 3：左右图案显现（你后面会换成 zodiac/constellation PNG）
  const sideOpacity = stage >= 3 ? 1 : 0;
  const sideStyle = {
    opacity: sideOpacity,
    transform: stage >= 3 ? "translateY(0px) scale(1)" : "translateY(8px) scale(0.98)",
    transition: "all 700ms cubic-bezier(0.16, 1, 0.3, 1)",
  } as const;

  // ✅ Stage 4：整体淡出
  const fadeOutStyle =
    stage === 4
      ? { opacity: 0, transition: "opacity 700ms ease-out" }
      : { opacity: 1, transition: "opacity 350ms ease-out" };

  return (
    <div className="relative w-full h-screen bg-[#1E214A] overflow-hidden">
      {/* keyframes */}
      <style jsx global>{`
        @keyframes zcSpinFast {
          0% {
            transform: rotate(0deg);
          }
          70% {
            transform: rotate(820deg);
          }
          100% {
            transform: rotate(1080deg);
          }
        }
        @keyframes zcSpinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Skip */}
      <button
        onClick={goResult}
        className="absolute top-6 right-6 z-20 text-white/70 hover:text-white text-sm"
      >
        Skip
      </button>

      {/* Stage wrapper (fade out on stage 4) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={fadeOutStyle}
      >
        {/* 圆盘容器 */}
        <div className="relative w-[560px] h-[560px] md:w-[640px] md:h-[640px] flex items-center justify-center">
          {/* 外盘 */}
          <div className="absolute inset-0" style={outerStyle}>
            <Image
              src="/wheel-zodiac-background.png"
              alt="wheel"
              fill
              priority
              className="object-contain select-none pointer-events-none"
            />
          </div>

          {/* 中盘 */}
          <div className="absolute inset-0" style={starsStyle}>
            <Image
              src="/wheel-stars-background.png"
              alt="stars"
              fill
              className="object-contain select-none pointer-events-none opacity-90"
            />
          </div>

          {/* Logo */}
          <div className="absolute grid place-items-center">
            <Image
              src="/wheel-logo.png"
              alt="logo"
              width={220}
              height={220}
              className="select-none pointer-events-none"
            />
          </div>

          {/* Stage 3：左右出现图案（先用占位，下一步换成你的 zodiac/constellation PNG） */}
          <div
            className="absolute left-[-120px] top-1/2 -translate-y-1/2 hidden lg:block"
            style={sideStyle}
          >
            <div className="w-[160px] h-[160px] opacity-90">
              {/* TODO: 换成 /assets/zodiac/{xxx}.png */}
              <div className="w-full h-full rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />
            </div>
          </div>

          <div
            className="absolute right-[-120px] top-1/2 -translate-y-1/2 hidden lg:block"
            style={sideStyle}
          >
            <div className="w-[160px] h-[160px] opacity-90">
              {/* TODO: 换成 /assets/constellation/{xxx}.png */}
              <div className="w-full h-full rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}