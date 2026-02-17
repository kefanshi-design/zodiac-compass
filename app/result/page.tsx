"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import IdentitySection from "@/components/result/IdentitySection";
import EnergySection from "@/components/result/EnergySection";
import ReadingSection from "@/components/result/ReadingSection";
import TipsSection from "@/components/result/TipsSection";
import EndingSection from "@/components/result/EndingSection";

import { mockResult } from "@/src/lib/mockResult";
import { getConstellation } from "@/src/lib/constellationEngine";
import { getZodiacAnimal } from "@/src/lib/zodiacEngine";

import { computeEnergy } from "@/src/lib/energyEngine";
import { computeReading } from "@/src/lib/readingEngine";

import { elementColors, yinYangColors } from "@/src/lib/theme";

type PathKey = "career" | "love" | "health";
type ElementKey = "metal" | "wood" | "water" | "fire" | "earth";
type YYKey = "yang" | "yin";

function isPathKey(v: string): v is PathKey {
  return v === "career" || v === "love" || v === "health";
}

function topKey<T extends string>(obj: Record<T, number> | undefined, fallback: T): T {
  if (!obj) return fallback;
  const entries = Object.entries(obj) as [T, number][];
  if (!entries.length) return fallback;
  entries.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  return entries[0]?.[0] ?? fallback;
}

export default function ResultPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // ✅ URL params
  const name = sp.get("name") ?? "";
  const day = sp.get("day") ?? "";
  const month = sp.get("month") ?? "";
  const year = sp.get("year") ?? "";
  const pathRaw = sp.get("path") ?? "";

  // ✅ prevent direct visit without required fields
  const hasRequired = name && day && month && year && pathRaw;
  if (!hasRequired) {
    router.replace("/profile");
    return null;
  }

  // ✅ normalize path
  const path: PathKey = isPathKey(pathRaw) ? pathRaw : "career";

  const result = useMemo(() => {
    const m = Number(month);
    const d = Number(day);
    const y = Number(year);

    // ✅ zodiac / constellation
    const zodiac = Number.isFinite(y)
      ? getZodiacAnimal(y)
      : mockResult.identity.zodiac;

    const constellation =
      Number.isFinite(m) && Number.isFinite(d)
        ? getConstellation(m, d)
        : mockResult.identity.constellation;

    // ✅ energy (safe fallback)
    let energy = mockResult.energy;
    try {
      energy = computeEnergy({
        name,
        day,
        month,
        year,
        path,
        zodiac,
        constellation,
      });
    } catch (e) {
      console.error("computeEnergy failed, fallback to mock:", e);
      energy = mockResult.energy;
    }

    // ✅ reading + tips (safe fallback)
    let reading = mockResult.reading;
    let tips = mockResult.tips;

    try {
      const out = computeReading({
        name: name.trim() || mockResult.identity.name,
        zodiac,
        constellation,
        path,
        energy,
      });

      // out = { reading, tips }
      reading = out.reading ?? mockResult.reading;
      tips = out.tips ?? mockResult.tips;
    } catch (e) {
      console.error("computeReading failed, fallback to mock:", e);
      reading = mockResult.reading;
      tips = mockResult.tips;
    }

    // ✅ card gradient based on top element + top yin/yang
    const topElement = topKey<ElementKey>(energy.elements as any, "fire");
    const topYY = topKey<YYKey>(energy.yinYang as any, "yang");

    const cardGradient = {
      from: elementColors[topElement] ?? "#FF8A4C",
      to: yinYangColors[topYY] ?? "#FFD36B",
    };

    return {
      ...mockResult,
      identity: {
        ...mockResult.identity,
        name: name.trim() || mockResult.identity.name,
        zodiac,
        constellation,
        cardGradient, // ⚠️ 如果 IdentitySection 类型没加这个字段，会在 IdentitySection 报红
      },
      energy,
      reading: {
        ...mockResult.reading,
        ...reading, // readingEngine 动态覆盖
      },
      tips: {
        ...mockResult.tips,
        ...tips, // readingEngine 动态覆盖
      },
    };
  }, [name, day, month, year, path]);

  // ✅ Debug（可留可删）
  console.log("RESULT PARAMS:", { name, day, month, year, path });
  console.log("RESULT IDENTITY:", result.identity);
  console.log("RESULT ENERGY:", result.energy);
  console.log("RESULT READING:", result.reading);
  console.log("RESULT TIPS:", result.tips);

  return (
    <main className="min-h-screen bg-[#1C1F4E] text-white">
      <IdentitySection data={result.identity} />
      <EnergySection data={result.energy} />
      <ReadingSection data={result.reading} />
      <TipsSection data={result.tips} />
      <EndingSection />
    </main>
  );
}
