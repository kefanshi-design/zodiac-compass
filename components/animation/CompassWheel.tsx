// components/animation/CompassWheel.tsx
"use client";

import Image from "next/image";
import React from "react";

type Stage = 1 | 2 | 3 | 4;

type Props = {
  stage: Stage;
  settleDeg: number; // 外圈最终停靠角度（你已有逻辑）
  zodiacKey: string;
  constellationKey: string;

  // 可选：用于调试/微调半径
  size?: number; // 640
};

const zodiacOrder = [
  "rat",
  "ox",
  "tiger",
  "rabbit",
  "dragon",
  "snake",
  "horse",
  "goat",
  "monkey",
  "rooster",
  "dog",
  "pig",
] as const;

const constellationOrder = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

// ✅ 你的素材路径
const zodiacSrc = (key: string) => `/assets/zodiac/${key}.png`;
const constellationSrc = (key: string) => `/assets/constellation/${key}.png`;

// 把 12 个点均匀排在圆环上
function polarToXY(angleDeg: number, r: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r };
}

export default function CompassWheel({
  stage,
  settleDeg,
  zodiacKey,
  constellationKey,
  size = 640,
}: Props) {
  // ====== Motion (复用你原本的 feel) ======
  const outerStyle: React.CSSProperties =
    stage === 1
      ? { animation: "zcOuterActivation 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards" }
      : stage >= 2
        ? { animation: "none", transform: `rotate(${settleDeg}deg)` }
        : {};

  const midStyle: React.CSSProperties =
    stage === 1
      ? { animation: "zcMidFollow 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards" }
      : stage >= 2
        ? { animation: "none", transform: `rotate(${settleDeg * 0.35}deg)` }
        : {};

  const settleKickStyle: React.CSSProperties =
    stage === 2
      ? { animation: "zcSettleKick 1400ms cubic-bezier(0.16, 1, 0.3, 1) forwards" }
      : { animation: "none" };

  // ====== 选中高亮（给后续铺垫） ======
  const zodiacIndex = Math.max(0, zodiacOrder.indexOf(zodiacKey as any));
  const constellationIndex = Math.max(0, constellationOrder.indexOf(constellationKey as any));

  // 你可以理解为：我们把“12等分”固定在盘上（0 在顶部）
  const baseTopDeg = -90;

  // 每个槽位的角度（0..11）
  const zodiacSlotDeg = (i: number) => baseTopDeg + i * 30;
  const constSlotDeg = (i: number) => baseTopDeg + i * 30;

  // ====== 尺寸/半径 ======
  // 容器半径
  const R = size / 2;

  // 外圈生肖放置半径（靠外）
  const zodiacR = R * 0.86; // 0.84~0.89 都可以微调
  const zodiacIcon = Math.round(size * 0.105); // 图标尺寸

  // 中圈星座放置半径（靠中）
  const constR = R * 0.57; // 0.53~0.60 微调
  const constIcon = Math.round(size * 0.105);

  // 中圈底盘大小（粉色圈）
  const midPlateScale = 0.82;

  // ====== Stage 2 highlight wedge（先保留你原来那套） ======
  const highlightStyle: React.CSSProperties = {
    opacity: stage >= 2 ? 1 : 0,
    transition: "opacity 260ms ease-out",
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Keyframes */}
      <style jsx global>{`
        @keyframes zcOuterActivation {
          0% { transform: rotate(0deg); }
          70% { transform: rotate(820deg); }
          100% { transform: rotate(1080deg); }
        }
        @keyframes zcMidFollow {
          0%   { transform: rotate(0deg); }
          14%  { transform: rotate(0deg); }
          78%  { transform: rotate(300deg); }
          100% { transform: rotate(420deg); }
        }
        @keyframes zcSettleKick {
          0%   { transform: rotate(1080deg); }
          55%  { transform: rotate(${settleDeg + 8}deg); }
          78%  { transform: rotate(${settleDeg - 6}deg); }
          100% { transform: rotate(${settleDeg}deg); }
        }
        @keyframes zcPulse {
          0%, 100% { transform: scale(1); opacity: 0.45; }
          50%      { transform: scale(1.03); opacity: 0.7; }
        }
      `}</style>

      {/* ===== 背景底盘：外圈（暗色环） ===== */}
      <div
        className="absolute inset-0"
        style={{
          ...outerStyle,
          ...(stage === 2 ? settleKickStyle : {}),
          zIndex: 1,
        }}
      >
        <Image
          src="/wheel-zodiac-background.png"
          alt="zodiac base"
          fill
          priority
          className="object-contain select-none pointer-events-none"
        />
      </div>

      {/* ===== 中圈底盘：粉色环（缩小一点形成层级） ===== */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 2 }}
      >
        <div
          className="relative"
          style={{
            width: `${midPlateScale * 85}%`,
            height: `${midPlateScale * 85}%`,
            ...midStyle,
          }}
        >
          <Image
            src="/wheel-stars-background.png"
            alt="stars base"
            fill
            className="object-contain select-none pointer-events-none"
          />
        </div>
      </div>

      {/* ====== Stage 2+ 高亮层（可选） ====== */}
      <div className="absolute inset-0 pointer-events-none" style={{ ...highlightStyle, zIndex: 3 }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.22) 72%, rgba(0,0,0,0.42) 100%)",
          }}
        />
      </div>

      {/* ===========================
          外圈：12 生肖 icon（跟随外圈一起转）
         =========================== */}
      <div className="absolute inset-0" style={{ zIndex: 4, ...outerStyle }}>
        {zodiacOrder.map((key, i) => {
          const deg = zodiacSlotDeg(i);
          const { x, y } = polarToXY(deg, zodiacR);

          const isActive = i === zodiacIndex;
          return (
            <div
              key={key}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
              }}
            >
              <div
                className="relative"
                style={{
                  width: zodiacIcon,
                  height: zodiacIcon,
                  opacity: 1,
                  filter: isActive
                    ? "drop-shadow(0 0 18px rgba(242,201,255,0.28))"
                    : "drop-shadow(0 0 10px rgba(255,255,255,0.10))",
                  transform: isActive ? "scale(1.06)" : "scale(1)",
                  transition: "transform 260ms ease-out, filter 260ms ease-out",
                }}
              >
                <Image
                  src={zodiacSrc(key)}
                  alt={key}
                  fill
                  className="object-contain select-none pointer-events-none"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ===========================
          中圈：12 星座 icon（跟随中圈轻微转）
         =========================== */}
      <div className="absolute inset-0" style={{ zIndex: 5 }}>
        <div
          className="absolute inset-0"
          style={{
            // 让星座跟中圈一起轻微旋转
            ...midStyle,
          }}
        >
          {constellationOrder.map((key, i) => {
            const deg = constSlotDeg(i);
            const { x, y } = polarToXY(deg, constR);

            const isActive = i === constellationIndex;

            return (
              <div
                key={key}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                }}
              >
                <div
                  className="relative"
                  style={{
                    width: constIcon,
                    height: constIcon,
                    opacity: 0.95,
                    filter: isActive
                      ? "drop-shadow(0 0 18px rgba(20,25,60,0.35))"
                      : "drop-shadow(0 0 10px rgba(20,25,60,0.18))",
                    transform: isActive ? "scale(1.06)" : "scale(1)",
                    transition: "transform 260ms ease-out, filter 260ms ease-out",
                  }}
                >
                  <Image
                    src={constellationSrc(key)}
                    alt={key}
                    fill
                    className="object-contain select-none pointer-events-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ====== 中心 Logo（直接叠层，不挖洞） ====== */}
      <div className="absolute grid place-items-center" style={{ zIndex: 6 }}>
        <div
          className="absolute rounded-full"
          style={{
            width: Math.round(size * 0.40),
            height: Math.round(size * 0.40),
            background:
              "radial-gradient(circle at 50% 50%, rgba(242,201,255,0.12), rgba(242,201,255,0) 62%)",
            opacity: stage >= 2 ? 1 : 0,
            transition: "opacity 320ms ease-out",
            animation: stage >= 2 ? "zcPulse 1400ms ease-out infinite" : "none",
          }}
        />
        <Image
          src="/wheel-logo.png"
          alt="logo"
          width={Math.round(size * 0.34)}
          height={Math.round(size * 0.34)}
          className="select-none pointer-events-none"
        />
      </div>
    </div>
  );
}