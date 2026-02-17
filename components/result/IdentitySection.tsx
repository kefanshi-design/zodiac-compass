"use client";

import Image from "next/image";
import { zodiacArt } from "@/src/lib/zodiacArt";
import { constellationArt } from "@/src/lib/constellationArt";

type Props = {
  data: {
    name: string;
    zodiac: string; // ✅ 生肖（左下）
    constellation: string; // ✅ 星座（右上）
    cardGradient?: {
      from: string;
      to: string;
    };
  };
};

export default function IdentitySection({ data }: Props) {
  const from = data.cardGradient?.from ?? "#FF8A4C";
  const to = data.cardGradient?.to ?? "#FFD36B";

  // ✅ 用于从 map 里取图片（统一转小写）
  const zodiacKey = data.zodiac.toLowerCase() as keyof typeof zodiacArt;
  const constellationKey =
    data.constellation.toLowerCase() as keyof typeof constellationArt;

  const zodiacSrc = zodiacArt[zodiacKey];
  const constellationSrc = constellationArt[constellationKey];

  return (
    <section className="py-10 px-6 border-b border-white/10">
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Identity Section
        </h2>

        <div
          className="rounded-3xl p-6 text-[#1C1F4E]"
          style={{
            background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
          }}
        >
          {/* ✅ Top row：Name 左上(放大) / Constellation 右上(保持小字) */}
          <div className="flex items-start justify-between">
            <div className="font-semibold text-2xl leading-none">
              {data.name}
            </div>
            <div className="font-semibold text-sm opacity-90">
              {data.constellation}
            </div>
          </div>

          {/* ✅ Art row：把上下间距减半 + 图片左右顺序反过来（左=生肖，右=星座） */}
          <div className="mt-3 grid grid-cols-2 gap-6 items-center">
            {/* Zodiac Art (left) */}
            <div className="relative h-[180px] w-full">
              {zodiacSrc ? (
                <Image
                  src={zodiacSrc}
                  alt={`${data.zodiac} art`}
                  fill
                  className="object-contain"
                  sizes="240px"
                  priority
                />
              ) : (
                <span className="text-sm opacity-70">Zodiac Art</span>
              )}
            </div>

            {/* Constellation Art (right) */}
            <div className="relative h-[180px] w-full">
              {constellationSrc ? (
                <Image
                  src={constellationSrc}
                  alt={`${data.constellation} art`}
                  fill
                  className="object-contain"
                  sizes="240px"
                  priority
                />
              ) : (
                <span className="text-sm opacity-70">Constellation Art</span>
              )}
            </div>
          </div>

          {/* ✅ Bottom-left：生肖字体改为与右上星座一致（text-sm）+ 间距减半 */}
          <div className="mt-3 font-semibold text-sm opacity-90">
            {data.zodiac}
          </div>
        </div>
      </div>
    </section>
  );
}
