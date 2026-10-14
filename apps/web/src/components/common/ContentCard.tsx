 "use client";

import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import cardBackground from "./resource/card_background.webp";
import styles from "./ContentCard.module.css";

// 各ページの項目の本文を入れるカード（共通コンポーネント）
// - 背景: #C2DAEB の上に card_background を重ね、素材の露出を上げて白い素材にする
// - 単色（#C2DAEB）は不透明度 90%、素材画像は不透明度 20% にし、ページの背景が少し透けて見えるようにする
// - ドロップシャドウ（近い影＋遠い影）と上辺のハイライトで立体感を出す
// ※ card_background.webp は card_background.svg 内の画像を 2048px 幅に縮小・圧縮したもの（元SVGは約8MB）
//
// 使い方:
//   <ContentCard>本文</ContentCard>
//   <ContentCard as="section" id="news" className="mt-8">本文</ContentCard>

// カードの地色
const BASE_COLOR = "#C2DAEB";

// 素材の露出（明るさ）。値を上げるほど白く飛ぶ
const EXPOSURE = 1.1;

// 露出は地色と素材を重ねたもの全体にかける（素材の透明部分の地色も白寄りにする）
const backgroundLayerStyle: CSSProperties = {
  filter: `brightness(${EXPOSURE})`,
};

const baseColorStyle: CSSProperties = {
  backgroundColor: BASE_COLOR,
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

type ContentCardProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children: ReactNode;
  // カードの外側の要素（既定: div）。項目単位なら "section" や "article" を指定する
  as?: ElementType;
  // 本文部分（内側の余白を持つ要素）に追加するクラス
  bodyClassName?: string;
  // カードが表示中に回路・コードの装飾を定期的に再生する
  circuitReveal?: boolean;
};

export default function ContentCard({
  children,
  as: Tag = "div",
  className = "",
  bodyClassName = "",
  circuitReveal = false,
  ...rest
}: ContentCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!circuitReveal || !card) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setAnimationKey((key) => key + 1);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [circuitReveal]);

  useEffect(() => {
    if (!circuitReveal || !isVisible) {
      return;
    }

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setAnimationKey((key) => key + 1);
    }, 9000);

    return () => window.clearInterval(interval);
  }, [circuitReveal, isVisible]);

  return (
    <Tag
      ref={cardRef}
      {...rest}
      className={`relative isolate overflow-hidden rounded-2xl ${cardShadowClass} ${className}`}
    >
      {/* 背景: 地色（不透明度 90%）＋ 露出を上げた card_background（不透明度 20%） */}
      <div aria-hidden className="absolute inset-0 -z-10" style={backgroundLayerStyle}>
        <div className="absolute inset-0 opacity-90" style={baseColorStyle} />
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={textureStyle} />
      </div>

      {circuitReveal && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] text-sky-600 ${
            isVisible ? styles.circuitVisible : ""
          }`}
        >
          <svg
            key={animationKey}
            className="h-full w-full"
            viewBox="0 0 1000 500"
            preserveAspectRatio="none"
            fill="none"
          >
            <path className={styles.circuitPath} d="M-20 120H100V55H245V105H410" />
            <path
              className={`${styles.circuitPath} ${styles.circuitPathDelayed}`}
              d="M1020 355H890V285H755V340H600"
            />
            <path
              className={`${styles.circuitPath} ${styles.circuitPathDelayed}`}
              d="M315 520V430H395V375H510"
            />
            <circle className={styles.circuitNode} cx="245" cy="55" r="5" />
            <circle
              className={`${styles.circuitNode} ${styles.circuitPathDelayed}`}
              cx="755"
              cy="285"
              r="5"
            />
            <circle
              className={`${styles.circuitNode} ${styles.circuitPathDelayed}`}
              cx="395"
              cy="430"
              r="5"
            />
          </svg>
        </div>
      )}

      {/* 縁の光沢 */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 rounded-[inherit] ${edgeHighlightClass}`}
      />

      {/* 本文 */}
      <div className={`relative z-10 p-6 md:p-10 ${bodyClassName}`}>{children}</div>
    </Tag>
  );
}
