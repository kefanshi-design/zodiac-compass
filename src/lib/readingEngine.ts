// src/lib/readingEngine.ts

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
  name: string;
  zodiac: string;
  constellation: string;
  path: PathKey;
  energy: EnergyData;
};

const elementAdj: Record<ElementKey, string> = {
  metal: "focused",
  wood: "growing",
  water: "intuitive",
  fire: "driven",
  earth: "steady",
};

const yyAdj: Record<YYKey, string> = {
  yang: "bold",
  yin: "reflective",
};

function topKey<T extends string>(obj: Record<T, number>): T {
  return (Object.entries(obj) as [T, number][])
    .slice()
    .sort((a, b) => b[1] - a[1])[0]?.[0] as T;
}

function mixTitleByPath(path: PathKey) {
  return path === "career"
    ? "Today's Work Energy Mix"
    : path === "love"
    ? "Today's Romance Energy Mix"
    : "Today's Healthy Energy Mix";
}

function paragraph2ByCombo(path: PathKey, e: ElementKey, yy: YYKey) {
  // ✅ 规则化：只要你 ring 变，这段就跟着变
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

function tipsByCombo(path: PathKey, e: ElementKey, yy: YYKey): TipsData {
  const bestTo =
    yy === "yin"
      ? "Calm, steady people and quiet environments."
      : "Energetic, supportive people who help you move forward.";

  const watchOut =
    yy === "yin"
      ? "Noise, rushed conversations, and pressure to decide too fast."
      : "Over-commitment, impulsive decisions, and skipping rest.";

  // power words：结合 path + top element + top yin/yang
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

  const powerWords = Array.from(new Set([...pwYY, ...pwElement, ...pwBase])).slice(
    0,
    3
  );

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
export function computeReading(
  input: ReadingInput
): { reading: ReadingData; tips: TipsData } {
  const topElement = topKey(input.energy.elements);
  const topYY = topKey(input.energy.yinYang);

  const mixTitle = mixTitleByPath(input.path);

  const headline = `Hi ${input.name}! You are ${yyAdj[topYY]} and ${elementAdj[topElement]}, with a ${input.constellation} × ${input.zodiac} vibe.`;

  const paragraph1 =
    topYY === "yin"
      ? `Your Yin energy shapes how you show up today, while ${topElement} helps you stay balanced and clear. Keep it simple and notice what feels natural.`
      : `Your Yang energy pushes you forward today, while ${topElement} keeps your direction sharp. Move with intention and protect your focus.`;

  const paragraph2 = paragraph2ByCombo(input.path, topElement, topYY);

  const tips = tipsByCombo(input.path, topElement, topYY);

  return {
    reading: { headline, paragraph1, paragraph2, mixTitle },
    tips,
  };
}
