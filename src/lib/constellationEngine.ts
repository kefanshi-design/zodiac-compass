type Constellation =
  | "Capricorn"
  | "Aquarius"
  | "Pisces"
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius";

function mmdd(month: number, day: number) {
  return month * 100 + day; // e.g. 8/13 => 813
}

export function getConstellation(month: number, day: number): Constellation {
  const d = mmdd(month, day);

  // 边界按常见西方星座日期
  if (d >= 1222 || d <= 119) return "Capricorn";
  if (d >= 120 && d <= 218) return "Aquarius";
  if (d >= 219 && d <= 320) return "Pisces";
  if (d >= 321 && d <= 419) return "Aries";
  if (d >= 420 && d <= 520) return "Taurus";
  if (d >= 521 && d <= 620) return "Gemini";
  if (d >= 621 && d <= 722) return "Cancer";
  if (d >= 723 && d <= 822) return "Leo";
  if (d >= 823 && d <= 922) return "Virgo";
  if (d >= 923 && d <= 1022) return "Libra";
  if (d >= 1023 && d <= 1121) return "Scorpio";
  return "Sagittarius"; // 1122–1221
}
