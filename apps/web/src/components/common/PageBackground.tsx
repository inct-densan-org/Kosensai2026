"use client";

import { motion } from "motion/react";
import type { StaticImageData } from "next/image";
import background1 from "@public/img/unit/background_1.png";
import background2 from "@public/img/unit/background_2.png";
import background3 from "@public/img/unit/background_3.png";
import background4 from "@public/img/unit/background_4.png";
import background5 from "@public/img/unit/background_5.png";
import background6 from "@public/img/unit/background_6.png";
import background7 from "@public/img/unit/background_7.png";
import RainRipples from "./RainRipples";

// ページ背景の装飾（background_1〜7 の画像を散らして配置する）
// - 親要素に relative と isolate を付けて使う（isolate がないと -z-10 が親の外まで沈む）
// - 画像は 1→7 の順に上から下へ並べ、色がグラデーションのように移り変わるようにする
// - top はページ全体の高さに対する割合なので、ページの長さが違っても同じ流れになる
// - 画面に入ったら上から下へ降りながらフェードインする（一度表示したらそのまま）
// - 一関市が雨のときは、画像より手前に雨の波紋を重ねる（RainRipples）

// フェードイン後の不透明度と、降りてくる距離
const OPACITY = 0.8;
const DROP_DISTANCE = -128;

type BackgroundPiece = {
  image: StaticImageData;
  top: string;
  left: string;
  size: string;
  rotate: number;
};

const PIECES: BackgroundPiece[] = [
  { image: background1, top: "-2%", left: "-14%", size: "clamp(300px, 58vw, 860px)", rotate: -12 },
  { image: background2, top: "11%", left: "46%", size: "clamp(260px, 50vw, 760px)", rotate: 21 },
  { image: background3, top: "25%", left: "-8%", size: "clamp(320px, 64vw, 920px)", rotate: -28 },
  { image: background4, top: "39%", left: "38%", size: "clamp(280px, 56vw, 820px)", rotate: 9 },
  { image: background5, top: "53%", left: "-18%", size: "clamp(260px, 48vw, 720px)", rotate: 34 },
  { image: background6, top: "66%", left: "42%", size: "clamp(320px, 66vw, 960px)", rotate: -17 },
  { image: background7, top: "80%", left: "2%", size: "clamp(300px, 60vw, 880px)", rotate: 26 },
];

export default function PageBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {PIECES.map((piece) => (
        <motion.img
          key={piece.image.src}
          src={piece.image.src}
          alt=""
          className="absolute aspect-square object-cover select-none"
          style={{ top: piece.top, left: piece.left, width: piece.size, rotate: piece.rotate }}
          initial={{ opacity: 0, y: -DROP_DISTANCE }}
          whileInView={{ opacity: OPACITY, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
      <RainRipples />
    </div>
  );
}
