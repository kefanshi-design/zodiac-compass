import { elementColors, yinYangColors } from "@/src/lib/theme";

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

const elementLabel: Record<ElementKey, string> = {
  metal: "Metal",
  wood: "Wood",
  water: "Water",
  fire: "Fire",
  earth: "Earth",
};

const elementHint: Record<ElementKey, string> = {
  metal: "Focus • Structure",
  wood: "Growth • Renewal",
  water: "Flow • Intuition",
  fire: "Action • Passion",
  earth: "Stability • Grounded",
};

const yyEmoji: Record<YYKey, string> = {
  yang: "☀️",
  yin: "🌙",
};

const yyLabel: Record<YYKey, string> = {
  yang: "Yang",
  yin: "Yin",
};

const yyHint: Record<YYKey, string> = {
  yang: "Drive • Outgoing",
  yin: "Reflect • Calm",
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

export default function EnergySection({ data }: Props) {
  const topElements = getTop2(data.elements);
  const topYY = getTop2(data.yinYang);

  const [e1, e2] = topElements;
  const [yy1, yy2] = topYY;

  const e1Key = e1?.[0] ?? "fire";
  const e1Val = e1?.[1] ?? 0;
  const e2Key = e2?.[0] ?? "earth";
  const e2Val = e2?.[1] ?? 0;

  const yy1Key = yy1?.[0] ?? "yang";
  const yy1Val = yy1?.[1] ?? 0;
  const yy2Key = yy2?.[0] ?? "yin";
  const yy2Val = yy2?.[1] ?? 0;

  return (
    <section className="py-10 px-6 border-b border-white/10">
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Your Energy &amp; Element Balance
        </h2>

        <div className="grid grid-cols-2 gap-8 items-start">
          {/* Left: Elements */}
          <div className="flex flex-col items-center">
            <div className="scale-[0.96] origin-top">
              <Ring
                value={e1Val}
                color={elementColors[e1Key]}
                emoji={elementEmoji[e1Key]}
                size={122}
                stroke={13}
              />
            </div>

            <div className="mt-3" />

            <div className="text-center space-y-2">
              <div className="text-white/90 font-semibold">
                {elementEmoji[e1Key]} {elementLabel[e1Key]} {e1Val}%
              </div>
              <div className="text-white/75 text-sm">
                {elementEmoji[e2Key]} {elementLabel[e2Key]} {e2Val}%
              </div>

              <div className="mt-2 text-[#F2C9FF] text-sm">
                {elementHint[e1Key]}
              </div>
            </div>
          </div>

          {/* Right: Yin/Yang */}
          <div className="flex flex-col items-center">
            <div className="scale-[0.96] origin-top">
              <Ring
                value={yy1Val}
                color={yinYangColors[yy1Key]}
                emoji={yyEmoji[yy1Key]}
                size={122}
                stroke={13}
              />
            </div>

            <div className="mt-3" />

            <div className="text-center space-y-2">
              <div className="text-white/90 font-semibold">
                {yyEmoji[yy1Key]} {yyLabel[yy1Key]} {yy1Val}%
              </div>
              <div className="text-white/75 text-sm">
                {yyEmoji[yy2Key]} {yyLabel[yy2Key]} {yy2Val}%
              </div>

              <div className="mt-2 text-[#F2C9FF] text-sm">
                {yyHint[yy1Key]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
