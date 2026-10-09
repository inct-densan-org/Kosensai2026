import HeroPC from "./HeroPC";
import HeroScroll from "./HeroScroll";
import TopBar, { PAGE_BACKGROUND } from "@/components/common/TopBar";
import TopSection, { screensHeight } from "./TopSection";

export function TopPageClient() {
  return (
    <main className="relative w-full">
      <HeroPC id="hero" />
      <HeroScroll heroId="hero" />

      {/* ヒーローより下の画面: スクロールするとトップバーが画面上部に固定される */}
      <div className="relative min-h-dvh w-full" style={{ backgroundColor: PAGE_BACKGROUND }}>
        <TopBar current="HOME" />

        {/* 各項目（screens: 確保する高さ。画面何枚分か） */}
        <TopSection id="greeting" title="ごあいさつ" screens={1} />
        <TopSection id="news" title="ニュース" screens={1} />
        <TopSection id="access" title="アクセス" screens={2} />
        <TopSection id="stalls" title="屋台" screens={1} />
        <TopSection id="sponsors" title="協賛" screens={0.5} />

        {/* フッター（見出しなし・0.5画面） */}
        <footer className="w-full" style={{ minHeight: screensHeight(0.5) }} />
      </div>
    </main>
  );
}
