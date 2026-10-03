"use client";
import { MapPage } from "@/components/Maps/Index";
import * as maps from "./map-data";
import { map1, map2, map3, map4, map5 } from "./map-data";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SlideMenu from "@/components/Maps/Menu";
// import { Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
import "./style.module.css";
import Navigation from "@/components/top/Navigation";

const MAX_INDEX = 54;
export function MapPageClient({ sameOrigin }: { sameOrigin: boolean }) {
  const cache = useSearchParams().get("index") ?? undefined;
  const [fromCarousel, setFromCarousel] = useState<boolean>(
    useSearchParams().get("t") === "true",
  );
  const [index, setIndex] = useState<number | undefined>(
    cache !== undefined ? Number(cache) : undefined,
  );
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [open, onOpenChange] = useState(false);
  const [isSameOrigin, setIsSameOrigin] = useState(sameOrigin);
  console.log(sameOrigin);

  useEffect(() => {
    setIndex(cache !== undefined ? Number(cache) : undefined);
  }, [cache]);

  useEffect(() => {
    const updateDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (index === undefined) {
      onOpenChange(false);
      return;
    }

    if (index > MAX_INDEX) {
      setIndex(index - (MAX_INDEX + 1));
      return;
    }
    if (index < 0) {
      setIndex(index + (MAX_INDEX + 1));
      return;
    }

    const timer = setTimeout(
      () => {
        const matched = Object.values(maps).find((d) =>
          d.shops.some((shop) => shop.idx === index),
        );
        const id = matched?.id;
        const el = document.getElementById(id ?? "map1");
        if (!el) return;

        const isVertical = window.innerWidth < window.innerHeight;
        const rect = el.getBoundingClientRect();
        const scrollPosition =
          (window.pageYOffset || document.documentElement.scrollTop || 0) +
          rect.top;
        const OFFSET = isVertical ? (open ? 500 : 400) : 120;
        window.scrollTo({
          top: Math.max(scrollPosition - OFFSET, 0),
          behavior: "smooth",
        });
        if (!isSameOrigin || fromCarousel) {
          // Close if it's an initial load from a shared link OR from the carousel modal
          onOpenChange(false);
        }
        setIsSameOrigin(true);
        setFromCarousel(false);
      },
      isSameOrigin ? 50 : 3000,
    );

    return () => clearTimeout(timer);
  }, [index, isSameOrigin]);

  if (!width || !height) return null;

  return (
    <div className="relative w-full min-h-screen bg-no-repeat bg-[image:var(--mesh-gradient)]">
      <Navigation />
      {/* {!open && (
        <div className="w-full fixed z-50 top-16 left-0 md:top-36 md:left-6 bg-transparent pointer-events-none">
          <Button
            onClick={() => onOpenChange(!open)}
            className="ml-[48px] mt-6 mb-3 pointer-events-auto"
          >
            <Search />
            ポスター画像から企画を探す
          </Button>
        </div>
      )} */}
      <SlideMenu
        open={open}
        onOpenChange={onOpenChange}
        mode={width > height ? "left" : "top"}
        onChangeIndex={setIndex}
        index={index}
      />
      <div
        style={
          open
            ? width > height
              ? { paddingLeft: 300 }
              : { paddingTop: 450 }
            : { paddingTop: "100px" }
        }
      >
        <div
          className={`px-4 md:px-12 py-0 flex flex-col items-center gap-12 ${width > height ? "justify-center" : ""}`}
        >
          <div className="w-full max-w-[700px] rounded-2xl border border-white/35 bg-white/20 p-6 text-[var(--text-color-default)] shadow-[0_10px_28px_rgba(48,96,128,0.10)] backdrop-blur-sm">
            <h3 className="mb-4 text-center text-2xl font-extrabold text-[var(--text-color-default)]/95">
              ごみの分別にご協力ください
            </h3>
            <ul className="mb-4 list-inside list-disc space-y-2 text-left font-semibold leading-relaxed text-[var(--text-color-default)]/90">
              <li>
                ゴミ箱は、屋外マップに表示されている指定の場所に設置されています。
              </li>
              <li>
                ペットボトルは、ラベルとキャップを外し、それぞれ「燃えるごみ」として捨ててください。
              </li>
              <li>ビン・カン類も同様に、分別にご協力ください。</li>
              <li>
                その他のごみについても、ゴミ箱の表示に従って正しい分別をお願いいたします。
              </li>
            </ul>
            <p className="text-left text-sm font-medium text-[var(--text-color-default)]/75">
              詳細な分別方法については、一関市のガイドラインをご参照ください。
            </p>
            {/* <a
              href="https://www.city.ichinoseki.iwate.jp/~kouiki-gyousei/garbage/21/335/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline mt-2 inline-block"
            >
              一関市ホームページ：ごみの分け方・出し方
            </a>
            <a
              href="/一関市ゴミ分別表.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline mt-2 ml-4 inline-block"
            >
              分別方法の詳細はこちら (PDF)
            </a> */}
          </div>

          <div className="w-full max-w-[700px]">
            <h3 className="text-2xl font-bold text-center mb-4">屋外</h3>
            <span id="map1"></span>
            <MapPage
              base={map1.image}
              shops={map1.shops}
              labels={map1.labels}
              statics={map1.statics}
              currentId={index}
              w={width - (width > height ? 320 : 0)}
              long={!isSameOrigin}
            />
          </div>

          <div className="w-full max-w-[700px]">
            <h3 className="text-2xl font-bold text-center mb-4">
              管理・教育棟 1F
            </h3>
            <span id="map2"></span>
            <MapPage
              base={map2.image}
              shops={map2.shops}
              labels={map2.labels}
              statics={map2.statics}
              currentId={index}
              w={width - (width > height ? 320 : 0)}
              long={!isSameOrigin}
            />
          </div>

          <div className="w-full max-w-[700px]">
            <h3 className="text-2xl font-bold text-center mb-4">
              管理・教育棟 2F
            </h3>
            <span id="map3"></span>
            <MapPage
              base={map3.image}
              shops={map3.shops}
              labels={map3.labels}
              statics={map3.statics}
              currentId={index}
              w={width - (width > height ? 320 : 0)}
              long={!isSameOrigin}
            />
          </div>

          <div className="w-full max-w-[700px]">
            <h3 className="text-2xl font-bold text-center mb-4">
              管理・教育棟 3F
            </h3>
            <span id="map4"></span>
            <MapPage
              base={map4.image}
              shops={map4.shops}
              labels={map4.labels}
              statics={map4.statics}
              currentId={index}
              w={width - (width > height ? 320 : 0)}
              long={!isSameOrigin}
            />
          </div>

          <div className="w-full max-w-[700px]">
            <h3 className="text-2xl font-bold text-center mb-4">
              専攻科・教育棟
            </h3>
            <span id="map5"></span>
            <MapPage
              base={map5.image}
              shops={map5.shops}
              labels={map5.labels}
              statics={map5.statics}
              currentId={index}
              w={width - (width > height ? 320 : 0)}
              long={!isSameOrigin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
