import { ScheduleTable } from "@/components/events/page";
import TopBar from "@/components/common/TopBar";
import Footer from "@/components/common/Footer";
import PageBackground from "@/components/common/PageBackground";
import { PAGE_BACKGROUND } from "@/components/common/pageLayout";
import { shipporiMincho } from "@/components/common/fonts";

export default function Page() {
  return (
    <>
      <TopBar current="EVENTS" />
      <div
        className="relative isolate min-h-screen w-full"
        style={{ backgroundColor: PAGE_BACKGROUND }}
      >
        <PageBackground />
        <main className="mx-auto w-full max-w-[1024px] px-4 py-12 sm:py-16">
          <header className="mb-8 border-b border-black/20 pb-8 sm:mb-10 sm:pb-9">
            <h1 className={`${shipporiMincho.className} text-center !text-4xl !font-bold !leading-none tracking-[0.08em] sm:!text-6xl`}>
              イベントスケジュール
            </h1>
          </header>
          <ScheduleTable />
        </main>
        <Footer />
      </div>
    </>
  );
}
