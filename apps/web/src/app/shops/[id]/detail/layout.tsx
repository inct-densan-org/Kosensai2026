import type { ReactNode } from "react";
import TopBar from "@/components/common/TopBar";
import Footer from "@/components/common/Footer";
import PageBackground from "@/components/common/PageBackground";
import { PAGE_BACKGROUND } from "@/components/common/pageLayout";

export default function ShopDetailLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar current="MAP" />
      <div
        className="relative isolate min-h-screen w-full"
        style={{ backgroundColor: PAGE_BACKGROUND }}
      >
        <PageBackground />
        {children}
        <Footer />
      </div>
    </>
  );
}
