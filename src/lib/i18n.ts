// src/lib/i18n.ts
export type Lang = "en" | "zh";

/**
 * Translation Dictionary
 * Structure rule:
 * - global.*   → reusable UI text
 * - home.*     → landing page
 * - profile.*  → DOB form
 * - path.*     → direction selection
 * - result.*   → reading page
 */
export const dict = {
  // ======================
  // Global / Common UI
  // ======================
  appName: { en: "Zodiac Compass", zh: "生肖星盘" },

  enShort: { en: "EN", zh: "英" },
  zhShort: { en: "中", zh: "中" },

  back: { en: "← Back", zh: "← 返回" },
  nextStep: { en: "Next Step", zh: "下一步" },
  continue: { en: "Continue →", zh: "继续 →" },

  // ======================
  // Home
  // ======================
  homeCta: { en: "Start Your Journey →", zh: "开始探索 →" },

  // ======================
  // Profile (merged)
  // ======================
  profileTitle: {
    en: "Tell us about you and choose your today's path.",
    zh: "让我更了解一下你，并选择你今天的路线。",
  },

  profileSubtitle: {
    en: "This helps us find your Zodiac Animals, blended with astrology for daily personality insights.",
    zh: "不妨输入你的生日，通过生肖和星座，为你提供每日小建议。",
  },

  profilePrivacyNote: {
  en: "Private moment only ✨ We don't store your profile data.",
  zh: "仅属于你的私人时刻 ✨ 我们不会存储你的个人信息。",
},

  nameLabel: { en: "Name", zh: "名字" },
  dobLabel: { en: "Date of Birth", zh: "出生日期" },

  day: { en: "Day", zh: "日" },
  month: { en: "Month", zh: "月" },
  year: { en: "Year", zh: "年" },

  continueToPath: { en: "Continue →", zh: "继续 →" },

  // ======================
  // Path Selection
  // ======================
  pathTitleLine1: { en: "What do you want", zh: "你今天想" },
  pathTitleLine2: { en: "to explore today?", zh: "探索哪个方向？" },

  pathCareer: { en: "Career", zh: "事业" },
  pathLove: { en: "Love", zh: "感情" },
  pathHealth: { en: "Health", zh: "健康" },

  // ======================
  // Result Page
  // ======================
  resultTitle: { en: "Your Zodiac Compass Reading", zh: "你的 Zodiac Compass 解读" },
  resultSubtitle: {
    en: "A gentle overview of your energy, element balance, and tips for today.",
    zh: "今天的能量、五行平衡与小建议（轻量版）。  ",
  },

  // ===== Energy Section =====
  energyTitle: { en: "Your Daily Element & Energy Balance", zh: "今日五行与能量平衡" },

  energyHintMetal: { en: "Focus • Structure", zh: "专注 • 结构" },
  energyHintWood: { en: "Growth • Renewal", zh: "成长 • 新生" },
  energyHintWater: { en: "Flow • Intuition", zh: "流动 • 直觉" },
  energyHintFire: { en: "Action • Passion", zh: "行动 • 热情" },
  energyHintEarth: { en: "Stability • Grounded", zh: "稳定 • 沉着" },

  labelMetal: { en: "Metal", zh: "金" },
  labelWood: { en: "Wood", zh: "木" },
  labelWater: { en: "Water", zh: "水" },
  labelFire: { en: "Fire", zh: "火" },
  labelEarth: { en: "Earth", zh: "土" },

  labelYang: { en: "Yang", zh: "阳" },
  labelYin: { en: "Yin", zh: "阴" },

  yyHintYang: { en: "Drive • Outgoing", zh: "推进 • 外放" },
  yyHintYin: { en: "Reflect • Calm", zh: "内观 • 平静" },

  // ===== Tips Section =====
  tipsTitle: { en: "How to make the day smoother", zh: "让今天更顺的一点建议" },
  tipsCardTitle: { en: "Energy Match Tips for Today", zh: "今日能量匹配小提示" },
  tipsBestTo: { en: "Best to be around with…", zh: "更适合相处的是…" },
  tipsWatchOut: { en: "Watch out for…", zh: "需要留意的是…" },
  tipsPowerWordsTitle: { en: "Today’s Power Words", zh: "今日关键词" },

  // ===== Ending Section =====
  endingMessage: {
    en: "Just watch out for rushing and you'll do great!",
    zh: "放慢一点点你的节奏，今天一切会很顺利的！",
  },

  backHome: { en: "Back Home", zh: "返回首页" },
  leaveIdea: { en: "Leave your idea", zh: "留下你的想法" },
  meetDesigner: { en: "Meet the designer", zh: "认识一下设计师" },

  designedBy: {
    en: "Designed & launched by Kefan Shi",
    zh: "设计与发布：Kefan 史珂凡",
  },
} as const;

/** Auto type-safe keys */
export type I18nKey = keyof typeof dict;

/** Translation helper */
export function t(lang: Lang, key: I18nKey) {
  return dict[key]?.[lang] ?? dict[key]?.en ?? String(key);
}