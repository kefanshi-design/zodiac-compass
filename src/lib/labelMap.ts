// src/lib/labelMap.ts
import type { Lang } from "@/src/lib/i18n";

export type ConstellationEn =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export type ZodiacEn =
  | "Rat"
  | "Ox"
  | "Tiger"
  | "Rabbit"
  | "Dragon"
  | "Snake"
  | "Horse"
  | "Goat"
  | "Monkey"
  | "Rooster"
  | "Dog"
  | "Pig";

const CONSTELLATION_ZH: Record<ConstellationEn, string> = {
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

const ZODIAC_ZH: Record<ZodiacEn, string> = {
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

function safeStr(v: unknown) {
  return typeof v === "string" ? v : "";
}

export function localizeConstellationLabel(lang: Lang, enLabel: string) {
  if (lang !== "zh") return enLabel;
  const key = safeStr(enLabel) as ConstellationEn;
  return CONSTELLATION_ZH[key] ?? enLabel;
}

export function localizeZodiacLabel(lang: Lang, enLabel: string) {
  if (lang !== "zh") return enLabel;
  const key = safeStr(enLabel) as ZodiacEn;
  return ZODIAC_ZH[key] ?? enLabel;
}