"use client";

import { useEffect } from "react";

// ヒーローセクションからのスクロール制御
// - ヒーロー表示中に下へスクロールすると、ヒーローの高さぶん（固定値）一気にスクロールし、
//   ヒーローが画面に映らない位置（下の画面の先頭）で止める
// - 下の画面の先頭から上へスクロールすると、ヒーローの先頭まで一気に戻す
// - 途中で止まってヒーローが半端に映ることがないよう、ヒーロー付近では通常スクロールを止める

// スクロールアニメーションの時間（ms）
const DURATION = 700;
// アニメーション後、慣性スクロール（トラックパッド等）の余韻を無視する時間（ms）
const COOLDOWN = 400;
// スワイプと判定する最小移動量（px）
const SWIPE_THRESHOLD = 30;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function HeroScroll({ heroId }: { heroId: string }) {
  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;

    let locked = false;
    let touchStartY: number | null = null;

    // ヒーローが映らなくなるスクロール位置（ヒーローの下端）
    const heroBottom = () => hero.offsetTop + hero.offsetHeight;

    const scrollToY = (to: number) => {
      locked = true;
      const from = window.scrollY;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1);
        window.scrollTo(0, from + (to - from) * easeInOutCubic(t));
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          setTimeout(() => {
            locked = false;
          }, COOLDOWN);
        }
      };
      requestAnimationFrame(step);
    };

    // 方向に応じて移動先を決める。ヒーローの範囲外なら null（通常スクロール）
    const targetFor = (direction: 1 | -1) => {
      const y = window.scrollY;
      const bottom = heroBottom();
      if (direction > 0 && y < bottom - 1) return bottom;
      if (direction < 0 && y > 0 && y <= bottom + 1) return 0;
      return null;
    };

    // ヒーローが少しでも映っているか
    const heroVisible = () => window.scrollY < heroBottom() - 1;

    const onWheel = (e: WheelEvent) => {
      if (locked) {
        if (heroVisible() || targetFor(e.deltaY > 0 ? 1 : -1) !== null) {
          e.preventDefault();
        }
        return;
      }
      if (e.deltaY === 0) return;
      const target = targetFor(e.deltaY > 0 ? 1 : -1);
      if (target === null) return;
      e.preventDefault();
      scrollToY(target);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY === null) return;
      const dy = touchStartY - (e.touches[0]?.clientY ?? touchStartY);
      if (dy === 0) return;
      // ヒーロー表示中、または下の画面の先頭から上へ戻ろうとしている場合は通常スクロールを止める
      if (locked || targetFor(dy > 0 ? 1 : -1) !== null) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null) return;
      const dy = touchStartY - (e.changedTouches[0]?.clientY ?? touchStartY);
      touchStartY = null;
      if (locked || Math.abs(dy) < SWIPE_THRESHOLD) return;
      const target = targetFor(dy > 0 ? 1 : -1);
      if (target !== null) scrollToY(target);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, [contenteditable='true']")) return;
      let direction: 1 | -1 | null = null;
      if (["ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey)) {
        direction = 1;
      } else if (["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey)) {
        direction = -1;
      }
      if (direction === null) return;
      const target = targetFor(direction);
      if (target === null) return;
      e.preventDefault();
      if (!locked) scrollToY(target);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [heroId]);

  return null;
}
