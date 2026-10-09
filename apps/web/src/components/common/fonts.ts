import { Shippori_Mincho_B1 } from "next/font/google";

// しっぽり明朝 B1 Bold（ヒーロー・トップバーで共用）
// subsets は先読みする文字の範囲。日本語の文字は表示時に必要な分だけ読み込まれる
export const shipporiMincho = Shippori_Mincho_B1({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});
