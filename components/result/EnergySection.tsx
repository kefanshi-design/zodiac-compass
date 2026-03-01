// components/result/EnergySection.tsx
"use client";

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

/** Simple SVG ring (single percentage) */
function Ring({
  value,
  color,
  emoji,
  size = 122,
  stroke = 13,
}: {
  value: number;
  color: string;
  emoji: string;
  size?: number;
  stroke?: number;
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

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-base leading-none">{emoji}</div>
        <div className="text-lg font-semibold leading-none mt-1">{pct}%</div>
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

  return (
    <section className="py-1 px-8 border-b border-white/0">
      <div className="w-full max-w-[580px] text-center">
        <h2 className="text-2xl font-semibold mb-8">{t(lang, "energyTitle")}</h2>

        <div className="grid grid-cols-2 gap-8 items-start">
          {/* Left: Elements */}
          <div className="flex flex-col items-center">
            <div className="scale-[0.99] origin-top">
              <Ring
                value={e1Val}
                color={elementColors[e1Key]}
                emoji={elementEmoji[e1Key]}
                size={122}
                stroke={13}
              />
            </div>

            <div className="mt-5" />

            <div className="text-center space-y-2">
              <div className="text-white/90 font-semibold">
                {elementEmoji[e1Key]} {t(lang, elementLabelKey(e1Key))} {e1Val}%
              </div>
              <div className="text-white/75 text-sm">
                {elementEmoji[e2Key]} {t(lang, elementLabelKey(e2Key))} {e2Val}%
              </div>

              <div className="mt-2 text-[#F2C9FF] text-sm">
                {t(lang, elementHintKey(e1Key))}
              </div>
            </div>
          </div>

          {/* Right: Yin/Yang */}
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