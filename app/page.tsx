"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-[#1C1F4E] text-white flex flex-col items-center px-6 py-10 overflow-hidden">
      {/* =========================
          AURORA BACKGROUND (polar)
         ========================= */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Base deep sky vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 40%), radial-gradient(circle at 50% 60%, rgba(0,0,0,0) 40%, rgba(10,12,40,0.65) 100%)",
          }}
        />

        {/* Aurora ribbons */}
        <div className="zc-aurora zc-aurora-1" />
        <div className="zc-aurora zc-aurora-2" />
        <div className="zc-aurora zc-aurora-3" />

        {/* Subtle grain (optional but makes it feel “alive”) */}
        <div className="zc-grain" />
      </div>

      {/* ✅ Put keyframes here so it always works (no globals.css needed) */}
      <style jsx global>{`
        .zc-aurora {
          position: absolute;
          inset: -20%;
          opacity: 0.65;
          filter: blur(42px);
          transform: translate3d(0, 0, 0);
          will-change: transform;
          mix-blend-mode: screen;
        }

        /* Ribbon 1: green/teal aurora */
        .zc-aurora-1 {
          background: radial-gradient(
              40% 60% at 30% 35%,
              rgba(125, 255, 214, 0.55),
              transparent 60%
            ),
            radial-gradient(
              45% 70% at 60% 30%,
              rgba(92, 210, 255, 0.45),
              transparent 62%
            );
          animation: zcAuroraDrift1 18s ease-in-out infinite;
        }

        /* Ribbon 2: violet/pink aurora */
        .zc-aurora-2 {
          opacity: 0.55;
          filter: blur(54px);
          background: radial-gradient(
              45% 60% at 65% 40%,
              rgba(242, 201, 255, 0.55),
              transparent 60%
            ),
            radial-gradient(
              50% 70% at 35% 55%,
              rgba(140, 150, 255, 0.35),
              transparent 65%
            );
          animation: zcAuroraDrift2 22s ease-in-out infinite;
        }

        /* Ribbon 3: thin polar glow band near top */
        .zc-aurora-3 {
          opacity: 0.45;
          filter: blur(36px);
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(125, 255, 214, 0.35) 18%,
            rgba(92, 210, 255, 0.25) 45%,
            rgba(242, 201, 255, 0.28) 70%,
            transparent 100%
          );
          transform: translate3d(0, -18%, 0) rotate(-8deg);
          animation: zcAuroraBand 14s ease-in-out infinite;
        }

        /* Grain layer */
        .zc-grain {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        @keyframes zcAuroraDrift1 {
          0% {
            transform: translate3d(-2%, -1%, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(3%, 2%, 0) rotate(2deg);
          }
          100% {
            transform: translate3d(-2%, -1%, 0) rotate(0deg);
          }
        }

        @keyframes zcAuroraDrift2 {
          0% {
            transform: translate3d(2%, 0%, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(-3%, 2%, 0) rotate(-2deg);
          }
          100% {
            transform: translate3d(2%, 0%, 0) rotate(0deg);
          }
        }

        @keyframes zcAuroraBand {
          0% {
            transform: translate3d(-6%, -18%, 0) rotate(-8deg);
            opacity: 0.35;
          }
          50% {
            transform: translate3d(6%, -16%, 0) rotate(-6deg);
            opacity: 0.55;
          }
          100% {
            transform: translate3d(-6%, -18%, 0) rotate(-8deg);
            opacity: 0.35;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .zc-aurora-1,
          .zc-aurora-2,
          .zc-aurora-3 {
            animation: none !important;
          }
        }
      `}</style>

      {/* =========================
          CONTENT
         ========================= */}
      <div className="w-full flex-1 flex items-center justify-center">
        <section
          className={`relative w-full aspect-square
            max-w-[300px]
            sm:max-w-[380px]
            md:max-w-[460px]
            lg:max-w-[520px]
            mb-12 md:mb-16`}
        >
          {/* Outer Zodiac ring */}
          <div className="absolute inset-0 spin-ccw-slower">
            <Image
              src="/wheel-zodiac.png"
              alt="Zodiac ring"
              fill
              priority
              className="object-contain select-none pointer-events-none"
              sizes="(max-width:640px) 90vw, (max-width:1024px) 460px, 520px"
            />
          </div>

          {/* Stars ring */}
          <div className="absolute inset-0 scale-[0.70] spin-cw-slow">
            <Image
              src="/wheel-stars.png"
              alt="Stars ring"
              fill
              priority
              className="object-contain select-none pointer-events-none"
            />
          </div>

          {/* Center logo */}
          <div className="absolute inset-0 scale-[0.52]">
            <Image
              src="/wheel-logo.png"
              alt="Zodiac Compass logo"
              fill
              priority
              className="object-contain select-none pointer-events-none"
            />
          </div>
        </section>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push("/profile")}
        className="w-full max-w-[380px] rounded-full bg-[#F2C9FF] text-[#1C1F4E] font-semibold py-4 active:scale-[0.99] transition"
      >
        Start Your Journey →
      </button>
    </main>
  );
}