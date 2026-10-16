"use client";

import { getImageProps } from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { inter, notoSansJP } from "@/components/common/fonts";

// clock / step は元のSVG（PNG埋め込みで数十MB）をWebP化したもの（near-lossless でほぼ劣化なし）。
// 淡い半透明の絵柄は Next.js の画像最適化で再圧縮すると目鼻などが薄くなるため、
// 最適化を通さず（unoptimized）、1倍・2倍の画像を自前で用意して srcSet で出し分ける。
// - *-pc@{1x,2x}.webp: 全体（デザインサイズの1倍・2倍）
// - *-sp@{1x,2x}.webp: 中央の正方形（高さ×高さ）を切り出したもの。縦長画面では左右が見切れるため、その部分を省く
type Source = { name: string; width: number; height: number };
const clock = {
  pc: { name: "clock-pc", width: 1440, height: 1024 },
  sp: { name: "clock-sp", width: 1024, height: 1024 },
};
const step = {
  pc: { name: "step-pc", width: 1440, height: 1018 },
  sp: { name: "step-sp", width: 1018, height: 1018 },
};

// スマホ向け（max-[512px]: と同じ境界）以外で PC 用の画像を使う
const PC_MEDIA = "(min-width: 513px)";
// 表示幅: object-cover で画面を覆うため、画面が画像より縦長なら高さ基準になる
const PC_SIZES = "(max-aspect-ratio: 1440/1024) calc(100vh * 1440 / 1024), 100vw";
// スマホ用は正方形なので（縦長画面では）画面の高さが表示幅になる
const SP_SIZES = "(max-aspect-ratio: 1/1) 100vh, 100vw";

const srcOf = (name: string, scale: 1 | 2) => `/img/top/${name}@${scale}x.webp`;
const srcSetOf = ({ name, width }: Source) =>
  `${srcOf(name, 1)} ${width}w, ${srcOf(name, 2)} ${width * 2}w`;

// PC / スマホで画像を出し分けるための props を作る（最初に表示する画像なので優先して読み込む）
const pictureProps = ({ pc, sp }: { pc: Source; sp: Source }) => {
  const { props } = getImageProps({
    alt: "",
    src: srcOf(sp.name, 2),
    width: sp.width,
    height: sp.height,
    unoptimized: true,
    loading: "eager",
    fetchPriority: "high",
  });
  return {
    pcSrcSet: srcSetOf(pc),
    spProps: { ...props, srcSet: srcSetOf(sp), sizes: SP_SIZES },
  };
};

const clockPicture = pictureProps(clock);
const stepPicture = pictureProps(step);

// 読み込み済み（キャッシュ等でハイドレーション前に load が終わっている場合を含む）を検知する
const onReady = (done: () => void) => ({
  ref: (img: HTMLImageElement | null) => {
    if (img?.complete) done();
  },
  onLoad: done,
  onError: done,
});

function HeroPicture({
  picture,
  onDone,
}: {
  picture: ReturnType<typeof pictureProps>;
  onDone: () => void;
}) {
  return (
    <picture className="block h-full w-full">
      <source media={PC_MEDIA} srcSet={picture.pcSrcSet} sizes={PC_SIZES} />
      <img {...picture.spProps} {...onReady(onDone)} className="block h-full w-full object-cover" />
    </picture>
  );
}

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

// 開催日（day）: 元の day.svg（1440x1018）をテキストで再現したもの。
// 各要素は day.svg 内の位置（デザイン座標）に、横中央揃えで配置する。
// x: 中央の位置 / y: 行の上端（line-height: 1）/ size: 文字サイズ / tracking: 字間（em）
const DAY_ITEMS = [
  { text: "一関高専文化祭", x: 721, y: 743, size: 48 },
  { text: "2026", x: 721, y: 802, size: 48 },
  { text: "10/24", x: 566, y: 849, size: 64 },
  { text: ">>>", x: 720, y: 865, size: 64 },
  { text: "10/25", x: 874, y: 849, size: 64 },
  { text: "SAT", x: 565, y: 916, size: 32, tracking: 0.48 },
  { text: "SUN", x: 874, y: 916, size: 32, tracking: 0.48 },
];

// 英数字は Inter、漢字は Noto Sans JP（Regular）
const dayTextStyle: CSSProperties = {
  fontFamily: `${inter.style.fontFamily}, ${notoSansJP.style.fontFamily}`,
  fontWeight: 400,
  color: "#6A99A6",
};

const dayItemStyle = ({ x, y, size, tracking = 0 }: (typeof DAY_ITEMS)[number]): CSSProperties => ({
  left: `calc(var(--fit) * ${x})`,
  top: `calc(var(--fit) * ${y})`,
  fontSize: `calc(var(--fit) * ${size})`,
  letterSpacing: `${tracking}em`,
  // 最後の文字の後ろにも字間が付くので、同じ幅を左にも足して中央をそろえる
  paddingLeft: `${tracking}em`,
});

// day 用のデザインフレーム: 画面に収まる倍率で拡縮（左右中央・下揃え）
const dayFrameStyle: CSSProperties = {
  width: "calc(var(--fit) * 1440)",
  height: "calc(var(--fit) * 1024)",
};

export default function HeroImages() {
  const [clockLoaded, setClockLoaded] = useState(false);
  const [stepLoaded, setStepLoaded] = useState(false);
  const [firstDone, setFirstDone] = useState(false);

  const firstVisible = clockLoaded && stepLoaded;
  const dayVisible = firstDone;

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
        <HeroPicture picture={clockPicture} onDone={() => setClockLoaded(true)} />
      </div>

      {/* 前面: step（1440x1018）
          縦横比を保ったまま画面全体を覆うように拡縮し、中央部分を残す */}
      <div className={`absolute inset-0 z-10 ${fadeClass}`} style={fadeStyle(firstVisible)}>
        <HeroPicture picture={stepPicture} onDone={() => setStepLoaded(true)} />
      </div>

      {/* day 用のデザインフレーム（画面内に収まる） */}
      {/* スマホでは下からの余白を追加 */}
      <div
        className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 max-[512px]:bottom-[calc(100cqh*64/1024)]"
        style={dayFrameStyle}
      >
        <div className={`absolute inset-0 ${fadeClass}`} style={fadeStyle(dayVisible)}>
          {/* 開催日（1440x1018・配置は day.svg と同じ）: フレーム下端
              日付の数字が約48px（デザイン上は64px）になるよう 0.75 倍に縮小。
              文字ブロックの下端中央（x=720, y=951）を基準に縮小し、下からの余白を維持。
              スマホでは 1.75 倍に拡大 */}
          <div
            className="absolute bottom-0 left-0 aspect-[1440/1018] w-full origin-[50%_calc(100%*951/1018)] scale-75 max-[512px]:scale-[1.75]"
            style={dayTextStyle}
          >
            <p className="sr-only">一関高専文化祭 2026 10月24日(土)・25日(日) 開催</p>
            {DAY_ITEMS.map((item) => (
              <span
                key={item.text}
                aria-hidden
                className="absolute -translate-x-1/2 whitespace-nowrap leading-none"
                style={dayItemStyle(item)}
              >
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
