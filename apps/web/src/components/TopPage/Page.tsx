import HeroPC from "./HeroPC";
import HeroScroll from "./HeroScroll";
import TopBar from "@/components/common/TopBar";
import BackToTopButton from "@/components/common/BackToTopButton";
import Footer from "@/components/common/Footer";
import PageBackground from "@/components/common/PageBackground";
import { PAGE_BACKGROUND } from "@/components/common/pageLayout";
import TopSection from "./TopSection";
import ShopsSection from "./ShopsSection";
import AccessSection from "./AccessSection";
import NewsSection from "./NewsSection";
import HelloSection from "./HelloSection";
import PamphletSection from "./PamphletSection";
import SponsorsSection from "./SponsorsSection";
import VariousNoticeSection from "./VariousNoticeSection";
import StampRally from "./StampRally";

export function TopPageClient() {
  return (
    <main className="relative w-full">
      <HeroPC id="hero" />
      <HeroScroll heroId="hero" />

      {/* ヒーローより下の画面: スクロールするとトップバーが画面上部に固定される */}
      <div className="relative isolate min-h-dvh w-full" style={{ backgroundColor: PAGE_BACKGROUND }}>
        <PageBackground />
        <TopBar current="HOME" />

        {/* 各項目（screens: 確保する高さ。画面何枚分か） */}
        <TopSection id="greeting" title="ごあいさつ" screens={0}>
          <HelloSection />
        </TopSection>
        <TopSection id="news" title="ニュース" screens={1}>
          <NewsSection />
        </TopSection>
        <TopSection id="access" title="アクセス" screens={2.5}>
          <AccessSection />
        </TopSection>

        <TopSection id="stalls" title="屋台・自主企画" screens={0}>
          <ShopsSection />
        </TopSection>
        <TopSection id="various-notice" title="ご来場の皆様へ" screens={0}>
          <VariousNoticeSection />
        </TopSection>
        {/*<TopSection id="sponsors" title="協賛" screens={0.5}>*/}
        {/*  <SponsorsSection />*/}
        {/*</TopSection>*/}
        <TopSection id="pamphlet" title="パンフレット" screens={0}>
          <PamphletSection />
        </TopSection>
        <TopSection id="stamp-rally" title="スタンプラリー" screens={0}>
          <StampRally />
        </TopSection>

        <Footer />
      </div>

      {/* ページの一番下まで来たら右下に表示する、最上部へ戻るボタン */}
      <BackToTopButton />
    </main>
  );
}
