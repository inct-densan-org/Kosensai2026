"use client";
import { Shop, Label, Static } from "@/type";
import { useEffect, useState, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image, { StaticImageData } from "next/image";
import { Modal } from "../Modal";
import { postersData } from "@/posters.data"
import styles from "./style.module.css";
import { BusTimetable } from "./BusTable";
import { Paperclip } from "lucide-react";

type NumberedPinProps = {
  number?: number | string;
  color?: "red" | "blue" | "green";
  force?: boolean;
  size: number;
};

export const NumberedPin: React.FC<NumberedPinProps> = ({
  number = 1,
  color = "red",
  force = false,
  size,
}) => {
  const colorCode = force
    ? "#df8500"
    : color === "blue"
      ? "#4C4CD9"
      : color === "green"
        ? "#4CD94C"
        : "#D94C4C";

  return (
    <svg
      width={force ? size / 20 : size / 26.67}
      height={force ? size / 16.67 : size / 22.22}
      viewBox="0 0 60 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`block ${force ? styles.bounce : ""}`}
    >
      {/* ピンの影 */}
      {/* <ellipse cx="30" cy="68" rx="8" ry="3" fill="#00000020"/> */}

      {/* ピン本体 */}
      <path
        d="M30 2C17.3 2 7 12.3 7 25C7 32 10 38 15 45C20 52 25 58 30 68C35 58 40 52 45 45C50 38 53 32 53 25C53 12.3 42.7 2 30 2Z"
        fill={colorCode}
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* 内側の円 */}
      <circle cx="30" cy="25" r="15" fill="#FFFFFF" opacity="0.95" />

      {/* テキスト */}
      <text
        x="30"
        y="25"
        textAnchor="middle"
        dominantBaseline="central"
        fill={colorCode}
        fontSize={
          typeof number == "number"
            ? "110%"
            : number.length == 2
              ? "80%"
              : "50%"
        }
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        {String(number)}
      </text>
    </svg>
  );
};

