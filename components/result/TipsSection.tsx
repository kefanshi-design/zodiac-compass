import Image from "next/image";

type Props = {
  data: {
    bestTo: string;
    watchOut: string;
    powerWords: string[];
  };
};

export default function TipsSection({ data }: Props) {
  return (
    <section className="py-1 px-2 border-b border-white/0">
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-semibold mb-4">
          How to make the day smoother
        </h2>

        {/* 两列：左侧星星轨道 + 右侧内容 */}
        <div className="relative grid grid-cols-[44px_1fr] gap-4">
          {/* ===== Left Star Rail ===== */}
          <div className="relative">
            {/* 顶部大星星 */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1">
              <Image src="/star-big.png" alt="star" width={22} height={22} priority />
            </div>

            {/* 底部大星星 */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-8">
              <Image src="/star-big.png" alt="star" width={22} height={22} priority />
            </div>

            {/* 中间小星星 */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-2">
              <div className="scale-50 origin-center">
                <Image src="/star-big.png" alt="star" width={22} height={22} priority />
              </div>
            </div>

            {/* ===== 虚线轨道 ===== */}
            <div className="absolute left-1/2 -translate-x-1/2 top-9 bottom-14 w-px border-l border-dashed border-[#F2C9FF]/70" />

            {/* ===== ⭐ Falling Stars Animation Layer ===== */}
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-9 bottom-14 w-6 overflow-hidden">
              <span className="falling-star delay-0" />
              <span className="falling-star delay-2 small" />
              <span className="falling-star delay-5" />
            </div>
          </div>

          {/* ===== Right Content ===== */}
          <div className="space-y-6">
            {/* Tips card */}
            <div className="rounded-2xl bg-white/10 p-5">
              <h3 className="font-semibold mb-2">Energy Match Tips for Today</h3>

              <p className="text-[#F2C9FF] text-sm font-semibold mb-2">
                Best to be around with…
              </p>
              <p className="text-white/85 mb-5 leading-relaxed">
                {data.bestTo}
              </p>

              <p className="text-[#F2C9FF] text-sm font-semibold mb-2">
                Watch out for…
              </p>
              <p className="text-white/85 leading-relaxed">
                {data.watchOut}
              </p>
            </div>

            {/* Power words */}
            <div className="rounded-2xl bg-white/10 p-5">
              <h3 className="font-semibold mb-3">Today’s Power Words</h3>

              <div className="flex flex-wrap gap-2">
                {data.powerWords.map((w) => (
                  <span
                    key={w}
                    className="px-3 py-1 rounded-full bg-[#F2C9FF] text-[#1C1F4E] text-sm font-semibold"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}