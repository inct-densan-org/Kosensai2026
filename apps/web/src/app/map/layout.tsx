import { Metadata } from "next";
import TopBar from "@/components/common/TopBar";
import Footer from "@/components/common/Footer";
import PageBackground from "@/components/common/PageBackground";
import WhiteCard from "@/components/common/WhiteCard";
import { PAGE_BACKGROUND } from "@/components/common/pageLayout";
import { shipporiMincho } from "@/components/common/fonts";

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
      <TopBar current="MAP" />
      <div
        className="relative isolate min-h-screen w-full"
        style={{ backgroundColor: PAGE_BACKGROUND }}
      >
        <PageBackground />
        <main className="mx-auto w-full max-w-[900px] px-4 py-12 sm:py-16">
          <header className="mb-8 border-b border-black/20 pb-8 sm:mb-10 sm:pb-9">
            <h1 className={`${shipporiMincho.className} !text-4xl !font-bold !leading-none tracking-[0.08em] sm:!text-6xl`}>
              校内マップ
            </h1>
          </header>
          <WhiteCard className="p-3 text-[#1f3a4a] md:p-6">{children}</WhiteCard>
        </main>
        <Footer />
      </div>
    </>
  );
}
