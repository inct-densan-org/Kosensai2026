import Image from "next/image";
import { shipporiMincho } from "@/components/common/fonts";

// パンフレット項目の中身（左: 表紙サムネイル＋ダウンロードボタン / 右: 説明）
// - アクセスの「地図＋基本情報」と同じ 2カラムのレイアウト
// - TopSection の children として使う: <TopSection id="pamphlet" title="パンフレット" screens={0}><PamphletSection /></TopSection>
// - サムネイルは PDF の 1ページ目を画像にしたもの（public/img/top/pamphlet-thumb.png）

const PDF_SRC = "/img/top/R8_kosensai.pdf";
const PDF_FILE_NAME = "R8高専祭パンフレット.pdf";
const THUMB_SRC = "/img/top/pamphlet-thumb.png";

const INFO: { label: string; value: string }[] = [
  { label: "制作", value: "高専祭実行委員会 広報係" },
  { label: "絵", value: "3年化学･バイオ系 朝比奈佑菜さん" },
];

const INK = "text-[#1f3a4a]";
const LINE = "border-[#cfd8dc]";

export default function PamphletSection() {
  return (
    <div className={`${shipporiMincho.className} grid items-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-10 ${INK}`}>
      <div className="mx-auto w-full max-w-[360px]">
        <a href={PDF_SRC} target="_blank" rel="noopener noreferrer" className={`block overflow-hidden border ${LINE} bg-white`}>
          <Image
            src={THUMB_SRC}
            alt="第62回高専祭パンフレットの表紙"
            width={960}
            height={1362}
            sizes="(max-width: 400px) calc(100vw - 32px), 360px"
            className="block h-auto w-full"
          />
        </a>
        <a
          href={PDF_SRC}
          download={PDF_FILE_NAME}
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 border border-[#2f7f9c] bg-[#2f7f9c] px-5 text-base font-bold tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-[#2f7f9c]"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
          </svg>
          パンフレットをダウンロード（PDF）
        </a>
      </div>

      <dl className="m-0 space-y-4 text-base leading-[1.8]">
        {INFO.map((r) => (
          <div key={r.label} className="flex gap-4">
            <dt className="w-[3.2em] flex-none text-justify [text-align-last:justify]">{r.label}</dt>
            <dd className="m-0 min-w-0">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
