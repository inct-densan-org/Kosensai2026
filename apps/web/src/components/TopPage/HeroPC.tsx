import type { CSSProperties } from "react";
import HeroImages from "./HeroImages";
import { shipporiMincho } from "@/components/common/fonts";

// デザイン基準: 1440 x 1024。ヒーローは常に1画面で完結する。
// 画面の横幅が 512px 未満のときはスマホ向けの配置（max-[512px]:）を適用する。
// - 画像（clock / step）: 縦横比を保ったまま画面を覆い、中央部分を残す
// - 文字情報（タイトル / サブタイトル / day）: 画面に収まる倍率で拡縮し、常に画面内に表示する

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

// サブタイトル: 縦書き・72px・#FDFDFD のアウトラインのみ＋同色のドロップシャドウ（1440x1024基準）
// 影は文字本体と重なり過ぎないよう大きめにずらし、ぼかし＋半透明で奥行きを出す
const subtitleBaseStyle: CSSProperties = {
  writingMode: "vertical-rl",
  color: "transparent",
  WebkitTextStroke: "calc(var(--fit) * 2) #FDFDFD",
  filter:
    "drop-shadow(calc(var(--fit) * 6) calc(var(--fit) * 6) calc(var(--fit) * 3) rgb(253 253 253 / 0.55))",
};

// サブタイトルの文字サイズ: 96px（スマホでは 144px 相当に拡大）
const subtitleClass =
  "absolute z-30 m-0 whitespace-nowrap leading-none text-[length:calc(var(--fit)*96)] max-[512px]:text-[length:calc(var(--fit)*144)]";

// 前半: 上から220px・画面中央から右へ256px離す（左端を揃える）
// スマホ: 上から168px・中央から420px（1440基準）離す。
// ただし画面が低い場合はメインタイトル（上から96/1024・192px相当）の下端＋24px相当より下に置く
const subtitleFirstClass =
  "top-[calc(100cqh*220/1024)] left-[calc(50%+100cqw*256/1440)] max-[512px]:top-[max(calc(100cqh*192/1024),calc(100cqh*96/1024+var(--fit)*216))] max-[512px]:left-[calc(50%+100cqw*420/1440)]";

// 後半: 下から192px・画面中央から左へ256px離す（右端を揃える）
// スマホ: 中央から420px（1440基準）離す。
// 縦長画面では step は画面高さ基準で拡縮され、白い台座の上端が画面高さの約56%（デザインy=572/1018）に来るため、
// 下端をそれより上（下から480/1024 ≒ 47%）に置いて被らないようにする
const subtitleSecondClass =
  "bottom-[calc(100cqh*192/1024)] right-[calc(50%+100cqw*256/1440)] max-[512px]:bottom-[calc(100cqh*480/1024)] max-[512px]:right-[calc(50%+100cqw*420/1440)]";

export default function HeroPC({ id }: { id?: string }) {
  return (
    <section
      id={id}
      className="relative h-dvh w-full overflow-hidden bg-linear-to-br from-[#73C1D7] to-[#C7ECF4]"
      style={sectionStyle}
    >
      {/* 画像（clock・step → day の順に右からフェードイン） */}
      <HeroImages />

      {/* メインタイトル */}
      <h1
        className={`${shipporiMincho.className} absolute top-[calc(100cqh*16/1024)] left-1/2 z-30 m-0 -translate-x-1/2 whitespace-nowrap leading-none tracking-normal text-[#FDFDFD] max-[512px]:top-[calc(100cqh*96/1024)]`}
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
