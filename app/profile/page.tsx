"use client";

import Image from "next/image";
import React, { forwardRef, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type PathKey = "career" | "love" | "health";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

function clampLen(v: string, len: number) {
  return v.slice(0, len);
}

function isIntInRange(v: string, min: number, max: number) {
  if (v.trim() === "") return false;
  const n = Number(v);
  if (!Number.isInteger(n)) return false;
  return n >= min && n <= max;
}

// ✅ 你原本 path 用到的 size
const ICON = 70;
const GLYPH = 36;

export default function ProfilePage() {
  const router = useRouter();

  // ===== Profile state =====
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const isProfileValid = useMemo(() => {
    const nameOk = name.trim().length > 0;
    const dayOk = isIntInRange(day, 1, 31);
    const monthOk = isIntInRange(month, 1, 12);
    const yearOk = year.length === 4 && isIntInRange(year, 1900, 2099);
    return nameOk && dayOk && monthOk && yearOk;
  }, [name, day, month, year]);

  // ===== Path state (merged) =====
  const [selected, setSelected] = useState<PathKey | null>(null);

  const diskRef = useRef<HTMLDivElement | null>(null);
  const iconRefs = useRef<Record<PathKey, HTMLButtonElement | null>>({
    career: null,
    love: null,
    health: null,
  });

  // 指针角度：0=向右，-90=向上
  const [pointerDeg, setPointerDeg] = useState<number>(-90);

  // 外圈高光
  const [glowPos, setGlowPos] = useState<{ x: number; y: number }>({
    x: 50,
    y: 22,
  });

  const canContinue = isProfileValid && selected !== null;

  const handleNext = () => {
    if (!canContinue || !selected) return;

    const payload = {
      name: name.trim(),
      day: day.trim(),
      month: month.trim(),
      year: year.trim(),
      path: selected,
    };

    const qs = new URLSearchParams(payload).toString();
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
    // ✅ 1) 轻微缩小上下 padding：减少整体高度
    <main className="min-h-screen bg-[#1C1F4E] text-white px-6 py-8">
      {/* ✅ 2) 用 flex-column 把 CTA 放进同一个“屏幕高度容器”里 */}
      <div className="mx-auto w-full max-w-[1100px] min-h-[calc(100vh-64px)] flex flex-col">
        {/* ✅ 内容区：占满剩余高度（flex-1），CTA 自动留在底部 */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ================= Left: Profile ================= */}
          <section className="w-full">
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight mb-3">
              Tell me about you and what you want to explore today?
            </h1>

            <p className="text-base text-[#F2C9FF] mb-8 max-w-[520px]">
              This helps us find your Zodiac Animals, blended with astrology for daily personality insights.
            </p>

            {/* Name */}
            <label className="text-sm mb-2 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full max-w-[520px] rounded-xl bg-white text-black px-4 py-3 mb-6 outline-none"
            />

            {/* Date of Birth */}
            <label className="text-sm mb-2 block">Date of Birth</label>
            <div className="flex gap-3 max-w-[520px]">
              <input
                inputMode="numeric"
                placeholder="DD"
                value={day}
                onChange={(e) => setDay(clampLen(onlyDigits(e.target.value), 2))}
                className="w-1/3 rounded-xl bg-white text-black px-4 py-3 outline-none"
              />
              <input
                inputMode="numeric"
                placeholder="MM"
                value={month}
                onChange={(e) => setMonth(clampLen(onlyDigits(e.target.value), 2))}
                className="w-1/3 rounded-xl bg-white text-black px-4 py-3 outline-none"
              />
              <input
                inputMode="numeric"
                placeholder="YYYY"
                value={year}
                onChange={(e) => setYear(clampLen(onlyDigits(e.target.value), 4))}
                className="w-1/3 rounded-xl bg-white text-black px-4 py-3 outline-none"
              />
            </div>

            <p className="mt-6 text-sm text-white/60 leading-relaxed">
              Private moment only ✨ We don’t store your profile data.
            </p>
          </section>

          {/* ================= Right: Compass (Path) ================= */}
          <section className="w-full flex flex-col items-center">
            <div
              className="relative flex items-center justify-center w-full"
              onMouseMove={onAreaMove}
              onMouseLeave={onAreaLeave}
            >
              <div ref={diskRef} className="relative" style={{ width: 360, height: 360 }}>
                {/* 外圈高光 */}
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
                    width: 170,
                    height: 170,
                    background: "rgba(239, 180, 255, 0.12)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
                  }}
                />

                {/* 指针 */}
                <div
                  className="absolute left-1/2 top-1/2 origin-[0%_50%]"
                  style={{
                    width: 67,
                    height: 6,
                    transform: `translate(-2px, -50%) rotate(${selected ? pointerDeg : -90}deg)`,
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

                {/* Icons */}
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
          </section>
        </div>

        {/* ================= Bottom CTA（现在不会掉到屏幕外） ================= */}
        {/* ✅ 3) CTA 宽度变短：max-w + 居中 */}
        <div className="pt-6 flex flex-col items-center">
          <button
            onClick={handleNext}
            disabled={!canContinue}
            className="w-full max-w-[380px] rounded-full font-semibold py-4 transition"
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
            className="mt-4 w-full max-w-[380px] text-sm text-white/70 hover:text-white transition"
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
  size: number;
  glyph: number;
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