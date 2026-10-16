import type { CSSProperties } from "react";
import Image from "next/image";
import ContentCard from "@/components/common/ContentCard";
import { notoSansJP } from "@/components/common/fonts";
import { TOP_BAR_HEIGHT } from "@/components/common/pageLayout";

// 協賛項目の中身（協賛企業ごとの縦長カード。PC では左右、スマホでは縦に並べる）
// - カード: 上から 企業ロゴ → ポスター（A4 比率） → 企業名
// - TopSection の children として使う: <TopSection id="sponsors" title="協賛" screens={1} paddingY="py-4"><SponsorsSection /></TopSection>
// - スマホ: ポスターはカードの幅いっぱいに表示する
// - PC: 大見出しを含めて 1画面に収まるよう、ポスターの大きさを画面の高さから決める
// TODO: ロゴ・ポスター・企業名は仮のもの。協賛企業から届き次第差し替える

type Sponsor = {
  name: string;
  logoSrc: string;
  posterSrc: string;
};

const SPONSORS: Sponsor[] = [
  { name: "一関高専", logoSrc: "/img/unit/schoolbadge1.png", posterSrc: "/ogp/thumbnail.webp" },
  { name: "一関高専", logoSrc: "/img/unit/schoolbadge1.png", posterSrc: "/ogp/thumbnail.webp" },
];

// PC でポスター以外が占める高さ（TopSection・カードの値と揃える）
// 項目の上下余白 16px×2 + 大見出し + 見出し下の余白 48px + カードの余白 40px×2 + ロゴ 64px + 間隔 16px×2 + 企業名 28px + ゆとり 8px
const HEADING_HEIGHT = "clamp(32px, 100svh * 56 / 1024, 56px)";
const NON_POSTER_HEIGHT = `(32px + ${HEADING_HEIGHT} + 48px + 80px + 64px + 32px + 28px + 8px)`;

// ポスターの幅: 残りの高さに A4（210:297）で収まる幅
// カード 2枚が項目の枠（最大 960px）に収まる幅を上限とする: (枠 - 間隔 32px - カードの余白 80px×2) / 2
const posterStyle = {
  "--poster-w": `min(384px, calc((100vw - 32px - 192px) / 2), calc((100svh - ${TOP_BAR_HEIGHT} - ${NON_POSTER_HEIGHT}) * 210 / 297))`,
} as CSSProperties;

export default function SponsorsSection() {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-[repeat(2,auto)] md:justify-center md:gap-8">
      {SPONSORS.map((sponsor, i) => (
        <li key={i} className="flex">
          <ContentCard
            as="article"
            className="w-full"
            bodyClassName={`${notoSansJP.className} flex h-full flex-col items-center gap-4`}
          >
            {/* 企業ロゴ */}
            <Image
              src={sponsor.logoSrc}
              alt={`${sponsor.name}のロゴ`}
              width={160}
              height={64}
              className="block h-12 w-auto object-contain md:h-16"
            />

            {/* ポスター（A4 比率） */}
            <div
              className="relative aspect-210/297 w-full overflow-hidden border border-white bg-white shadow-sm md:w-(--poster-w)"
              style={posterStyle}
            >
              <Image
                src={sponsor.posterSrc}
                alt={`${sponsor.name}のポスター`}
                fill
                sizes="(max-width: 768px) calc(100vw - 80px), 400px"
                className="object-cover"
              />
            </div>

            {/* 企業名 */}
            <h3 className="m-0 text-center text-base font-bold text-gray-800 md:text-xl">{sponsor.name}</h3>
          </ContentCard>
        </li>
      ))}
    </ul>
  );
}
