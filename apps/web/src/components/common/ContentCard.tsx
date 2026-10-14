 import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from "react";
 import cardBackground from "./resource/card_background.webp";

 // 各ページの項目の本文を入れるカード（共通コンポーネント）

 const BASE_COLOR = "#C2DAEB";
 const EXPOSURE = 1.1;

 const backgroundLayerStyle: CSSProperties = {
   filter: `brightness(${EXPOSURE})`,
 };

 const baseColorStyle: CSSProperties = {
   backgroundColor: BASE_COLOR,
 };

 const textureStyle: CSSProperties = {
   backgroundImage: `url(${cardBackground.src})`,
 };

 const edgeHighlightClass =
   "shadow-[inset_0_1px_0_rgb(255_255_255/0.9),inset_0_-1px_0_rgb(40_90_120/0.08)]";

type ContentCardProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children: ReactNode;
  // カードの外側の要素（既定: div）。項目単位なら "section" や "article" を指定する
  as?: ElementType;
  // 本文部分（内側の余白を持つ要素）に追加するクラス
  bodyClassName?: string;
};

export default function ContentCard({
  children,
  as: Tag = "div",
  className = "",
  bodyClassName = "",
  ...rest
}: ContentCardProps) {
  return (
    <Tag
      {...rest}
      className={`relative isolate overflow-hidden rounded-2xl ${className}`}
    >
      <div aria-hidden className="absolute inset-0 -z-10" style={backgroundLayerStyle}>
        <div className="absolute inset-0 opacity-90" style={baseColorStyle} />
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={textureStyle} />
      </div>

      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 rounded-[inherit] ${edgeHighlightClass}`}
      />

      <div className={`relative p-6 md:p-10 ${bodyClassName}`}>{children}</div>
    </Tag>
  );
}
