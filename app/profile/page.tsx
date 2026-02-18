"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

function clampLen(v: string, len: number) {
  return v.slice(0, len);
}

function isIntInRange(v: string, min: number, max: number) {
  if (v.trim() === "") return false;
  const n = Number(v);
  if (!Number.isInteger(n)) return false;
  return n >= min && n <= max;
}

export default function ProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const isValid = useMemo(() => {
    const nameOk = name.trim().length > 0;
    const dayOk = isIntInRange(day, 1, 31);
    const monthOk = isIntInRange(month, 1, 12);
    const yearOk = year.length === 4 && isIntInRange(year, 1900, 2099);

    return nameOk && dayOk && monthOk && yearOk;
  }, [name, day, month, year]);

  const handleNext = () => {
    if (!isValid) return;

    const payload = {
      name: name.trim(),
      day: day.trim(),
      month: month.trim(),
      year: year.trim(),
    };

    console.log("PROFILE -> PATH payload:", payload);

    const qs = new URLSearchParams(payload).toString();
    router.push(`/path?${qs}`);
  };

  return (
    <main className="min-h-screen bg-[#1C1F4E] text-white flex flex-col justify-between px-6 py-10">
      {/* ===== Top Content ===== */}
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-4xl font-semibold mb-2">Tell me about you</h1>

        {/* ✅ Updated subtitle */}
        <p className="text-m text-[#F2C9FF] mb-8">
          This helps us find your Zodiac Animals, blended with astrology for daily personality insights.
        </p>

        {/* Name */}
        <label className="text-sm mb-2 block">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full rounded-xl bg-white text-black px-4 py-3 mb-6 outline-none"
        />

        {/* Date of Birth */}
        <label className="text-sm mb-2 block">Date of Birth</label>
        <div className="flex gap-3">
          <input
            inputMode="numeric"
            placeholder="DD"
            value={day}
            onChange={(e) => {
              const v = clampLen(onlyDigits(e.target.value), 2);
              setDay(v);
            }}
            className="w-1/3 rounded-xl bg-white text-black px-4 py-3 outline-none"
          />
          <input
            inputMode="numeric"
            placeholder="MM"
            value={month}
            onChange={(e) => {
              const v = clampLen(onlyDigits(e.target.value), 2);
              setMonth(v);
            }}
            className="w-1/3 rounded-xl bg-white text-black px-4 py-3 outline-none"
          />
          <input
            inputMode="numeric"
            placeholder="YYYY"
            value={year}
            onChange={(e) => {
              const v = clampLen(onlyDigits(e.target.value), 4);
              setYear(v);
            }}
            className="w-1/3 rounded-xl bg-white text-black px-4 py-3 outline-none"
          />
        </div>

        {/* ✅ Privacy microcopy (8px spacing) */}
        <p className="mt-6 text-sm text-white/60 leading-relaxed">
          Private moment only ✨ We don’t store your profile data.
        </p>

        {/* Keep spacing */}
        <div className="mt-2 min-h-[18px]" />
      </div>

      {/* ===== Bottom Buttons ===== */}
      <div className="w-full max-w-sm mx-auto">
        <button
          onClick={handleNext}
          disabled={!isValid}
          className={`w-full rounded-full font-semibold py-4 transition
          ${
            isValid
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