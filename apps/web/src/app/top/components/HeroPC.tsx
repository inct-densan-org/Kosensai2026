import Image from "next/image";
import localFont from "next/font/local";
import type { CSSProperties } from "react";
import clock from "../resource/clock.svg";
import step from "../resource/step.svg";
import day from "../resource/day.svg";

// デザイン基準: 1440 x 1024。ヒーローは常に1画面で完結する。
// - 画像（clock / step）: 縦横比を保ったまま画面を覆い、中央部分を残す
// - 文字情報（タイトル / サブタイトル / day）: 画面に収まる倍率で拡縮し、常に画面内に表示する

const shipporiMincho = localFont({
  src: "../resource/ShipporiMinchoB1-Bold.ttf",
  weight: "700",
  display: "swap",
});

// メインタイトル（文言は仮）
const MAIN_TITLE = "青春はtimeless";

// サブタイトル前半・後半（文言は仮）
const SUBTITLE_FIRST = "今しかない";
const SUBTITLE_SECOND = "この瞬間を";

// --fit: 画面に収まる倍率（デザイン1pxあたりの実寸）
const sectionStyle = {
  containerType: "size",
  "--fit": "min(100cqw / 1440, 100cqh / 1024)",
} as CSSProperties;

// メインタイトル: 中央揃え（1440x1024基準）
// 位置は画面高さに対する比率、文字サイズは画面に収まる倍率で拡縮
// 上からの余白はクラス側で指定（スマホでは大きめ）
const titleStyle: CSSProperties = {
  fontSize: "calc(var(--fit) * 192)",
};

// サブタイトル: 縦書き・72px・白のアウトラインのみ＋白のドロップシャドウ（1440x1024基準）
// 影は文字本体と重なり過ぎないよう大きめにずらし、ぼかし＋半透明で奥行きを出す
const subtitleBaseStyle: CSSProperties = {
  writingMode: "vertical-rl",
  color: "transparent",
  WebkitTextStroke: "calc(var(--fit) * 2) #FFFFFF",
  filter:
    "drop-shadow(calc(var(--fit) * 6) calc(var(--fit) * 6) calc(var(--fit) * 3) rgb(255 255 255 / 0.55))",
};

// サブタイトルの文字サイズ: 96px（スマホでは 144px 相当に拡大）
const subtitleClass =
  "absolute z-30 m-0 whitespace-nowrap leading-none text-[length:calc(var(--fit)*96)] max-md:text-[length:calc(var(--fit)*144)]";

// 前半: 上から220px・画面中央から右へ256px離す（左端を揃える）
// スマホ: 上から168px・中央から420px（1440基準）離す。
// ただし画面が低い場合はメインタイトル（上から96/1024・192px相当）の下端＋24px相当より下に置く
const subtitleFirstClass =
  "top-[calc(100cqh*220/1024)] left-[calc(50%+100cqw*256/1440)] max-md:top-[max(calc(100cqh*192/1024),calc(100cqh*96/1024+var(--fit)*216))] max-md:left-[calc(50%+100cqw*420/1440)]";

// 後半: 下から192px・画面中央から左へ256px離す（右端を揃える）
// スマホ: 中央から420px（1440基準）離す。
// 縦長画面では step は画面高さ基準で拡縮され、白い台座の上端が画面高さの約56%（デザインy=572/1018）に来るため、
// 下端をそれより上（下から480/1024 ≒ 47%）に置いて被らないようにする
const subtitleSecondClass =
  "bottom-[calc(100cqh*192/1024)] right-[calc(50%+100cqw*256/1440)] max-md:bottom-[calc(100cqh*480/1024)] max-md:right-[calc(50%+100cqw*420/1440)]";

// day 用のデザインフレーム: 画面に収まる倍率で拡縮（左右中央・下揃え）
const dayFrameStyle: CSSProperties = {
  width: "calc(var(--fit) * 1440)",
  height: "calc(var(--fit) * 1024)",
};

export default function HeroPC() {
  return (
    <section
      className="relative h-dvh w-full overflow-hidden bg-linear-to-br from-[#73C1D7] to-[#C7ECF4]"
      style={sectionStyle}
    >
      {/* 背面: clock（1440x1024）
          フレームとは別に、縦横比を保ったまま画面全体を覆うように拡縮・中央配置 */}
      <Image
        src={clock}
        alt=""
        priority
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      {/* 前面: step（1440x1018）
          縦横比を保ったまま画面全体を覆うように拡縮し、中央部分を残す */}
      <Image
        src={step}
        alt=""
        priority
        className="absolute inset-0 z-10 h-full w-full object-cover"
      />

      {/* day 用のデザインフレーム（画面内に収まる） */}
      {/* スマホでは下からの余白を追加 */}
      <div
        className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 max-md:bottom-[calc(100cqh*64/1024)]"
        style={dayFrameStyle}
      >

        {/* 開催日（1440x1018・配置は画像内で調整済み）: フレーム下端
            日付の数字が約48px（画像内は約64px）になるよう 0.75 倍に縮小。
            文字ブロックの下端中央（x=720, y=951）を基準に縮小し、下からの余白を維持。
            スマホでは 1.75 倍に拡大 */}
        <Image
          src={day}
          alt="10月24日(土)・25日(日) 開催"
          priority
          className="absolute bottom-0 left-0 h-auto w-full origin-[50%_calc(100%*951/1018)] scale-75 max-md:scale-[1.75]"
        />
      </div>

      {/* メインタイトル */}
      <h1
        className={`${shipporiMincho.className} absolute top-[calc(100cqh*16/1024)] left-1/2 z-30 m-0 -translate-x-1/2 whitespace-nowrap leading-none tracking-normal text-[#F4FBFD] max-md:top-[calc(100cqh*96/1024)]`}
        style={titleStyle}
      >
        {MAIN_TITLE}
      </h1>

      {/* サブタイトル */}
      <p
        className={`${shipporiMincho.className} ${subtitleClass} ${subtitleFirstClass}`}
        style={subtitleBaseStyle}
      >
        {SUBTITLE_FIRST}
      </p>
      <p
        className={`${shipporiMincho.className} ${subtitleClass} ${subtitleSecondClass}`}
        style={subtitleBaseStyle}
      >
        {SUBTITLE_SECOND}
      </p>
    </section>
  );
}
