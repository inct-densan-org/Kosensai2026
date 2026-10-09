import type { CSSProperties, ReactNode } from "react";
import cardBackground from "../resource/card_background.webp";

// トップページの各項目の本文を入れるカード
// - 背景: #A0D8EF の上に card_background を重ね、素材の露出を上げて白い素材にする
// - 単色（#A0D8EF）は不透明度 90%、素材画像は不透明度 20% にし、ページの背景が少し透けて見えるようにする
// - ドロップシャドウ（近い影＋遠い影）と上辺のハイライトで立体感を出す
// ※ card_background.webp は card_background.svg 内の画像を 2048px 幅に縮小・圧縮したもの（元SVGは約8MB）

// 素材の露出（明るさ）。値を上げるほど白く飛ぶ
const EXPOSURE = 1.1;

// 露出は #A0D8EF と素材を重ねたもの全体にかける（素材の透明部分の地色も白寄りにする）
const backgroundLayerStyle: CSSProperties = {
  filter: `brightness(${EXPOSURE})`,
};

const textureStyle: CSSProperties = {
  backgroundImage: `url(${cardBackground.src})`,
};

// 立体感: 輪郭付近の淡く近い影＋下方向に広がる柔らかい影
const cardShadowClass =
  "shadow-[0_1px_2px_rgb(40_90_120/0.06),0_4px_8px_rgb(40_90_120/0.06),0_12px_28px_rgb(40_90_120/0.08)]";

// 縁の光沢: 上辺の白いハイライト＋下辺のわずかな陰（背景より手前に描くため別要素にする）
const edgeHighlightClass =
  "shadow-[inset_0_1px_0_rgb(255_255_255/0.9),inset_0_-1px_0_rgb(40_90_120/0.08)]";

type ContentCardProps = {
  children: ReactNode;
  className?: string;
};

export default function ContentCard({ children, className = "" }: ContentCardProps) {
  return (
    <div
      className={`relative isolate overflow-hidden rounded-2xl ${cardShadowClass} ${className}`}
    >
      {/* 背景: #A0D8EF（不透明度 90%）＋ 露出を上げた card_background（不透明度 20%） */}
      <div aria-hidden className="absolute inset-0 -z-10" style={backgroundLayerStyle}>
        <div className="absolute inset-0 bg-[#C2DAEB] opacity-90" />
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={textureStyle} />
      </div>

      {/* 縁の光沢 */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 rounded-[inherit] ${edgeHighlightClass}`}
      />

      {/* 本文 */}
      <div className="relative p-6 md:p-10">{children}</div>
    </div>
  );
}
