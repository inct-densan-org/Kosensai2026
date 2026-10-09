import Link from "next/link";
import type { CSSProperties } from "react";
import { shipporiMincho } from "./fonts";

// デザイン基準: 1440 x 1024 の画面で縦幅 96px。
// 高さ・文字サイズは画面高さに比例して拡縮する（n / 1024）。
// 背景: #9AC7D6 の単色
// 項目: 画面の左右中央に配置
// 項目: しっぽり明朝・#FDFDFD の文字
// 現在表示しているページの項目: 文字 #1b1f23・背景はページ自体の背景（#F2F4F0）と同色の台形で、
// トップバーの下端まで伸ばして下の画面とつなげる（タブのような見た目）

// ページ自体の背景色（page.tsx のヒーロー以下の背景と揃える）
export const PAGE_BACKGROUND = "#F2F4F0";

// トップバーの高さ（下の header の h-[...] と揃える）
export const TOP_BAR_HEIGHT = "calc(100svh*96/1024)";

type NavItem = {
  label: string;
  // 遷移先が未定の項目は href なし（文字のみ表示）
  href?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "HOME", href: "/top" },
  { label: "NEWS" },
  { label: "MAP" },
  { label: "EVENTS" },
];

// 台形の上端: トップバー上端から 16px 下（1440x1024基準）。下端はトップバーの下端
const TAB_TOP = "calc(100svh*16/1024)";
// 台形の斜辺の傾き（上辺が左右それぞれ内側へ入る量）: 16px
const TAB_SLANT = "calc(100svh*16/1024)";

const tabStyle: CSSProperties = {
  top: TAB_TOP,
  backgroundColor: PAGE_BACKGROUND,
  clipPath: `polygon(${TAB_SLANT} 0, calc(100% - ${TAB_SLANT}) 0, 100% 100%, 0 100%)`,
};

// 項目の文字サイズ: 24px、左右の余白: 24px（1440x1024基準）
// 項目はトップバーの高さいっぱいに広げ、文字は台形の範囲（上端16px〜下端）の中央に置く。
// 全項目に同じ余白を持たせ、現在のページが変わっても位置がずれないようにする
const itemBaseClass =
  "relative isolate flex h-full items-center whitespace-nowrap leading-none tracking-[0.08em] text-[length:calc(100svh*24/1024)] pt-[calc(100svh*16/1024)] px-[calc(100svh*24/1024)]";
const itemClass = `${itemBaseClass} text-[#FDFDFD]`;
const currentItemClass = `${itemBaseClass} text-[#1b1f23]`;

function ItemLabel({ label, isCurrent }: { label: string; isCurrent: boolean }) {
  return (
    <>
      {isCurrent && <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10" style={tabStyle} />}
      {label}
    </>
  );
}

export default function TopBar({ current }: { current?: string }) {
  return (
    <header
      className={`${shipporiMincho.className} sticky top-0 z-50 flex h-[calc(100svh*96/1024)] w-full justify-center bg-[#9AC7D6] px-[min(calc(100vw*64/1440),64px)] max-[512px]:px-4`}
    >
      <nav aria-label="メインメニュー" className="h-full">
        {/* 項目の左右余白（24px×2）と合わせて、文字同士の間隔が 56px 程度になるようにする */}
        <ul className="m-0 flex h-full list-none items-stretch gap-[min(calc(100vw*8/1440),8px)] p-0 max-[512px]:gap-0">
          {NAV_ITEMS.map(({ label, href }) => {
            const isCurrent = current === label;
            return (
              <li key={label}>
                {href ? (
                  <Link
                    href={href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={
                      isCurrent
                        ? `${currentItemClass} no-underline`
                        : `${itemClass} no-underline transition-opacity hover:opacity-70`
                    }
                  >
                    <ItemLabel label={label} isCurrent={isCurrent} />
                  </Link>
                ) : (
                  <span className={isCurrent ? currentItemClass : itemClass}>
                    <ItemLabel label={label} isCurrent={isCurrent} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
