// components/result/EnergySection.tsx
"use client";

import React, { useMemo, useState } from "react";
import { elementColors, yinYangColors } from "@/src/lib/theme";
import { useLang } from "@/components/LanguageProvider";
import { t } from "@/src/lib/i18n";

type ElementKey = "metal" | "wood" | "water" | "fire" | "earth";
type YYKey = "yang" | "yin";

type Props = {
  data: {
    elements: Record<ElementKey, number>;
    yinYang: Record<YYKey, number>;
  };
};

const elementEmoji: Record<ElementKey, string> = {
  metal: "🪙",
  wood: "🌿",
  water: "💧",
  fire: "🔥",
  earth: "⛰️",
};

function clampPercent(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function getTop2<T extends string>(obj: Record<T, number>) {
  return (Object.entries(obj) as [T, number][])
    .map(([k, v]) => [k, clampPercent(v)] as [T, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);
}

/** ---------- Elements Pentagon (5 dashed axes + moving points + pink connections) ---------- */
function ElementsPentagon({
  elements,
  size,
}: {
  elements: Record<ElementKey, number>;
  size: number;
}) {
  const cx = size / 2;
  const cy = size / 2;

  const outerR = size * 0.35;
  const innerMin = size * 0.07;

  const order: ElementKey[] = ["metal", "wood", "water", "fire", "earth"];

  // 5等分角度：从上方开始顺时针
  const angles = order.map((_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / 5);

  const pts = order.map((k, i) => {
    const v = clampPercent(elements[k]);

    // ✅ 非线性映射：低值更“拉开”，高值更“压缩”
    const t = v / 100;
    const eased = Math.pow(t, 0.35);

    const r = innerMin + eased * (outerR - innerMin);

    const x = cx + Math.cos(angles[i]) * r;
    const y = cy + Math.sin(angles[i]) * r;
    return { k, v, x, y };
  });

  const polyPoints = pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} aria-hidden>
      {/* 5 等分虚线轴 */}
      {angles.map((a, i) => {
        const x2 = cx + Math.cos(a) * outerR;
        const y2 = cy + Math.sin(a) * outerR;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
        );
      })}

      {/* 粉色连接线（闭合五边形） */}
      <polygon
        points={polyPoints}
        fill="rgba(242,201,255,0.10)"
        stroke="#F2C9FF"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* 五个点（元素色） */}
      {pts.map((p) => (
        <circle
          key={p.k}
          cx={p.x}
          cy={p.y}
          r={5.4}
          fill={elementColors[p.k]}
          stroke="#1E204F"
          strokeWidth={3}
        />
      ))}

      {/* 中心点 */}
      <circle cx={cx} cy={cy} r={2.2} fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}

/** Simple SVG ring (single percentage) */
function Ring({
  value,
  color,
  emoji,
  size = 122,
  stroke = 13,
  center,
}: {
  value: number;
  color: string;
  emoji: string;
  size?: number;
  stroke?: number;
  center?: React.ReactNode;
}) {
  const R = (size - stroke) / 2;
  const C = 2 * Math.PI * R;
  const pct = clampPercent(value);
  const dash = (pct / 100) * C;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {center ? (
          <div className="flex items-center justify-center">{center}</div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="text-base leading-none">{emoji}</div>
            <div className="text-lg font-semibold leading-none mt-1">{pct}%</div>
          </div>
        )}
      </div>
    </div>
  );
}

function elementLabelKey(k: ElementKey) {
  switch (k) {
    case "metal":
      return "labelMetal";
    case "wood":
      return "labelWood";
    case "water":
      return "labelWater";
    case "fire":
      return "labelFire";
    case "earth":
      return "labelEarth";
  }
}

function elementHintKey(k: ElementKey) {
  switch (k) {
    case "metal":
      return "energyHintMetal";
    case "wood":
      return "energyHintWood";
    case "water":
      return "energyHintWater";
    case "fire":
      return "energyHintFire";
    case "earth":
      return "energyHintEarth";
  }
}

function yyLabelKey(k: YYKey) {
  return k === "yang" ? "labelYang" : "labelYin";
}

function yyHintKey(k: YYKey) {
  return k === "yang" ? "yyHintYang" : "yyHintYin";
}

/** 小圆点：替代 emoji */
function ColorDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-[10px] h-[10px] rounded-full mr-2 align-middle"
      style={{ backgroundColor: color }}
    />
  );
}

