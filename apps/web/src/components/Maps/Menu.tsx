"use client";
import { motion } from "framer-motion";
import { postersData } from "@/posters.data";
import { useMemo } from "react";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";

type SlideMenuProps = {
  mode?: "top" | "left";
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onChangeIndex: (value: number) => void;
  children?: React.ReactNode;
  index?: number;
};

export default function SlideMenu({
  mode,
  open,
  onOpenChange,
  onChangeIndex,
  index = 0,
}: SlideMenuProps) {
  const isTop = mode === "top";
  const posters = useMemo(
    () =>
      postersData.map((e, index) => ({
        id: index,
        title: e.title,
        desc: e.desc,
        images: e.images && e.images.length > 0 ? e.images : [],
      })),
    [],
  );

  return (
    <motion.div
      initial={false}
      animate={
        isTop
          ? { y: open ? 0 : "-100%" } // 上から開閉
          : { x: open ? 0 : "-100%" } // 左から開閉
      }
      transition={{ type: "tween", duration: 0.3 }}
      className={`fixed bg-white/90 backdrop-blur-md shadow-2xl z-[300] p-4 flex flex-col pointer-events-auto top-0 left-0 ${isTop ? "w-full text-center" : "flex flex-row justify-end"}`}
      style={isTop ? { height: 380 } : { width: 300 }}
    >
      {open && (
        <div
          style={isTop ? { height: 380, marginTop: -180 } : { width: 300 }}
          className="px-5"
        >
          {/*{isTop ? (
            <PosterCarouselSP
              posters={posters}
              onChangeIndex={onChangeIndex}
              initialIndex={index}
              disable
            />
          ) : (
            <div className="translate-x-[0%] w-[220px]">
              <PosterCarousel
                posters={posters}
                onSelectedIndexChange={onChangeIndex}
                initialIndex={index}
                size={200}
              />
            </div>
          )}*/}
        </div>
      )}
      <div className="flex items-end w-full h-full justify-center">
        <Button
          onClick={() => onOpenChange(false)}
          className={`px-3 py-2 rounded ml-2 ${isTop ? "" : "aspect-square mt-3 ml-0"}`}
          variant="outline"
        >
          {isTop ? "閉じる" : <XIcon />}
        </Button>
      </div>
    </motion.div>
  );
}
