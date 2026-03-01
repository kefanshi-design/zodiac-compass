"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "zh";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // load once
  useEffect(() => {
    const saved = (window.localStorage.getItem("zc_lang") as Lang | null) ?? "en";
    if (saved === "en" || saved === "zh") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("zc_lang", l);
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggle: () => setLang(lang === "en" ? "zh" : "en"),
    }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider />");
  return ctx;
}