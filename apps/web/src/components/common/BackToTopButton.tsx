"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

// 最上部へ戻るボタン
// - ページの一番下までスクロールすると画面右下に表示する
// - 押すとページの最上部までスクロールする
// - 見た目はハンバーガーメニューのアイコン（TopBar.tsx）と揃える（#9AC7D6 の角丸・#FDFDFD のアイコン）

// 一番下に着いたとみなす残りスクロール量（px）。小数点以下の誤差を吸収する
const BOTTOM_THRESHOLD = 4;

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const remaining = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      setIsVisible(remaining <= BOTTOM_THRESHOLD);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="ページの最上部へ戻る"
      inert={!isVisible}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-4 bottom-4 z-50 flex size-12 items-center justify-center rounded-lg bg-[#9AC7D6] p-0 text-[#FDFDFD] transition-[opacity,visibility] duration-300 hover:opacity-70 min-[512px]:right-8 min-[512px]:bottom-8 ${
        isVisible ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <ArrowUp aria-hidden className="size-6" />
    </button>
  );
}
