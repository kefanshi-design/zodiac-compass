"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { zodiacArt } from "@/src/lib/zodiacArt";
import { constellationArt } from "@/src/lib/constellationArt";

type Props = {
  data: {
    name: string;
    zodiac: string; // ✅ 生肖（左下）
    constellation: string; // ✅ 星座（右上）
    cardGradient?: {
      from: string;
      to: string;
    };
  };
};

// ---------- Lucky cue helpers (stable per day) ----------
function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function getDayKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const LUCKY_CUES = [
  { title: "Lucky Cue", text: "Choose one grounded step. Keep it small and finish it." },
  { title: "Lucky Cue", text: "Slow down your first response. Clarity comes after one breath." },
  { title: "Lucky Cue", text: "Protect your energy: say “not today” to one unnecessary thing." },
  { title: "Lucky Cue", text: "Be honest and simple. Don’t over-explain—just be clear." },
  { title: "Lucky Cue", text: "Pick the kindest option that still respects your boundary." },
  { title: "Lucky Cue", text: "Do the easiest 5-minute action first. Momentum will follow." },
  { title: "Lucky Cue", text: "Stay curious. Ask one good question instead of guessing." },
  { title: "Lucky Cue", text: "Return to your body: water, stretch, and a softer pace." },
  { title: "Lucky Cue", text: "Make space for delight—one tiny playful moment is enough." },
  { title: "Lucky Cue", text: "Focus on what matters: one priority, one message, one decision." },
];

// ---------- Star shower helpers ----------
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type StarMeteor = {
  id: string;
  kind: "big" | "small";
  startLeftPct: number; // start x in %
  startTopPct: number; // start y in %
  delay: number; // seconds
  duration: number; // seconds
  sizePx: number; // width/height
  rotateDeg: number; // slight random rotate
  opacity: number;
  blurPx: number;
};

