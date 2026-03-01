// app/result/result-client.tsx
"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import LanguageToggle from "@/components/LanguageToggle";
import { useLang } from "@/components/LanguageProvider";

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

export default function ResultClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const { lang } = useLang();

  const name = sp.get("name") ?? "";
  const day = sp.get("day") ?? "";
  const month = sp.get("month") ?? "";
  const year = sp.get("year") ?? "";
  const pathRaw = sp.get("path") ?? "";

  const hasRequired = name && day && month && year && pathRaw;
  if (!hasRequired) {
    router.replace("/profile");
    return null;
  }

  const path: PathKey = isPathKey(pathRaw) ? pathRaw : "career";

  const result = useMemo(() => {
    const m = Number(month);
    const d = Number(day);
    const y = Number(year);

    const zodiac = Number.isFinite(y)
      ? getZodiacAnimal(y)
      : mockResult.identity.zodiac;

    const constellation =
      Number.isFinite(m) && Number.isFinite(d)
        ? getConstellation(m, d)
        : mockResult.identity.constellation;

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

    let reading = mockResult.reading;
    let tips = mockResult.tips;

    try {
      const out = computeReading({
        lang, // ✅ 关键：把语言传进去
        name: name.trim() || mockResult.identity.name,
        zodiac,
        constellation,
        path,
        energy: energy as any,
      });

      reading = out.reading ?? mockResult.reading;
      tips = out.tips ?? mockResult.tips;
    } catch (e) {
      console.error("computeReading failed, fallback to mock:", e);
      reading = mockResult.reading;
      tips = mockResult.tips;
    }

    const topElement = topKey<ElementKey>((energy as any).elements, "fire");
    const topYY = topKey<YYKey>((energy as any).yinYang, "yang");

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
        cardGradient,
      },
      energy,
      reading: {
        ...mockResult.reading,
        ...reading,
      },
      tips: {
        ...mockResult.tips,
        ...tips,
      },
    };
  }, [name, day, month, year, path, lang]);

  return (
    <main className="relative min-h-screen bg-[#1C1F4E] text-white">
      {/* Top-right language toggle */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle />
      </div>

      {/* subtle ending transition */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44"
        style={{
          background:
            "linear-gradient(to bottom, rgba(28,31,78,0) 0%, rgba(28,31,78,1) 85%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1180px] px-3 py-10 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-start">
          <div className="flex flex-col gap-12">
            <IdentitySection data={result.identity} />
            <EnergySection data={result.energy} />
          </div>

          <div className="flex flex-col gap-16">
            <ReadingSection data={result.reading} />
            <TipsSection data={result.tips} />
          </div>
        </div>

        <div className="mt-14 lg:mt-18">
          <EndingSection />
        </div>
      </div>
    </main>
  );
}