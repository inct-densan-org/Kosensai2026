"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import { shipporiMincho } from "./fonts";
import { PAGE_BACKGROUND } from "./pageLayout";

// デザイン基準: 1440 x 1024 の画面で縦幅 96px。
// 高さ・文字サイズは画面高さに比例して拡縮する（n / 1024）。
// 背景: #9AC7D6 の単色
// 項目: 画面の左右中央に配置
// 項目: しっぽり明朝・#FDFDFD の文字
// 現在表示しているページの項目: 文字 #1b1f23・背景はページ自体の背景（#F2F4F0）と同色の台形で、
// トップバーの下端まで伸ばして下の画面とつなげる（タブのような見た目）
// 画面の横幅が 512px 未満（スマホ）のときはトップバーを隠し、右上のハンバーガーメニューに切り替える

type NavItem = {
  label: string;
  // 未実装のページはリンク先が存在しないため 404 になる
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "HOME", href: "/protected/top" },
  { label: "NEWS", href: "/news" },
  { label: "MAP", href: "/protected/map" },
  { label: "EVENTS", href: "/events" },
  { label: "BLOG", href: "/blog" },
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

// ハンバーガーメニュー（スマホ用）
// アイコン: 画面右上に固定。三本線で、開くと×に変化する
// メニュー: 不透明度90%の #a0d8ef で画面を覆い、項目をトップバーの左から順に縦に並べる。
// 文字（#1b1f23）は覆っている画面ごと不透明度90%で表示する
const MENU_ID = "mobile-menu";

// 三本線の各線。開いたときは上下の線を中央に寄せて回転させ×にし、中央の線は消す
const iconLineClass = "absolute left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full transition-all duration-300";

function MobileMenu({
  current,
  onItemClick,
}: {
  current?: string;
  onItemClick: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // 開いている間は後ろの画面をスクロールさせず、Esc キーで閉じられるようにする
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const lineColor = isOpen ? "bg-[#1b1f23]" : "bg-[#FDFDFD]";

  return (
    <div className={`${shipporiMincho.className} min-[512px]:hidden`}>
      <button
        type="button"
        aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={isOpen}
        aria-controls={MENU_ID}
        onClick={() => setIsOpen((open) => !open)}
        className={`fixed top-4 right-4 z-[70] size-12 rounded-lg transition-colors duration-300 ${
          isOpen ? "bg-transparent" : "bg-[#9AC7D6]"
        }`}
      >
        <span aria-hidden className={`${iconLineClass} ${lineColor} ${isOpen ? "top-1/2 rotate-45" : "top-[15px]"}`} />
        <span aria-hidden className={`${iconLineClass} ${lineColor} top-1/2 ${isOpen ? "opacity-0" : ""}`} />
        <span
          aria-hidden
          className={`${iconLineClass} ${lineColor} ${isOpen ? "top-1/2 -rotate-45" : "top-[calc(100%-17px)]"}`}
        />
      </button>

      <nav
        id={MENU_ID}
        aria-label="メインメニュー"
        inert={!isOpen}
        className={`fixed inset-0 z-[60] flex items-center justify-center bg-[#a0d8ef] transition-[opacity,visibility] duration-300 ${
          isOpen ? "visible opacity-90" : "invisible opacity-0"
        }`}
      >
        <ul className="m-0 flex list-none flex-col items-center gap-8 p-0">
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={(event) => {
                  setIsOpen(false);
                  onItemClick(event, href);
                }}
                aria-current={current === label ? "page" : undefined}
                className="text-[28px] leading-none tracking-[0.08em] text-[#1b1f23] no-underline"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default function TopBar({ current }: { current?: string }) {
  const pathname = usePathname();

  // 別ページへの遷移は Link が最上部から表示する。
  // 表示中のページの項目は遷移が起きないため、自前で最上部までスクロールさせる
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== href) return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`${shipporiMincho.className} sticky top-0 z-50 flex h-[calc(100svh*96/1024)] w-full justify-center bg-[#9AC7D6] px-[min(calc(100vw*64/1440),64px)] max-[512px]:hidden`}
      >
        <nav aria-label="メインメニュー" className="h-full">
          {/* 項目の左右余白（24px×2）と合わせて、文字同士の間隔が 56px 程度になるようにする */}
          <ul className="m-0 flex h-full list-none items-stretch gap-[min(calc(100vw*8/1440),8px)] p-0">
            {NAV_ITEMS.map(({ label, href }) => {
              const isCurrent = current === label;
              return (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={(event) => handleClick(event, href)}
                    aria-current={isCurrent ? "page" : undefined}
                    className={
                      isCurrent
                        ? `${currentItemClass} no-underline`
                        : `${itemClass} no-underline transition-opacity hover:opacity-70`
                    }
                  >
                    <ItemLabel label={label} isCurrent={isCurrent} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <MobileMenu current={current} onItemClick={handleClick} />
    </>
  );
}
