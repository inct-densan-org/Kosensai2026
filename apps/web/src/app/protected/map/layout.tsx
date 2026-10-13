import { Metadata } from "next";
// import { ReactNode } from "react";
import { LayoutWrapper, PageContainer } from "@/components/layout-wrapper";
import TopBar from "@/components/common/TopBar";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "校内マップ | 高専祭2026",
  description: "高専祭の校内マップです。各企画の場所や、受付、休憩所などの施設を確認できます。",
  openGraph: {
    title: "校内マップ | 高専祭2026",
    description: "高専祭の校内マップです。各企画の場所や、受付、休憩所などの施設を確認できます。",
  },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* LayoutWrapper の上余白に押し下げられないよう外に置き、画面上部に固定する */}
      <TopBar current="MAP" />
      <LayoutWrapper>
        <div className="py-6 text-center">
          <h1
            className="leading-snug tracking-normal font-bold"
            style={{ fontSize: "2.5rem" }}
          >
            校内マップ
          </h1>
        </div>
        <PageContainer>
          <div className="rounded-2xl border border-white p-4 md:p-8">
            {children}
          </div>
        </PageContainer>
      </LayoutWrapper>
      <Footer />
    </>
  );
}
