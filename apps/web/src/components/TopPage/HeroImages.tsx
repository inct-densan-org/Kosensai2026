"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

// 画像は public/img/top 下に置く（サイズは各SVGの width / height）
const clock = { src: "/img/top/clock.svg", width: 1440, height: 1024 };
const step = { src: "/img/top/step.svg", width: 1440, height: 1018 };
const day = { src: "/img/top/day.svg", width: 1440, height: 1018 };

// ヒーローの画像（clock / step / day）
// 画像の読み込みに時間がかかるため、読み込みが終わってから右からフェードインさせる。
// 順番: clock・step（両方の読み込み完了後に同時）→ day（clock・step の表示が終わってから）
// ※ 親要素（HeroPC の section）で --fit が定義されていること

// フェードインの時間（ms）
const FADE_DURATION = 800;
// フェードイン開始時の右へのずれ: 64px（1440x1024基準）
const FADE_OFFSET = "calc(var(--fit) * 64)";

const fadeStyle = (visible: boolean): CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateX(0)" : `translateX(${FADE_OFFSET})`,
  transitionProperty: "opacity, transform",
  transitionDuration: `${FADE_DURATION}ms`,
  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
});

// 動きを減らす設定の場合はフェード・移動を行わない
const fadeClass = "motion-reduce:transition-none motion-reduce:transform-none";

// day 用のデザインフレーム: 画面に収まる倍率で拡縮（左右中央・下揃え）
const dayFrameStyle: CSSProperties = {
  width: "calc(var(--fit) * 1440)",
  height: "calc(var(--fit) * 1024)",
};

export default function HeroImages() {
  const [clockLoaded, setClockLoaded] = useState(false);
  const [stepLoaded, setStepLoaded] = useState(false);
  const [dayLoaded, setDayLoaded] = useState(false);
  const [firstDone, setFirstDone] = useState(false);

  const firstVisible = clockLoaded && stepLoaded;
  const dayVisible = firstDone && dayLoaded;

  // clock・step のフェードインが終わったら day を表示可能にする
  useEffect(() => {
    if (!firstVisible) return;
    const timer = setTimeout(() => setFirstDone(true), FADE_DURATION);
    return () => clearTimeout(timer);
  }, [firstVisible]);

  return (
    <>
      {/* 背面: clock（1440x1024）
          フレームとは別に、縦横比を保ったまま画面全体を覆うように拡縮・中央配置 */}
      <div className={`absolute inset-0 z-0 ${fadeClass}`} style={fadeStyle(firstVisible)}>
        <Image
          src={clock.src}
          width={clock.width}
          height={clock.height}
          alt=""
          priority
          onLoad={() => setClockLoaded(true)}
          onError={() => setClockLoaded(true)}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 前面: step（1440x1018）
          縦横比を保ったまま画面全体を覆うように拡縮し、中央部分を残す */}
      <div className={`absolute inset-0 z-10 ${fadeClass}`} style={fadeStyle(firstVisible)}>
        <Image
          src={step.src}
          width={step.width}
          height={step.height}
          alt=""
          priority
          onLoad={() => setStepLoaded(true)}
          onError={() => setStepLoaded(true)}
          className="h-full w-full object-cover"
        />
      </div>

      {/* day 用のデザインフレーム（画面内に収まる） */}
      {/* スマホでは下からの余白を追加 */}
      <div
        className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 max-[512px]:bottom-[calc(100cqh*64/1024)]"
        style={dayFrameStyle}
      >
        <div className={`absolute inset-0 ${fadeClass}`} style={fadeStyle(dayVisible)}>
          {/* 開催日（1440x1018・配置は画像内で調整済み）: フレーム下端
              日付の数字が約48px（画像内は約64px）になるよう 0.75 倍に縮小。
              文字ブロックの下端中央（x=720, y=951）を基準に縮小し、下からの余白を維持。
              スマホでは 1.75 倍に拡大 */}
          <Image
            src={day.src}
            width={day.width}
            height={day.height}
            alt="10月24日(土)・25日(日) 開催"
            priority
            onLoad={() => setDayLoaded(true)}
            onError={() => setDayLoaded(true)}
            className="absolute bottom-0 left-0 h-auto w-full origin-[50%_calc(100%*951/1018)] scale-75 max-[512px]:scale-[1.75]"
          />
        </div>
      </div>
    </>
  );
}