export function MapPage({
  base,
  shops = null,
  labels = null,
  statics = null,
  currentId = null,
  w,
  long = false,
}: {
  base: StaticImageData;
  shops?: Shop[] | null;
  labels?: Label[] | null;
  statics?: Static[] | null;
  currentId?: number | null;
  w: number;
  long?: boolean;
}) {
  const [size, setSize] = useState(0);
  const transformRef = useRef<any>(null);

  const isCurrentMap = shops?.some((shop) => shop.idx === currentId) ?? false;

  const handleCopyClick = (idx: number, title: string) => {
    const url = `${window.location.origin}/map?index=${idx}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert(`"${title}"のURLをクリップボードにコピーしました！`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        alert("URLのコピーに失敗しました。");
      });
  };

  // 初期サイズ設定
  useEffect(() => {
    const width = window.innerWidth;
    setSize(width >= 800 ? 700 : width - 100);
  }, []);

  // currentId のピンにズームしてフォーカス
  useEffect(() => {
    if (!shops || currentId === null || !transformRef.current || !size) return;

    const currentShop = shops.find((shop) => shop.idx === currentId);
    if (!currentShop) return;

    const ZOOM_SCALE = 2.8;
    const targetX = (currentShop.x / 100) * size;
    const targetY = (currentShop.y / 100) * size;
    const offsetX = size / 2 - targetX * ZOOM_SCALE;
    const offsetY = size / 2 - targetY * ZOOM_SCALE;

    // 少し待ってからズーム（例: 1秒）
    const timer = setTimeout(
      () => {
        transformRef.current.setTransform(offsetX, offsetY, ZOOM_SCALE);
      },
      long ? 3500 : 600,
    ); // 1000ms後に実行

    return () => clearTimeout(timer); // クリーンアップ
  }, [currentId, shops, size]);

  return (
    <div
      className={`bg-white/5 backdrop-blur-md overflow-hidden flex items-center justify-center mx-auto p-0 w-full aspect-square max-w-[700px] rounded-2xl shadow-lg ${isCurrentMap ? "border-yellow-300 border-4" : "border-transparent border-4"} origin-center`}
    >
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={10}
        wheel={{ step: 0.2 }}
        pinch={{ step: 0.2 }}
        ref={transformRef}
      >
        <TransformComponent>
          <div className="relative" style={{ width: size, height: size }}>
            <Image src={base} alt="構内図" fill className="object-contain" />
            {/* 企画ピン */}
            {shops &&
              shops.map((e, index) => (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    top: `${e.y}%`,
                    left: `${e.x}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Modal
                    button={
                      <NumberedPin
                        number={postersData[e.idx].mapId}
                        force={e.idx === currentId}
                        size={size}
                      />
                    }
                    title={postersData[e.idx].title}
                    titleAction={
                      <button
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent modal from closing if it does
                          handleCopyClick(e.idx, postersData[e.idx].title);
                        }}
                        className="ml-2 rounded-full border-0 bg-transparent p-1 outline-none transition-colors duration-200 hover:bg-white/20 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                        aria-label="URLをコピー"
                      >
                        <Paperclip size={16} />
                      </button>
                    }
                    ModalClass="fixed inset-0 z-[1000] top-24 left-1/2 translate-x-[-45vw] translate-y-0! w-[90vw] md:w-[60vw] md:translate-x-[-30vw] h-[400px]!  "
                    className="object-contain"
                  >
                    <div className="h-[70dvh] flex flex-col">
                      <p className="whitespace-pre-wrap grow-0">
                        {postersData[e.idx].desc}
                      </p>
                      {postersData[e.idx].images.length === 1 ? (
                        <div className="relative mb-4 h-auto aspect-[277/392] mx-auto w-auto max-w-full flex-shrink-0 grow">
                          <Image
                            src={postersData[e.idx].images[0]}
                            alt={postersData[e.idx].title}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex mt-4 space-x-2 items-center w-full h-full">
                          {postersData[e.idx].images
                            .slice(0, 2)
                            .map((img, index) => (
                              <div
                                key={index}
                                className="relative w-1/2 aspect-[277/392]"
                              >
                                <Image
                                  src={img}
                                  alt={`${postersData[e.idx].title} - image ${index + 1}`}
                                  fill
                                  className="object-contain rounded"
                                />
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </Modal>
                </div>
              ))}
            {/* 静的ピン */}
            {statics &&
              statics.map((e, idx) => (
                <div
                  key={idx}
                  className="absolute"
                  style={{
                    top: `${e.y}%`,
                    left: `${e.x}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {e.timeTable ? (
                    <Modal
                      button={
                        <NumberedPin
                          color={e.color}
                          number={e.id}
                          size={size}
                        />
                      }
                      title="バス時刻表"
                      ModalClass="fixed inset-0 z-[1000] top-12 left-1/2 translate-x-[-45vw] translate-y-0! w-[90vw] md:w-[60vw] md:translate-x-[-30vw] h-[400px]!  "
                      className="object-contain"
                    >
                      <div className="flex items-center">
                        <BusTimetable />
                      </div>
                    </Modal>
                  ) : (
                    <NumberedPin color={e.color} number={e.id} size={size} />
                  )}
                </div>
              ))}
            {/* ラベル */}
            {labels &&
              labels.map((e, idx) => (
                <div
                  key={idx}
                  className="absolute"
                  style={{
                    top: `${e.y}%`,
                    left: `${e.x}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <TEXT text={e.name} size={size} />
                </div>
              ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

function TEXT({ text, size }: { text: string; size: number }) {
  return (
    <div
      className="text-white font-bold bg-black/20 border-white/30 border"
      style={{
        fontSize: `${size / 45 - (text.length >= 8 ? 3 : 0)}px`,
        padding: `${size / 120}px`,
        borderRadius: `${size / 200}px`,
      }}
    >
      {text}
    </div>
  );
}
