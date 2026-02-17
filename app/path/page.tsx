"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PathKey = "career" | "love" | "health";

const OPTIONS = [
  {
    key: "career",
    title: "Career",
    desc: "Your work & ambition energy",
    icon: "/icon-career.png",
  },
  {
    key: "love",
    title: "Love",
    desc: "Your romantic vibe today",
    icon: "/icon-love.png",
  },
  {
    key: "health",
    title: "Health",
    desc: "Your body & balance today",
    icon: "/icon-health.png",
  },
] as const;

export default function PathPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // ✅ read params from profile page
  const name = sp.get("name") ?? "";
  const day = sp.get("day") ?? "";
  const month = sp.get("month") ?? "";
  const year = sp.get("year") ?? "";

  // ✅ GUARD：防止用户直接访问 /path
  const hasRequired = name && day && month && year;
  if (!hasRequired) {
    router.replace("/profile");
    return null;
  }

  const [selected, setSelected] = useState<PathKey | null>(null);

  const canContinue = useMemo(() => {
    return selected !== null;
  }, [selected]);

  const handleNext = () => {
    if (!selected) return;

    const qs = new URLSearchParams({
      name,
      day,
      month,
      year,
      path: selected,
    }).toString();

    // ✅ push to result page
    router.push(`/result?${qs}`);
  };

  return (
    <main className="min-h-screen bg-[#1C1F4E] text-white flex flex-col justify-between px-6 py-10">
      {/* ===== Top ===== */}
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-4xl font-semibold leading-tight mb-8">
          What do you want
          <br />
          to explore today?
        </h1>

        <div className="space-y-4">
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.key;

            return (
              <button
                key={opt.key}
                onClick={() => setSelected(opt.key)}
                type="button"
                className="w-full rounded-2xl px-5 py-4 flex items-center justify-between bg-[#FBEFFF] text-[#1C1F4E] transition active:scale-[0.99]"
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10">
                    <Image
                      src={opt.icon}
                      alt={opt.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>

                  <div className="text-left">
                    <div className="text-lg font-semibold">
                      {opt.title}
                    </div>
                    <div className="text-sm opacity-80">
                      {opt.desc}
                    </div>
                  </div>
                </div>

                {/* Radio */}
                <div className="w-6 h-6 rounded-full border-2 border-[#1C1F4E] flex items-center justify-center">
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-[#1C1F4E]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== Bottom Button ===== */}
      <div className="w-full max-w-sm mx-auto">
        <button
          onClick={handleNext}
          disabled={!canContinue}
          className={`w-full rounded-full font-semibold py-4 transition
          ${
            canContinue
              ? "bg-[#F2C9FF] text-[#1C1F4E] active:scale-95"
              : "bg-[#F2C9FF]/40 text-[#1C1F4E]/50 cursor-not-allowed"
          }`}
        >
          Next Step
        </button>

        <button
          onClick={() => router.back()}
          className="mt-4 w-full text-sm text-white/70 hover:text-white transition"
        >
          ← Back
        </button>
      </div>
    </main>
  );
}
