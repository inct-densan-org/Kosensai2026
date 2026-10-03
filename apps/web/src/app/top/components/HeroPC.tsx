import Image from "next/image";
import type { CSSProperties } from "react";
import clock from "../resource/clock.svg";
import step from "../resource/step.svg";
import day from "../resource/day.svg";

// デザイン基準: 1440 x 1024
// デザインフレームを縦横比を保ったまま画面を覆うように拡縮し（左右中央・下揃え）、
// フレーム内の画像の位置関係を比率で維持する。ヒーローは常に1画面で完結する。
// 横長の画面では上端の見切れが MAX_TOP_CROP（デザインpx）を超えないよう拡大を止め、
// 左右は背景で補う。
const MAX_TOP_CROP = 150;

// --s: デザイン1pxあたりの実寸
const sectionStyle = {
  containerType: "size",
  "--s": `min(max(100cqw / 1440, 100cqh / 1024), 100cqh / ${1024 - MAX_TOP_CROP})`,
} as CSSProperties;

const frameStyle: CSSProperties = {
  width: "calc(var(--s) * 1440)",
  height: "calc(var(--s) * 1024)",
};

export default function HeroPC() {
  return (
    <section
      className="relative h-dvh w-full overflow-hidden bg-linear-to-br from-[#73C1D7] to-[#C7ECF4]"
      style={sectionStyle}
    >
      {/* 背面: clock（1440x1024）
          フレームとは別に、縦横比を保ったまま画面全体を覆うように拡縮・中央配置 */}
      <Image
        src={clock}
        alt=""
        priority
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      {/* 1440x1024 のデザインフレーム */}
      <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2" style={frameStyle}>
        {/* 前面: step（1440x1018・フレーム下端） */}
        <Image
          src={step}
          alt=""
          priority
          className="absolute bottom-0 left-0 z-10 h-auto w-full"
        />

        {/* 開催日（470x109）: 中央・下から64px */}
        <Image
          src={day}
          alt="10月24日(土)・25日(日) 開催"
          priority
          className="absolute bottom-[calc(100%*64/1024)] left-1/2 z-20 h-auto w-[calc(100%*470/1440)] max-w-none -translate-x-1/2"
        />
      </div>
    </section>
  );
}
