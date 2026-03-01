// src/lib/readingEngine.ts
import type { Lang } from "@/src/lib/i18n";

export type PathKey = "career" | "love" | "health";
export type ElementKey = "metal" | "wood" | "water" | "fire" | "earth";
export type YYKey = "yang" | "yin";

export type EnergyData = {
  elements: Record<ElementKey, number>;
  yinYang: Record<YYKey, number>;
};

export type ReadingData = {
  headline: string;
  paragraph1: string;
  paragraph2: string;
  mixTitle: string;
};

export type TipsData = {
  bestTo: string;
  watchOut: string;
  powerWords: string[];
};

export type ReadingInput = {
  lang: Lang; // ✅ 新增
  name: string;
  zodiac: string;
  constellation: string;
  path: PathKey;
  energy: EnergyData;
};

// ===== bilingual dictionaries (engine-level content) =====
const elementAdj: Record<Lang, Record<ElementKey, string>> = {
  en: {
    metal: "focused",
    wood: "growing",
    water: "intuitive",
    fire: "driven",
    earth: "steady",
  },
  zh: {
    metal: "更专注",
    wood: "更有成长感",
    water: "更直觉",
    fire: "更有冲劲",
    earth: "更稳",
  },
};

const yyAdj: Record<Lang, Record<YYKey, string>> = {
  en: {
    yang: "bold",
    yin: "reflective",
  },
  zh: {
    yang: "更外放",
    yin: "更内观",
  },
};

const elementZhLabel: Record<ElementKey, string> = {
  metal: "金",
  wood: "木",
  water: "水",
  fire: "火",
  earth: "土",
};

function topKey<T extends string>(obj: Record<T, number>): T {
  return (Object.entries(obj) as [T, number][])
    .slice()
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0] as T;
}

function mixTitleByPath(lang: Lang, path: PathKey) {
  if (lang === "zh") {
    return path === "career"
      ? "今日事业能量组合"
      : path === "love"
      ? "今日感情能量组合"
      : "今日健康能量组合";
  }

  return path === "career"
    ? "Today's Work Energy Mix"
    : path === "love"
    ? "Today's Romance Energy Mix"
    : "Today's Healthy Energy Mix";
}

function paragraph2ByCombo(lang: Lang, path: PathKey, e: ElementKey, yy: YYKey) {
  if (lang === "zh") {
    const base =
      yy === "yin"
        ? "先慢一点，先观察，再迈出一个清晰的小步。"
        : "可以早点行动，但决定要干净、简单。";

    const elementLine =
      e === "metal"
        ? "优先建立结构、边界和一个明确目标。"
        : e === "wood"
        ? "更适合学习、迭代，做一点小推进。"
        : e === "water"
        ? "相信你的信号，多反思，并保持日程弹性。"
        : e === "fire"
        ? "自信推进，但在承诺之前再检查一次细节。"
        : "保持踏实，抓住重点，并保护你的能量。";

    const pathLine =
      path === "career"
        ? "把重点放在执行，而不是完美。"
        : path === "love"
        ? "真诚、温柔，不要过度解读对方信号。"
        : "选择平衡：补水、休息，再做一次温和的重置。";

    return `${base}${elementLine}${pathLine}`;
  }

  // EN (original logic)
  const base =
    yy === "yin"
      ? "Slow down, observe first, then take one clear step."
      : "Take action early, but keep decisions clean and simple.";

  const elementLine =
    e === "metal"
      ? "Prioritize structure, boundaries, and one clear goal."
      : e === "wood"
      ? "Lean into learning, iteration, and small momentum."
      : e === "water"
      ? "Trust signals, reflect, and keep your schedule flexible."
      : e === "fire"
      ? "Move with confidence—then double-check details before you commit."
      : "Stay grounded, pick what matters, and protect your energy.";

  const pathLine =
    path === "career"
      ? "Focus on execution over perfection."
      : path === "love"
      ? "Be honest, warm, and avoid over-reading signals."
      : "Choose balance: hydration, rest, and one gentle reset.";

  return `${base} ${elementLine} ${pathLine}`;
}