/** ✅ NEW: tooltip 内容（5个元素明细） */
function ElementsBreakdownTooltip({
  lang,
  elements,
}: {
  lang: "en" | "zh";
  elements: Record<ElementKey, number>;
}) {
  const order: ElementKey[] = ["metal", "wood", "water", "fire", "earth"];
  const rows = order.map((k) => ({
    k,
    v: clampPercent(elements[k]),
  }));

  return (
    <div
      className="w-[210px] rounded-xl border border-white/10 bg-[#0B1230]/95 backdrop-blur-md shadow-lg px-3 py-2"
      role="dialog"
      aria-label={t(lang, "energyBreakdownTitle")}
    >
      <div className="text-white/90 text-xs font-semibold mb-2">
        {t(lang, "energyBreakdownTitle")}
      </div>

      <div className="space-y-1">
        {rows.map((r) => (
          <div
            key={r.k}
            className="flex items-center justify-between text-xs text-white/80"
          >
            <div className="flex items-center">
              <ColorDot color={elementColors[r.k]} />
              <span>{t(lang, elementLabelKey(r.k))}</span>
            </div>
            <span className="tabular-nums">{r.v}%</span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-[11px] text-white/45">
        {t(lang, "energyBreakdownHint")}
      </div>
    </div>
  );
}

export default function EnergySection({ data }: Props) {
  const { lang } = useLang();

  const topElements = getTop2(data.elements);
  const topYY = getTop2(data.yinYang);

  const [e1, e2] = topElements;
  const [yy1, yy2] = topYY;

  const e1Key = (e1?.[0] ?? "fire") as ElementKey;
  const e1Val = e1?.[1] ?? 0;
  const e2Key = (e2?.[0] ?? "earth") as ElementKey;
  const e2Val = e2?.[1] ?? 0;

  const yy1Key = (yy1?.[0] ?? "yang") as YYKey;
  const yy1Val = yy1?.[1] ?? 0;
  const yy2Key = (yy2?.[0] ?? "yin") as YYKey;
  const yy2Val = yy2?.[1] ?? 0;

  // ✅ NEW: tooltip open state (hover + click/tap)
  const [elementsTipOpen, setElementsTipOpen] = useState(false);

  // 让 tooltip 的展示更稳定：避免频繁 re-render
  const elementsTooltip = useMemo(() => {
    return <ElementsBreakdownTooltip lang={lang} elements={data.elements} />;
  }, [lang, data.elements]);

  return (
    <section className="py-1 px-8 border-b border-white/0">
      <div className="w-full max-w-[580px] text-center">
        <h2 className="text-2xl font-semibold mb-8">{t(lang, "energyTitle")}</h2>

        <div className="grid grid-cols-2 gap-8 items-start">
          {/* Left: Elements */}
          <div className="flex flex-col items-center">
            {/* ✅ 包一层相对定位：用于 tooltip */}
            <div
              className="relative"
              onMouseEnter={() => setElementsTipOpen(true)}
              onMouseLeave={() => setElementsTipOpen(false)}
            >
              {/* 点击/触摸：切换 tooltip（移动端可用） */}
              <button
                type="button"
                className="cursor-pointer select-none"
                aria-label={t(lang, "energyBreakdownTitle")}
                aria-expanded={elementsTipOpen}
                onClick={() => setElementsTipOpen((v) => !v)}
              >
                <div className="scale-[0.99] origin-top">
                  <Ring
                    value={e1Val}
                    color={elementColors[e1Key]}
                    emoji={elementEmoji[e1Key]}
                    size={122}
                    stroke={13}
                    center={<ElementsPentagon elements={data.elements} size={122} />}
                  />
                </div>
              </button>

              {/* ✅ Tooltip：默认隐藏，hover / click 显示 */}
              {elementsTipOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20">
                  {elementsTooltip}
                </div>
              )}
            </div>

            <div className="mt-5" />

            <div className="text-center space-y-2">
              <div className="text-white/90 font-semibold">
                <ColorDot color={elementColors[e1Key]} />
                {t(lang, elementLabelKey(e1Key))} {e1Val}%
              </div>

              <div className="text-white/75 text-sm">
                <ColorDot color={elementColors[e2Key]} />
                {t(lang, elementLabelKey(e2Key))} {e2Val}%
              </div>

              <div className="mt-2 text-[#F2C9FF] text-sm">
                {t(lang, elementHintKey(e1Key))}
              </div>
            </div>
          </div>

          {/* Right: Yin/Yang (保持原样) */}
          <div className="flex flex-col items-center">
            <div className="scale-[0.99] origin-top">
              <Ring
                value={yy1Val}
                color={yinYangColors[yy1Key]}
                emoji={yy1Key === "yang" ? "☀️" : "🌙"}
                size={122}
                stroke={13}
              />
            </div>

            <div className="mt-5" />

            <div className="text-center space-y-2">
              <div className="text-white/90 font-semibold">
                {yy1Key === "yang" ? "☀️" : "🌙"} {t(lang, yyLabelKey(yy1Key))}{" "}
                {yy1Val}%
              </div>
              <div className="text-white/75 text-sm">
                {yy2Key === "yang" ? "☀️" : "🌙"} {t(lang, yyLabelKey(yy2Key))}{" "}
                {yy2Val}%
              </div>

              <div className="mt-2 text-[#F2C9FF] text-sm">
                {t(lang, yyHintKey(yy1Key))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}