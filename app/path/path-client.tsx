"use client";

import Image from "next/image";
import React, { forwardRef, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PathKey = "career" | "love" | "health";

const OPTIONS = [
  { key: "career", title: "Career", icon: "/icon-career.png" },
  { key: "love", title: "Love", icon: "/icon-love.png" },
  { key: "health", title: "Health", icon: "/icon-health.png" },
] as const;

// ✅ 你截图里用到的 size / glyph
const ICON = 70; // 56 * 1.1 ≈ 61.6 → 62
const GLYPH = 36; // 图标大小（你也可以改 26/30）

export default function PathClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const name = sp.get("name") ?? "";
  const day = sp.get("day") ?? "";
  const month = sp.get("month") ?? "";
  const year = sp.get("year") ?? "";

  const hasRequired = name && day && month && year;
  if (!hasRequired) {
    router.replace("/profile");
    return null;
  }

  const [selected, setSelected] = useState<PathKey | null>(null);

  // refs：用真实 DOM 位置算指针角度
  const diskRef = useRef<HTMLDivElement | null>(null);
  const iconRefs = useRef<Record<PathKey, HTMLButtonElement | null>>({
    career: null,
    love: null,
    health: null,
  });

  // 指针角度：0=向右，90=向下
  const [pointerDeg, setPointerDeg] = useState<number>(-90);

  // 外圈高光：允许圆盘外也驱动
  const [glowPos, setGlowPos] = useState<{ x: number; y: number }>({
    x: 50,
    y: 22,
  });

  const canContinue = selected !== null;

  const handleNext = () => {
    if (!selected) return;

    const qs = new URLSearchParams({
      name,
      day,
      month,
      year,
      path: selected,
    }).toString();

    router.push(`/result?${qs}`);
  };

  function onAreaMove(e: React.MouseEvent) {
    if (!diskRef.current) return;

    const rect = diskRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const nx = Math.max(0, Math.min(100, 50 + (dx / (rect.width / 2)) * 50));
    const ny = Math.max(0, Math.min(100, 50 + (dy / (rect.height / 2)) * 50));

    setGlowPos({ x: nx, y: ny });
  }

  function onAreaLeave() {
    setGlowPos({ x: 50, y: 22 });
  }

  function choose(k: PathKey) {
    setSelected(k);

    const disk = diskRef.current;
    const btn = iconRefs.current[k];
    if (!disk || !btn) return;

    const d = disk.getBoundingClientRect();
    const b = btn.getBoundingClientRect();

    const cx = d.left + d.width / 2;
    const cy = d.top + d.height / 2;

    const tx = b.left + b.width / 2;
    const ty = b.top + b.height / 2;

    const rad = Math.atan2(ty - cy, tx - cx);
    const deg = (rad * 180) / Math.PI;

    setPointerDeg(deg);
  }

  return (
    <main className="min-h-screen bg-[#1C1F4E] text-white flex flex-col px-6 py-10">
      {/* 用 flex-1 把圆盘区真正居中（你要的红框“整体往中间”） */}
      <div className="w-full max-w-sm mx-auto flex flex-col min-h-[calc(100vh-80px)]">
        <h1 className="text-4xl font-semibold leading-tight">
          What do you want
          <br />
          to explore today?
        </h1>

        <div
          className="relative flex-1 flex items-center justify-center mt-2"
          onMouseMove={onAreaMove}
          onMouseLeave={onAreaLeave}
        >
          <div
            ref={diskRef}
            className="relative"
            style={{ width: 331, height: 331 }}
          >
            {/* 外圈高光（更雾化 + 软 ring mask，避免“带子感”） */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%,
                  rgba(242,201,255,0.62) 0%,
                  rgba(242,201,255,0.34) 18%,
                  rgba(242,201,255,0.16) 36%,
                  rgba(242,201,255,0.07) 52%,
                  rgba(242,201,255,0.00) 72%
                )`,
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 0 54%, rgba(0,0,0,0.12) 58%, rgba(0,0,0,0.85) 64%, #000 100%)",
                maskImage:
                  "radial-gradient(circle, transparent 0 54%, rgba(0,0,0,0.12) 58%, rgba(0,0,0,0.85) 64%, #000 100%)",
              }}
            />

            {/* 外圈描边 */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "2px solid rgba(242,201,255,0.22)",
                boxShadow:
                  selected !== null
                    ? "0 0 18px rgba(242,201,255,0.28)"
                    : "0 0 10px rgba(242,201,255,0.16)",
              }}
            />

            {/* 中心圆 */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 161,
                height: 161,
                background: "rgba(239, 180, 255, 0.12)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            />

            {/* 指针：缩短约 30%（96 -> 67） */}
            <div
              className="absolute left-1/2 top-1/2 origin-[0%_50%]"
              style={{
                width: 67,
                height: 6,
                transform: `translate(-2px, -50%) rotate(${
                  selected ? pointerDeg : -90
                }deg)`,
                transition: "transform 420ms cubic-bezier(0.2, 0.9, 0.2, 1)",
              }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(242,201,255,0.00) 0%, rgba(242,201,255,0.92) 62%, rgba(242,201,255,1) 100%)",
                }}
              />
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2"
                style={{
                  width: 10,
                  height: 10,
                  transform: "rotate(45deg)",
                  background: "rgba(242,201,255,1)",
                  borderRadius: 2,
                  boxShadow: "0 0 10px rgba(242,201,255,0.45)",
                }}
              />
            </div>

            {/* Icons（位置可微调） */}
            <OrbitIcon
              ref={(el) => {
                iconRefs.current.career = el;
              }}
              title="Career"
              icon="/icon-career.png"
              active={selected === "career"}
              onClick={() => choose("career")}
              size={ICON}
              glyph={GLYPH}
              style={{ left: "50%", top: -24, transform: "translate(-50%, 0)" }}
            />

            <OrbitIcon
              ref={(el) => {
                iconRefs.current.love = el;
              }}
              title="Love"
              icon="/icon-love.png"
              active={selected === "love"}
              onClick={() => choose("love")}
              size={ICON}
              glyph={GLYPH}
              style={{ left: -1, bottom: 22 }}
            />

            <OrbitIcon
              ref={(el) => {
                iconRefs.current.health = el;
              }}
              title="Health"
              icon="/icon-health.png"
              active={selected === "health"}
              onClick={() => choose("health")}
              size={ICON}
              glyph={GLYPH}
              style={{ right: -1, bottom: 22 }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <button
            onClick={handleNext}
            disabled={!canContinue}
            className="w-full rounded-full font-semibold py-4 transition"
            style={{
              background: canContinue ? "#F2C9FF" : "rgba(236, 192, 249, 0.35)",
              color: canContinue ? "#1C1F4E" : "rgba(68, 63, 105, 0.65)",
              cursor: canContinue ? "pointer" : "not-allowed",
            }}
          >
            Next Step
          </button>

          <button
            onClick={() => router.back()}
            className="mt-4 w-full text-sm text-white/70 transition"
          >
            ← Back
          </button>
        </div>
      </div>
    </main>
  );
}

type OrbitIconProps = {
  title: string;
  icon: string;
  active: boolean;
  onClick: () => void;
  style: React.CSSProperties;
  size: number; // ✅ 你现在用到
  glyph: number; // ✅ 你现在用到
};

const OrbitIcon = forwardRef<HTMLButtonElement, OrbitIconProps>(
  function OrbitIcon({ title, icon, active, onClick, style, size, glyph }, ref) {
    return (
      <button
        ref={ref}
        onClick={onClick}
        type="button"
        className="absolute flex flex-col items-center gap-2 select-none"
        style={style}
      >
        <div
          className="relative grid place-items-center rounded-full transition-all"
          style={{
            width: size,
            height: size,
            background: active ? "#F2CBFF" : "rgba(28,31,78,0.85)",
            border: active
              ? "2px solid rgba(255,255,255,0.30)"
              : "2px solid rgba(242,201,255,0.28)",
            boxShadow: active
              ? "0 0 0 12px rgba(242, 199, 255, 0.14), 0 18px 26px rgba(0,0,0,0.35)"
              : "0 10px 18px rgba(0,0,0,0.25)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="relative" style={{ width: glyph, height: glyph }}>
            <Image
              src={icon}
              alt={title}
              fill
              priority
              className="object-contain"
              style={{
                // inactive 变白（PNG 快速方案）
                filter: active ? "none" : "brightness(0) invert(1)",
              }}
            />
          </div>
        </div>

        <div
          className="text-[18px] font-semibold tracking-[0.08em]"
          style={{
            color: "rgba(242,201,255,0.99)",
            textShadow: active ? "0 0 14px rgba(242,201,255,0.25)" : "none",
          }}
        >
          {title}
        </div>
      </button>
    );
  }
);

OrbitIcon.displayName = "OrbitIcon";