"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { postersData } from "@/posters.data";

export default function ShopsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLElement>(null);
  const secondSetRef = useRef<HTMLElement>(null);
  const thirdSetRef = useRef<HTMLElement>(null);

  const getSetWidth = useCallback(() => {
    if (!firstSetRef.current || !secondSetRef.current) return 0;
    return secondSetRef.current.offsetLeft - firstSetRef.current.offsetLeft;
  }, []);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const moveToMiddleSet = () => {
      const setWidth = getSetWidth();
      if (setWidth > 0) scroller.scrollLeft = setWidth;
    };

    moveToMiddleSet();
    window.addEventListener("resize", moveToMiddleSet);
    return () => window.removeEventListener("resize", moveToMiddleSet);
  }, [getSetWidth]);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    const thirdSet = thirdSetRef.current;
    const setWidth = getSetWidth();
    if (!scroller || !thirdSet || setWidth === 0) return;

    if (scroller.scrollLeft >= thirdSet.offsetLeft - firstSetRef.current!.offsetLeft) {
      scroller.scrollLeft -= setWidth;
    } else if (scroller.scrollLeft <= 0) {
      scroller.scrollLeft += setWidth;
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <p className="m-0 text-sm leading-relaxed text-[#496473] sm:text-base">
          横にスクロールして、すべての屋台・企画をチェック
        </p>
        <span className="shrink-0 text-xs font-bold tracking-[0.12em] text-[#1f3a4a]/65" aria-hidden="true">
          SCROLL →
        </span>
      </div>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="hidden-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:gap-5 sm:px-6"
        role="region"
        aria-label="屋台・自主企画一覧"
        tabIndex={0}
      >
        {[0, 1, 2].flatMap((setIndex) => postersData.map((shop, index) => (
          <article
            key={`${setIndex}-${index}`}
            ref={index === 0 ? [firstSetRef, secondSetRef, thirdSetRef][setIndex] : undefined}
            aria-hidden={setIndex === 1 ? undefined : true}
            className="w-[min(76vw,270px)] shrink-0 snap-start overflow-hidden rounded-3xl bg-white shadow-[0_12px_32px_rgba(31,58,74,0.14)]"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#dcecf0]">
              <Image
                src={shop.images[0]}
                alt={`${shop.title}のポスター`}
                fill
                sizes="(max-width: 640px) 76vw, 270px"
                className="object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
              <span className="absolute left-3 top-3 rounded-full bg-[#1f3a4a]/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                No. {String(shop.mapId).padStart(2, "0")}
              </span>
            </div>

            <div className="flex min-h-32 flex-col p-4">
              <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#1f3a4a]">
                {shop.title}
              </h3>
              <Link
                href={`/protected/map?index=${index}&t=true`}
                tabIndex={setIndex === 1 ? undefined : -1}
                className="mt-auto inline-flex items-center gap-1.5 self-start pt-4 text-sm font-bold text-[#287c95] underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287c95]"
                aria-label={`${shop.title}をマップで見る`}
              >
                <MapPin aria-hidden="true" size={16} />
                マップで見る
              </Link>
            </div>
          </article>
        )))}
      </div>
    </div>
  );
}