export default function IdentitySection({ data }: Props) {
  const from = data.cardGradient?.from ?? "#FF8A4C";
  const to = data.cardGradient?.to ?? "#FFD36B";

  const zodiacKey = data.zodiac.toLowerCase() as keyof typeof zodiacArt;
  const constellationKey =
    data.constellation.toLowerCase() as keyof typeof constellationArt;

  const zodiacSrc = zodiacArt[zodiacKey];
  const constellationSrc = constellationArt[constellationKey];

  // ✅ time/date (avoid hydration mismatch)
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const timeText = useMemo(() => {
    if (!now) return "";
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(now);
  }, [now]);

  const dateText = useMemo(() => {
    if (!now) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(now);
  }, [now]);

  // ✅ flip
  const [flipped, setFlipped] = useState(false);

  // ✅ lucky cue stable per day + identity
  const lucky = useMemo(() => {
    if (!now) return LUCKY_CUES[0];
    const seed = `${data.name}|${data.zodiac}|${data.constellation}|${getDayKey(now)}`;
    const idx = hashString(seed) % LUCKY_CUES.length;
    return LUCKY_CUES[idx];
  }, [now, data.name, data.zodiac, data.constellation]);

  // ✅ hover 的“贴边柔光”
  const hoverGlowShadow =
    "group-hover:shadow-[0_0_0_1px_rgba(255,224,120,0.22),0_0_22px_rgba(255,210,90,0.30),0_0_60px_rgba(255,210,90,0.18)]";

  // =========================
  // ✅ Full-page star meteor shower (5s)
  // =========================
  const [showShower, setShowShower] = useState(false);
  const [showerKey, setShowerKey] = useState(0);
  const timerRef = useRef<number | null>(null);

  const starMeteors = useMemo<StarMeteor[]>(() => {
    // 你要“很多”，这里给足但不会太夸张（想更密就把 46 -> 70）
    const COUNT = 180;

    return Array.from({ length: COUNT }).map((_, i) => {
      const isBig = Math.random() < 0.38; // big 比例
      const kind: "big" | "small" = isBig ? "big" : "small";

      // 起点：偏上方 & 左侧更容易“划进来”（也会有少量从右上开始）
      const startLeftPct = rand(-15, 105);
      const startTopPct = rand(-20, 55);

      // 5 秒内陆续出现
      const delay = rand(0, 3.2);

      // 每颗星划过的速度（越小越快）
      const duration = rand(1.9, 2.65);

      const sizePx = kind === "big" ? rand(22, 34) : rand(12, 18);

      return {
        id: `star-${showerKey}-${i}`,
        kind,
        startLeftPct,
        startTopPct,
        delay,
        duration,
        sizePx,
        rotateDeg: rand(-35, 15),
        opacity: rand(0.55, 1),
        blurPx: kind === "big" ? rand(0, 0.6) : rand(0, 0.3),
      };
    });
  }, [showerKey]);

  const triggerShower = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setShowerKey((k) => k + 1);
    setShowShower(true);

    timerRef.current = window.setTimeout(() => {
      setShowShower(false);
      timerRef.current = null;
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  // ✅ 只在“翻到背面”那一下触发
  const handleFlip = () => {
    setFlipped((v) => {
      const next = !v;
      if (next) triggerShower();
      return next;
    });
  };

  return (
    <section className="py-10 px-6 border-none border-white/0">
      {/* ✅ Fullscreen star meteors overlay */}
      {showShower && (
        <div className="pointer-events-none fixed inset-0 z-[10] overflow-hidden">


          {starMeteors.map((s) => {
            const src = s.kind === "big" ? "/star-big.png" : "/star-small.png";

            return (
              <div
                key={s.id}
                className="zc-star-meteor"
                style={{
                  left: `${s.startLeftPct}%`,
                  top: `${s.startTopPct}%`,
                  width: `${s.sizePx}px`,
                  height: `${s.sizePx}px`,
                  opacity: s.opacity,
                  filter: `drop-shadow(0 0 10px rgba(255,220,140,0.22)) blur(${s.blurPx}px)`,
                  transform: `rotate(${s.rotateDeg}deg)`,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                }}
              >
                <Image
                  src={src}
                  alt={s.kind === "big" ? "star big" : "star small"}
                  width={Math.round(s.sizePx)}
                  height={Math.round(s.sizePx)}
                  className="select-none"
                  priority
                />
              </div>
            );
          })}

          <style jsx global>{`
            .zc-star-meteor {
              position: absolute;
              will-change: transform, opacity;
              /* 关键：让它斜着划过（方向统一像流星雨） */
              animation-name: zcStarMeteor;
              animation-timing-function: cubic-bezier(0.18, 0.9, 0.2, 1);
              animation-fill-mode: both;
            }

            @keyframes zcStarMeteor {
              0% {
                transform: translate3d(0, 0, 0) rotate(var(--r, -18deg));
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              100% {
                /* 斜向右下划过，全屏覆盖足够远，保证离开视野 */
                transform: translate3d(1100px, 800px, 0) rotate(var(--r, -18deg));
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      <div className="w-full max-w-[520px]">
        <h2 className="text-lg font-semibold mb-6 text-white"></h2>

        {/* ✅ group 放在最外层，保证前后卡片 hover 都生效 */}
        <div className="group relative z-[20]" style={{ perspective: "1200px" }}>
          {/* clickable */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Zodiac card. Click to reveal lucky cue."
            onClick={handleFlip}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleFlip();
            }}
            className="relative cursor-pointer select-none outline-none"
          >
            {/* 3D inner */}
            <div
              className="relative"
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 600ms cubic-bezier(.2,.8,.2,1)",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* ================= FRONT ================= */}
              <div
                className={[
                  "rounded-3xl p-6 text-[#1C1F4E] relative",
                  "transition-all duration-300",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
                  hoverGlowShadow,
                  "group-hover:-translate-y-[1px]",
                ].join(" ")}
                style={{
                  background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="font-semibold text-2xl leading-none">{data.name}</div>
                  <div className="font-semibold text-sm opacity-90">{data.constellation}</div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-6 items-center">
                  <div className="relative h-[180px] w-full">
                    {zodiacSrc ? (
                      <Image
                        src={zodiacSrc}
                        alt={`${data.zodiac} art`}
                        fill
                        className="object-contain"
                        sizes="240px"
                        priority
                      />
                    ) : (
                      <span className="text-sm opacity-70">Zodiac Art</span>
                    )}
                  </div>

                  <div className="relative h-[180px] w-full">
                    {constellationSrc ? (
                      <Image
                        src={constellationSrc}
                        alt={`${data.constellation} art`}
                        fill
                        className="object-contain"
                        sizes="240px"
                        priority
                      />
                    ) : (
                      <span className="text-sm opacity-70">Constellation Art</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 font-semibold text-sm opacity-90">{data.zodiac}</div>

                <div className="absolute bottom-4 right-5 text-[11px] font-semibold text-[#1C1F4E]/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Tap to reveal
                </div>
              </div>

              {/* ================= BACK ================= */}
              <div
                className={[
                  "absolute inset-0 rounded-3xl p-6 text-white/80",
                  "transition-all duration-300",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
                  hoverGlowShadow,
                  "group-hover:-translate-y-[1px]",
                ].join(" ")}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 100%)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white/80">
                      Your Lucky Insight Today
                    </div>

                    <div className="mt-4 text-3xl font-semibold">{lucky.title}</div>

                    <p className="mt-4 text-xl text-[#F2C9FF] font-semibold leading-relaxed">
                      {lucky.text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">Based on today’s vibe</div>
                    <div className="text-xs font-semibold text-white/80">Tap to flip back</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ time/date pills */}
        <div className="mt-6 flex items-center gap-3">
          {!!timeText && (
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
              {timeText}
            </span>
          )}
          {!!dateText && (
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
              {dateText}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}