function tipsByCombo(lang: Lang, path: PathKey, e: ElementKey, yy: YYKey): TipsData {
  if (lang === "zh") {
    const bestTo =
      yy === "yin"
        ? "更适合靠近安静、稳定的人，以及低噪音的环境。"
        : "更适合靠近积极、有支持感的人，帮助你推进。";

    const watchOut =
      yy === "yin"
        ? "避免嘈杂、赶时间的沟通，以及被迫快速做决定。"
        : "避免过度承诺、冲动决定，以及忽略休息。";

    const pwBase =
      path === "career"
        ? ["专注", "清晰", "执行"]
        : path === "love"
        ? ["温柔", "真诚", "节奏"]
        : ["平衡", "休息", "重置"];

    const pwElement =
      e === "metal"
        ? ["结构"]
        : e === "wood"
        ? ["成长"]
        : e === "water"
        ? ["直觉"]
        : e === "fire"
        ? ["勇气"]
        : ["踏实"];

    const pwYY = yy === "yin" ? ["内观"] : ["行动"];

    const powerWords = Array.from(new Set([...pwYY, ...pwElement, ...pwBase])).slice(0, 3);

    return { bestTo, watchOut, powerWords };
  }

  // EN (original logic)
  const bestTo =
    yy === "yin"
      ? "Calm, steady people and quiet environments."
      : "Energetic, supportive people who help you move forward.";

  const watchOut =
    yy === "yin"
      ? "Noise, rushed conversations, and pressure to decide too fast."
      : "Over-commitment, impulsive decisions, and skipping rest.";

  const pwBase =
    path === "career"
      ? ["Focus", "Clarity", "Execution"]
      : path === "love"
      ? ["Warmth", "Honesty", "Timing"]
      : ["Balance", "Rest", "Reset"];

  const pwElement =
    e === "metal"
      ? ["Structure"]
      : e === "wood"
      ? ["Growth"]
      : e === "water"
      ? ["Intuition"]
      : e === "fire"
      ? ["Courage"]
      : ["Grounded"];

  const pwYY = yy === "yin" ? ["Reflect"] : ["Act"];

  const powerWords = Array.from(new Set([...pwYY, ...pwElement, ...pwBase])).slice(0, 3);

  return { bestTo, watchOut, powerWords };
}

/**
 * ✅ IMPORTANT:
 * This file MUST export `computeReading`
 * because app/result/page.tsx imports it by that name.
 *
 * Return shape:
 * { reading: ReadingData; tips: TipsData }
 */
export function computeReading(input: ReadingInput): { reading: ReadingData; tips: TipsData } {
  const { lang } = input;

  const topElement = topKey(input.energy.elements);
  const topYY = topKey(input.energy.yinYang);

  const mixTitle = mixTitleByPath(lang, input.path);

  // headline
  const headline = (() => {
  if (lang !== "zh") {
    return `Hi ${input.name}! You are ${yyAdj.en[topYY]} and ${elementAdj.en[topElement]}, with a ${input.constellation} × ${input.zodiac} vibe.`;
  }

  // ✅ 仅在 headline 中把英文星座/生肖映射为中文显示
  const constZhMap: Record<string, string> = {
    Aries: "白羊座",
    Taurus: "金牛座",
    Gemini: "双子座",
    Cancer: "巨蟹座",
    Leo: "狮子座",
    Virgo: "处女座",
    Libra: "天秤座",
    Scorpio: "天蝎座",
    Sagittarius: "射手座",
    Capricorn: "摩羯座",
    Aquarius: "水瓶座",
    Pisces: "双鱼座",
  };

  const zodiacZhMap: Record<string, string> = {
    Rat: "鼠",
    Ox: "牛",
    Tiger: "虎",
    Rabbit: "兔",
    Dragon: "龙",
    Snake: "蛇",
    Horse: "马",
    Goat: "羊",
    Monkey: "猴",
    Rooster: "鸡",
    Dog: "狗",
    Pig: "猪",
  };

  const cZh = constZhMap[input.constellation] ?? input.constellation;
  const zZh = zodiacZhMap[input.zodiac] ?? input.zodiac;

  return `嗨，${input.name}！你今天偏${yyAdj.zh[topYY]}、${elementAdj.zh[topElement]}（${cZh} × ${zZh} 的组合）。`;
})();
  // paragraph1
  const paragraph1 =
    lang === "zh"
      ? topYY === "yin"
        ? `今天的能量更偏“阴”，而${elementZhLabel[topElement]}的倾向会帮助你保持平衡与清晰。保持简单，留意什么是自然流动的。`
        : `今天的能量更偏“阳”，会推动你向前，而${elementZhLabel[topElement]}的倾向会让你的方向更清楚。带着意图推进，同时保护好专注力。`
      : topYY === "yin"
      ? `Your Yin energy shapes how you show up today, while ${topElement} helps you stay balanced and clear. Keep it simple and notice what feels natural.`
      : `Your Yang energy pushes you forward today, while ${topElement} keeps your direction sharp. Move with intention and protect your focus.`;

  const paragraph2 = paragraph2ByCombo(lang, input.path, topElement, topYY);

  const tips = tipsByCombo(lang, input.path, topElement, topYY);

  return {
    reading: { headline, paragraph1, paragraph2, mixTitle },
    tips,
  };
}