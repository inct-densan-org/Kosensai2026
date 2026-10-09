import HeroPC from "./components/HeroPC";
import HeroScroll from "./components/HeroScroll";
import TopBar, { PAGE_BACKGROUND } from "./components/TopBar";
import ContentCard from "@/components/common/ContentCard";

export default function TopPage() {
  return (
    <main className="relative w-full">
      <HeroPC id="hero" />
      <HeroScroll heroId="hero" />

      {/* ヒーローより下の画面: スクロールするとトップバーが画面上部に固定される */}
      <div className="relative min-h-dvh w-full" style={{ backgroundColor: PAGE_BACKGROUND }}>
        <TopBar current="HOME" />

        {/* 各項目の本文カード（内容は仮） */}
        <div className="mx-auto w-[min(960px,calc(100%-32px))] py-16">
          <ContentCard>
            <h2 className="m-0 text-2xl font-bold text-[#1f3a4a]">お知らせ</h2>
            <p className="mt-4 mb-0 leading-relaxed text-[#2c4655]">
              ここに各項目の本文が入ります。
            </p>
          </ContentCard>
        </div>
      </div>
    </main>
  );
}
