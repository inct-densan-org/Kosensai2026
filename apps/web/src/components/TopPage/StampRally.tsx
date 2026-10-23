import Image from "next/image";
import ContentCard from "@/components/common/ContentCard";

const STAMP_RALLY_URL =
  "https://neeerl.dpdns.org/participant/e2ce01da-4932-4f5d-9267-b8690b688b05";

function StampIcon() {
  return (
    <svg
      viewBox="0 0 100 82"
      className="block h-auto w-[72px] sm:w-[80px]"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M24 64V58a8 8 0 0 1 6-10h40a8 8 0 0 1 6 10v6H24Z" />
      <path d="M70 48C40 24 80 20 58 6A16 16 0 0 0 50 4" />
      <path d="M30 48C60 24 20 20 42 6A16 16 0 0 1 50 4" />
      <path d="M30 70h40v2H30Z" fill="currentColor" strokeWidth="1" />
    </svg>
  );
}

export default function StampRally() {
  return (
    <>
      <a
        href={STAMP_RALLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="デジタルスタンプラリーに参加する（外部サイト）"
        className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287c95]"
      >
        <ContentCard
          className="group-hover:saturate-75"
          bodyClassName="p-6 sm:p-8 md:p-10"
        >
          <div className="flex items-center lg:justify-between lg:gap-12">
            <div className="flex w-full items-center gap-5 sm:gap-7 lg:max-w-[560px]">
              <span className="flex size-24 shrink-0 items-center justify-center rounded-full bg-[#287c95] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] sm:size-28">
                <StampIcon />
              </span>

              <div className="min-w-0">
                <p className="m-0 text-xs font-bold tracking-[0.15em] text-[#287c95] group-hover:text-[#65757c] sm:text-sm">
                  DIGITAL STAMP RALLY
                </p>
                <h3 className="m-0 mt-2 text-xl font-bold leading-snug text-[#1f3a4a] group-hover:text-[#536169] sm:text-3xl">
                  会場をめぐって、
                  <br />
                  デジタルスタンプを集めよう！
                </h3>
              </div>
            </div>

            <div className="hidden shrink-0 text-center lg:block">
              <Image
                src="/img/top/stario-icon.svg"
                alt="サクッとラリーのアイコン"
                width={280}
                height={280}
                sizes="112px"
                className="size-28 rounded-full"
              />
              <p className="m-0 mt-2 text-sm font-bold tracking-[0.08em] text-[#1f3a4a] group-hover:text-[#536169]">
                サクッとラリー
              </p>
            </div>
          </div>
        </ContentCard>
      </a>
      <p>※ 企画「サクッとラリー」で使うシステムに遷移します</p>
    </>
  );
}
