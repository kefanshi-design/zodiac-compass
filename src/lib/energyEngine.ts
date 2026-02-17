export type PathKey = "career" | "love" | "health";

export type EnergyResult = {
  elements: {
    metal: number;
    wood: number;
    water: number;
    fire: number;
    earth: number;
  };
  yinYang: {
    yang: number;
    yin: number;
  };
};

// 把任意字符串转成稳定的数字 seed（同样输入 → 同样输出）
function hashToSeed(input: string) {
  let h = 2166136261; // FNV-ish
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// 简单伪随机（可复现）
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalizeTo100(values: number[]) {
  const sum = values.reduce((a, b) => a + b, 0) || 1;
  const raw = values.map((v) => (v / sum) * 100);

  // 四舍五入 + 修正到刚好 100
  const rounded = raw.map((v) => Math.round(v));
  let diff = 100 - rounded.reduce((a, b) => a + b, 0);

  // 把差值补到最大项（简单可靠）
  while (diff !== 0) {
    const idx = rounded.indexOf(Math.max(...rounded));
    rounded[idx] += diff > 0 ? 1 : -1;
    diff += diff > 0 ? -1 : 1;
  }
  return rounded;
}

function get12HourSlot(now = new Date()) {
  // UTC or local 都可以；你要稳定就用 UTC
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  const slot = now.getUTCHours() < 12 ? "A" : "B";
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}-${slot}`;
}

export function computeEnergy(params: {
  name: string;
  day: string;
  month: string;
  year: string;
  path: PathKey;
  zodiac: string;
  constellation: string;
  now?: Date;
}): EnergyResult {
  const slot = get12HourSlot(params.now);
  const key = [
    params.name.trim().toLowerCase(),
    params.year,
    params.month,
    params.day,
    params.zodiac,
    params.constellation,
    params.path,
    slot,
  ].join("|");

  const seed = hashToSeed(key);
  const rand = mulberry32(seed);

  // 5 elements weights
  let metal = rand();
  let wood = rand();
  let water = rand();
  let fire = rand();
  let earth = rand();

  // 根据 path 做一点“偏向”（MVP 简单即可）
  if (params.path === "career") metal += 0.25;
  if (params.path === "love") fire += 0.25;
  if (params.path === "health") earth += 0.25;

  const [m2, w2, wa2, f2, e2] = normalizeTo100([metal, wood, water, fire, earth]);

  // yin/yang
  const yangRaw = rand() + (params.path === "love" ? 0.15 : 0);
  const yinRaw = rand() + (params.path === "health" ? 0.15 : 0);
  const [yang, yin] = normalizeTo100([yangRaw, yinRaw]);

  return {
    elements: {
      metal: m2,
      wood: w2,
      water: wa2,
      fire: f2,
      earth: e2,
    },
    yinYang: { yang, yin },
  };
}
