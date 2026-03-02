// app/profile/profile-client.tsx
"use client";

import Image from "next/image";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import LanguageToggle from "@/components/LanguageToggle";
import { useLang } from "@/components/LanguageProvider";
import { t } from "@/src/lib/i18n";

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

const ICON = 70;
const GLYPH = 36;

type FallingStar = {
  id: string;
  src: "/star-small.png" | "/star-big.png";
  leftPct: number;
  size: number;
  durationMs: number;
  dxPx: number;
  opacity: number;
};

export default function ProfileClient() {
  const router = useRouter();
  const { lang } = useLang();

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

  const [pointerDeg, setPointerDeg] = useState<number>(-90);

  const [glowPos, setGlowPos] = useState<{ x: number; y: number }>({
    x: 50,
    y: 22,
  });

  const canContinue = isProfileValid && selected !== null;

  // ===== Falling stars =====
  const [stars, setStars] = useState<FallingStar[]>([]);

  useEffect(() => {
    function spawnStar() {
      const isBig = Math.random() < 0.35;
      const src = (isBig ? "/star-big.png" : "/star-small.png") as FallingStar["src"];

      const size = isBig ? Math.floor(18 + Math.random() * 14) : Math.floor(10 + Math.random() * 8);
      const leftPct = 6 + Math.random() * 88;
      const durationMs = Math.floor(2600 + Math.random() * 1800);
      const dxPx = Math.floor(-40 + Math.random() * 80);
      const opacity = 0.65 + Math.random() * 0.35;

      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const star: FallingStar = { id, src, leftPct, size, durationMs, dxPx, opacity };

      setStars((prev) => {
        const next = [...prev, star];
        return next.length > 26 ? next.slice(next.length - 26) : next;
      });

      window.setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== id));
      }, durationMs + 120);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Shift" || e.key === "Alt" || e.key === "Meta" || e.key === "Control") return;
      if (e.repeat) return;
      spawnStar();
    }

    window.addEventListener("keydown", onKeyDown, { passive: true });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
    <main
      className={[
        "relative bg-[#1C1F4E] text-white overflow-x-hidden",
        // ✅ mobile 允许滚动；lg 尽量锁定一屏不滚动
        "min-h-screen lg:h-screen lg:overflow-hidden",
      ].join(" ")}
    >
      {/* Falling stars background */}
      <style jsx global>{`
        @keyframes zc-fall-star {
          0% {
            transform: translate3d(0, -48px, 0) rotate(0deg);
            opacity: var(--op, 0.9);
          }
          70% {
            opacity: var(--op, 0.9);
          }
          100% {
            transform: translate3d(var(--dx, 0px), calc(100vh + 80px), 0) rotate(240deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 z-0">
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute"
            style={{
              left: `${s.leftPct}%`,
              top: 0,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animation: `zc-fall-star ${s.durationMs}ms linear forwards`,
              ["--dx" as any]: `${s.dxPx}px`,
              ["--op" as any]: `${s.opacity}`,
              filter: "drop-shadow(0 0 10px rgba(242,201,255,0.22))",
            }}
          >
            <Image src={s.src} alt="" width={s.size} height={s.size} />
          </div>
        ))}
      </div>

      {/* ✅ 统一的页面容器：把 toggle 放进 flow（不重叠） */}
      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6 py-6 lg:py-8 h-full flex flex-col">
        {/* Header: Language toggle (in-flow, no overlap) */}
        <div className="flex justify-end mb-6 lg:mb-8 shrink-0">
          <LanguageToggle />
        </div>

        {/* Content */}
        <div
          className={[
            "flex-1 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] items-center",
            // ✅ 减少 gap，让 desktop 更容易一屏容纳
            "gap-12 lg:gap-14",
          ].join(" ")}
        >
          {/* Left: form */}
          <section className="w-full">
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight mb-3">
              {t(lang, "profileTitle")}
            </h1>

            <p className="text-base text-[#F2C9FF] mb-6 max-w-[520px]">
              {t(lang, "profileSubtitle")}
            </p>

            <label className="text-sm mb-2 block">{t(lang, "nameLabel")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t(lang, "nameLabel")}
              className="w-full max-w-[520px] rounded-xl bg-white text-black px-4 py-3 mb-5 outline-none"
            />

            <label className="text-sm mb-2 block">{t(lang, "dobLabel")}</label>
            <div className="flex gap-3 max-w-[520px]">
              <input
                inputMode="numeric"
                placeholder={t(lang, "day")}
                value={day}
                onChange={(e) => setDay(clampLen(onlyDigits(e.target.value), 2))}
                className="w-1/3 rounded-xl bg-white text-black px-4 py-3 outline-none"
              />
              <input
                inputMode="numeric"
                placeholder={t(lang, "month")}
                value={month}
                onChange={(e) => setMonth(clampLen(onlyDigits(e.target.value), 2))}
                className="w-1/3 rounded-xl bg-white text-black px-4 py-3 outline-none"
              />
              <input
                inputMode="numeric"
                placeholder={t(lang, "year")}
                value={year}
                onChange={(e) => setYear(clampLen(onlyDigits(e.target.value), 4))}
                className="w-1/3 rounded-xl bg-white text-black px-4 py-3 outline-none"
              />
            </div>

            <p className="mt-5 text-sm text-white/60 leading-relaxed">
              {t(lang, "profilePrivacyNote")}
            </p>
          </section>

          {/* Right: compass */}
          <section className="w-full flex flex-col items-center lg:items-end">
            <div
              className="relative flex items-center justify-center w-full"
              onMouseMove={onAreaMove}
              onMouseLeave={onAreaLeave}
            >
              {/* ✅ responsive：mobile 稍小一点，避免把一屏撑爆；desktop 保持你原来的 360 */}
              <div
                ref={diskRef}
                className="relative"
                style={{
                  width: 360,
                  height: 360,
                }}
              >
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

                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: 170,
                    height: 170,
                    background: "rgba(239, 180, 255, 0.12)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
                  }}
                />

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

                <OrbitIcon
                  ref={(el) => {
                    iconRefs.current.career = el;
                  }}
                  title={t(lang, "pathCareer")}
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
                  title={t(lang, "pathLove")}
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
                  title={t(lang, "pathHealth")}
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

        {/* Footer buttons */}
        <div className="pt-2 flex flex-col items-center mt-6 lg:mt-4 shrink-0">
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
            {t(lang, "nextStep")}
          </button>

          <button
            onClick={() => router.back()}
            className="mt-4 w-full max-w-[380px] text-sm text-white/70 hover:text-white transition"
          >
            {t(lang, "back")}
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

const OrbitIcon = forwardRef<HTMLButtonElement, OrbitIconProps>(function OrbitIcon(
  { title, icon, active, onClick, style, size, glyph },
  ref
) {
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
          border: active ? "2px solid rgba(255,255,255,0.30)" : "2px solid rgba(242,201,255,0.28)",
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
});

OrbitIcon.displayName = "OrbitIcon";