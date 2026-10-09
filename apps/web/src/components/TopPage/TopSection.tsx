import type { ReactNode } from "react";
import { shipporiMincho } from "@/components/common/fonts";
import { TOP_BAR_HEIGHT } from "@/components/common/TopBar";

// トップページの各項目（ごあいさつ・ニュースなど）の枠
// - 大見出し＋本文エリアで構成する
// - screens: 確保する高さ（画面何枚分か）。1画面 = 画面の高さからトップバーを除いた高さ
//   本文が収まらない場合は高さが伸びる（min-height で確保）

// 画面 n 枚分の高さ（トップバーを除く）
export function screensHeight(screens: number) {
  return `calc((100svh - ${TOP_BAR_HEIGHT}) * ${screens})`;
}

type TopSectionProps = {
  id: string;
  title: string;
  screens: number;
  children?: ReactNode;
};

export default function TopSection({ id, title, screens, children }: TopSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="mx-auto flex w-[min(960px,calc(100%-32px))] flex-col py-16"
      style={{ minHeight: screensHeight(screens) }}
    >
      {/* 大見出し */}
      <h2
        id={headingId}
        className={`${shipporiMincho.className} m-0 text-center text-[length:clamp(32px,calc(100svh*56/1024),56px)] leading-none tracking-[0.08em] text-[#1f3a4a]`}
      >
        {title}
      </h2>

      {/* 本文（内容は未定。残りの高さを確保する） */}
      <div className="mt-12 flex-1">{children}</div>
    </section>
  );
}
