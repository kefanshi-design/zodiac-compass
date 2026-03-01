"use client";

import { useLang } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="inline-flex rounded-2xl bg-white/20 p-1 backdrop-blur">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={[
          "px-5 py-2 rounded-xl font-semibold transition",
          lang === "en" ? "bg-white text-[#1C1F4E]" : "text-white/90",
        ].join(" ")}
      >
        En
      </button>

      <button
        type="button"
        onClick={() => setLang("zh")}
        className={[
          "px-5 py-2 rounded-xl font-semibold transition",
          lang === "zh" ? "bg-white text-[#1C1F4E]" : "text-white/90",
        ].join(" ")}
      >
        中
      </button>
    </div>
  );
}