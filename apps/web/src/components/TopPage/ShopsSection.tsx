"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { postersData } from "@/posters.data";
import ContentCard from "@/components/common/ContentCard";

const DRAG_THRESHOLD = 5;
const WHEEL_END_DELAY = 140;

export default function ShopsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLElement>(null);
  const secondSetRef = useRef<HTMLElement>(null);
  const thirdSetRef = useRef<HTMLElement>(null);
  const dragRef = useRef({ pointerId: -1, startX: 0, startScrollLeft: 0, moved: false });
  const wheelEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isWheelScrolling, setIsWheelScrolling] = useState(false);

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

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleWheel = (event: WheelEvent) => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      event.preventDefault();
      setIsWheelScrolling(true);
      if (wheelEndTimerRef.current) clearTimeout(wheelEndTimerRef.current);

      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? scroller.clientWidth
          : 1;
      scroller.scrollLeft += event.deltaY * unit;

      wheelEndTimerRef.current = setTimeout(() => {
        setIsWheelScrolling(false);
        wheelEndTimerRef.current = null;
      }, WHEEL_END_DELAY);
    };

    scroller.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      scroller.removeEventListener("wheel", handleWheel);
      if (wheelEndTimerRef.current) clearTimeout(wheelEndTimerRef.current);
    };
  }, []);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    const thirdSet = thirdSetRef.current;
    const setWidth = getSetWidth();
    if (!scroller || !thirdSet || setWidth === 0) return;

    if (scroller.scrollLeft >= thirdSet.offsetLeft - firstSetRef.current!.offsetLeft) {
      scroller.scrollLeft -= setWidth;
      if (dragRef.current.pointerId !== -1) {
        dragRef.current.startScrollLeft -= setWidth;
      }
    } else if (scroller.scrollLeft <= 0) {
      scroller.scrollLeft += setWidth;
      if (dragRef.current.pointerId !== -1) {
        dragRef.current.startScrollLeft += setWidth;
      }
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: scroller.scrollLeft,
      moved: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller || dragRef.current.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragRef.current.startX;
    if (Math.abs(deltaX) < DRAG_THRESHOLD && !dragRef.current.moved) return;

    if (!dragRef.current.moved) {
      dragRef.current.moved = true;
      scroller.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }
    scroller.scrollLeft = dragRef.current.startScrollLeft - deltaX;
  };

  const finishDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!scroller || dragRef.current.pointerId !== event.pointerId) return;

    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
    dragRef.current.pointerId = -1;
    setIsDragging(false);
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  };

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <p className="m-0 text-sm leading-relaxed text-[#496473] sm:text-base">
          横にスワイプ、PCではホイール・ドラッグして、すべての屋台・企画をチェック
        </p>
        <span className="shrink-0 text-xs font-bold tracking-[0.12em] text-[#1f3a4a]/65" aria-hidden="true">
          SCROLL →
        </span>
      </div>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDragging}
        onPointerCancel={finishDragging}
        onClickCapture={handleClickCapture}
        onDragStart={(event) => event.preventDefault()}
        className={`hidden-scrollbar -mx-4 flex gap-4 overflow-x-auto overscroll-x-contain px-4 pb-4 select-none sm:-mx-6 sm:gap-5 sm:px-6 ${isDragging || isWheelScrolling ? "snap-none" : "snap-x snap-mandatory"} ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        role="region"
        aria-label="屋台・自主企画一覧"
        tabIndex={0}
      >
        {[0, 1, 2].flatMap((setIndex) => postersData.map((shop, index) => (
          <article
            key={`${setIndex}-${index}`}
            ref={index === 0 ? [firstSetRef, secondSetRef, thirdSetRef][setIndex] : undefined}
            aria-hidden={setIndex === 1 ? undefined : true}
            className="group relative w-[min(76vw,270px)] shrink-0 snap-start sm:w-[320px] lg:w-[340px]"
          >
            <Link
              href={`/shops/${index}/detail`}
              tabIndex={setIndex === 1 ? undefined : -1}
              className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287c95]"
              aria-label={`${shop.title}の詳細を見る`}
            >
              <span className="sr-only">{shop.title}の詳細を見る</span>
            </Link>

            <ContentCard className="pointer-events-none relative z-20 h-full rounded-3xl" bodyClassName="flex h-full flex-col p-0 md:p-0">
              <div className="relative aspect-[3/4] shrink-0 overflow-hidden bg-[#dcecf0]">
                {shop.images?.[0] ? (
                  <Image
                    src={shop.images[0]}
                    alt={`${shop.title}のポスター`}
                    fill
                    sizes="(max-width: 640px) 76vw, (max-width: 1024px) 320px, 340px"
                    draggable={false}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-bold text-[#496473]">
                    No Image
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-[#1f3a4a]/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  No. {String(shop.mapId).padStart(2, "0")}
                </span>
              </div>

              <div className="flex min-h-36 flex-1 flex-col p-5 md:p-6">
                <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#1f3a4a]">
                  {shop.title}
                </h3>
                <Link
                  href={`/protected/map?index=${index}&t=true`}
                  tabIndex={setIndex === 1 ? undefined : -1}
                  className="pointer-events-auto relative z-20 mt-auto inline-flex items-center gap-1.5 self-start pt-4 text-sm font-bold text-[#287c95] underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287c95]"
                  aria-label={`${shop.title}をマップで見る`}
                >
                  <MapPin aria-hidden="true" size={16} />
                  マップで見る
                </Link>
              </div>
            </ContentCard>
          </article>
        )))}
      </div>
    </div>
  );
}
