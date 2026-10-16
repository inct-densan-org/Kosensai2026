
"use client";
 
import { useEffect, useRef, useState } from "react";
import ContentCard from "@/components/common/ContentCard";
import Card from "@/components/common/WhiteCard";
import { notoSansJP, shipporiMincho } from "@/components/common/fonts";
 
// このセクション全体のフォント（ここ1か所で切り替え）。
// 見出し「アクセス」と同じ明朝に統一。サイト本文のフォントにしたいときは "" にする。
const FONT_CLASS: string = shipporiMincho.className;
 
// アクセス項目の中身（地図＋基本情報 / 無料送迎バス / 列車時刻表 / 雨天時）
// - TopSection の children として使う: <TopSection id="access" title="アクセス" screens={0}><AccessSection /></TopSection>
// - 当日（2026/10/24・25）は現在時刻（日本時間）から「NEXT」と過ぎた便の薄表示を出す。
//   それ以外の日は時刻表だけを表示する。確認用に URL に ?now=13:20 を付けるとその時刻で表示できる。
// - 色（#1f3a4a / #2f7f9c など）は仮の値。サイトの配色に合わせて調整してください。
 
/* ───────── データ ───────── */
 
type Trip = readonly [dep: string, arr: string];
 
// 無料送迎バス（17:05→17:20 の便は掲載しない）
const BUS_GO: Trip[] = [["10:25", "10:40"], ["11:15", "11:30"], ["12:05", "12:20"], ["12:55", "13:10"], ["14:35", "14:50"], ["15:25", "15:40"], ["16:15", "16:30"]];
const BUS_BACK: Trip[] = [["10:00", "10:15"], ["10:50", "11:05"], ["11:40", "11:55"], ["12:30", "12:45"], ["14:10", "14:25"], ["15:00", "15:15"], ["15:50", "16:05"], ["16:45", "17:00"]];
 
// 列車（一ノ関駅発・土曜休日ダイヤ・10:00〜17:59発）。"時刻|備考"
type LineId = "up" | "down" | "ofu";
const LINES: { id: LineId; tab: string; title: string; sub: string; times: string[]; footnote?: string }[] = [
  { id: "up", tab: "上り（仙台方面）", title: "東北本線 上り", sub: "小牛田・仙台方面", times: ["10:39", "12:44", "13:50", "14:41", "15:51", "16:39", "17:42"] },
  { id: "down", tab: "下り（盛岡方面）", title: "東北本線 下り", sub: "花巻・盛岡方面", times: ["10:15", "11:30", "12:46", "13:45", "14:42", "15:44", "16:27", "17:20"] },
  { id: "ofu", tab: "大船渡線", title: "大船渡線", sub: "気仙沼方面", times: ["10:16", "11:00|全車指定席", "12:45", "14:39", "16:36"], footnote: "※11:00発は快速「ポケモントレイン気仙沼号」で、全車指定席です（指定席料金が必要）。" },
];
 
/* ───────── 時刻まわりの補助 ───────── */
 
const toMin = (s: string) => {
  const [h, m] = s.split(":");
  return parseInt(h, 10) * 60 + parseInt(m, 10);
};
 
function remainText(left: number) {
  if (left <= 0) return "まもなく発車";
  if (left >= 60) return `あと${Math.floor(left / 60)}時間${left % 60 ? `${left % 60}分` : ""}`;
  return `あと${left}分`;
}
 
// 現在時刻（分）。開催日以外は null（= 強調表示なし）。初回描画は null でサーバーと一致させる。
function useNowMinutes(): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const calc = (): number | null => {
      const q = new URLSearchParams(window.location.search).get("now");
      if (q && /^\d{1,2}:\d{2}$/.test(q)) return toMin(q);
      const jst = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
      const day = `${jst.getMonth() + 1}/${jst.getDate()}`;
      if (jst.getFullYear() === 2026 && (day === "10/24" || day === "10/25")) return jst.getHours() * 60 + jst.getMinutes();
      return null;
    };
    setNow(calc());
    const id = setInterval(() => setNow(calc()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}
 
type Status = "normal" | "next" | "past";
function statusOf(i: number, nextIdx: number, live: boolean): Status {
  if (!live) return "normal";
  if (i === nextIdx) return "next";
  if (nextIdx === -1 || i < nextIdx) return "past";
  return "normal";
}
const findNext = (mins: number[], now: number | null) => (now === null ? -1 : mins.findIndex((m) => m >= now));
 
/* ───────── 見た目の共通部品 ───────── */
 
const INK = "text-[#1f3a4a]";
const LINE = "border-[#cfd8dc]";
 
 
function Tag({ children }: { children: React.ReactNode }) {
  return <span className="inline-block border border-[#8a9aa3] bg-white px-2 text-[11px] font-bold leading-[1.6] tracking-[0.14em] text-[#1f3a4a]">{children}</span>;
}
 
function CardTitle({ icon, label, tag, title }: { icon: React.ReactNode; label: string; tag?: string; title: string }) {
  return (
    <>
      <div className="mb-1 flex items-center gap-2.5">
        <span className="flex items-center gap-2 text-[13px] font-medium tracking-[0.1em] text-[#51636d]">{icon}{label}</span>
        {tag && <Tag>{tag}</Tag>}
      </div>
      <h3 className={`m-0 mb-3.5 text-xl font-bold tracking-[0.04em] ${INK}`}>{title}</h3>
    </>
  );
}
 
// NEXT：色の面ではなく、太字＋水色の下線で目立たせる
function NextBox({ dep, note }: { dep: string; note: string }) {
  return (
    <div className={`mb-3.5 flex flex-wrap items-baseline gap-x-3 border-b ${LINE} pb-2`}>
      <span className="text-xs font-extrabold tracking-[0.16em] text-[#2f7f9c]">NEXT</span>
      <span className={`border-b-[5px] border-[#2f7f9c] text-5xl font-extrabold leading-[1.1] tracking-tighter tabular-nums ${INK}`}>{dep}</span>
      <span className={`text-[15px] font-extrabold ${INK}`}>{note}</span>
    </div>
  );
}
 
const Svg = ({ children }: { children: React.ReactNode }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
 
/* ───────── ① 地図 ───────── */
 
const SCHOOL = "一関工業高等専門学校";
// 地図の埋め込み元。既定は APIキー不要の Googleマップ埋め込み（学校名で検索した地図）
// 差し替えたい場合は .env.local に設定（設定後は開発サーバーを再起動）
// A) NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL … Googleマップの「共有 → 地図を埋め込む」で出る iframe の src="…" の中身
// B) NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY … Maps Embed API のキー
const MAP_EMBED_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;
const MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
const MAP_SRC: string =
  MAP_EMBED_URL ||
  (MAP_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${MAP_KEY}&q=${encodeURIComponent(SCHOOL)}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(SCHOOL)}&hl=ja&z=15&output=embed`);
 
// 左に地図、右に基本情報（住所・電車・自動車・バス）の2列。狭い画面では縦に積む。
const INFO: { label: string; value: string }[] = [
  { label: "住所", value: "〒021-8511 岩手県一関市萩荘字高梨" },
  { label: "電車", value: "一ノ関駅（JR東北新幹線、JR東北本線、JR大船渡線）" },
  { label: "自動車", value: "一関インターチェンジより10分" },
  { label: "バス", value: "高専祭用無料送迎バスが運行中。下記時刻表を参照" },
];
 
function MapAndInfo() {
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SCHOOL)}`;
  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-10">
      <div>
        <div className={`aspect-[7/5] w-full overflow-hidden border ${LINE} bg-white`}>
          <iframe
            title={`${SCHOOL}の地図`}
            src={MAP_SRC}
            className="block size-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <a href={openUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-bold text-[#2f7f9c] underline underline-offset-4">
          Googleマップで開く ↗
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
 
/* ───────── ② 無料送迎バス（イベントのタイムスケジュールと同じ見た目） ───────── */

type BusDir = "go" | "back";
const BUS_DIRS: { id: BusDir; tab: string; from: string; to: string; trips: Trip[] }[] = [
  { id: "go", tab: "行き", from: "一ノ関駅", to: "一関高専", trips: BUS_GO },
  { id: "back", tab: "帰り", from: "一関高専", to: "一ノ関駅", trips: BUS_BACK },
];

function BusList({ dir, now }: { dir: (typeof BUS_DIRS)[number]; now: number | null }) {
  const live = now !== null;
  const nextIdx = findNext(dir.trips.map((t) => toMin(t[0])), now);
  const next = nextIdx >= 0 ? dir.trips[nextIdx] : null;

  return (
    <section>
      <h2 className="mb-3 text-xl font-bold md:pl-8 md:text-2xl">
        {dir.from} <span aria-hidden="true">→</span>
        <span className="sr-only">から</span> {dir.to}
      </h2>

      {live && (
        <div className="md:pl-8">
          <NextBox dep={next ? next[0] : "終了"} note={next ? `${remainText(toMin(next[0]) - now)}・${next[1]} 着` : "本日の運行は終了しました"} />
        </div>
      )}

      {/* 時刻の区切り線: イベントのタイムスケジュールと同じグレー（不透明度70%） */}
      <ul className="divide-y divide-gray-400/70 border-y border-gray-400/70 text-base md:text-lg">
        {dir.trips.map((t, i) => {
          const st = statusOf(i, nextIdx, live);
          const last = i === dir.trips.length - 1;
          return (
            <li
              key={t[0]}
              className={`flex md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-2 ${st === "past" ? "opacity-40" : ""} ${st === "next" ? "font-bold text-[#2f7f9c]" : ""}`}
            >
              <span className="w-28 shrink-0 whitespace-nowrap px-2 py-3 tabular-nums sm:w-36 md:w-auto md:px-0 md:pl-8">{t[0]} 発</span>
              <span className="flex-1 px-2 py-3 tabular-nums md:px-0 md:text-center">{t[1]} 着</span>
              <span className={`${last || st === "next" ? "" : "hidden md:block"} whitespace-nowrap px-2 py-3 text-sm md:justify-self-end md:pr-8`}>
                {st === "next" ? "NEXT" : last ? "最終" : ""}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function BusCard({ now }: { now: number | null }) {
  return (
    <Card className="p-4 md:p-8">
      <BusScheduleContent now={now} />
    </Card>
  );
}

function BusScheduleContent({ now }: { now: number | null }) {
  const [dirId, setDirId] = useState<BusDir>("go");

  return (
    <>
      <CardTitle icon={<Svg><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>} label="2026/10/24 – 25" title="無料送迎バス" />

      {/* 行き・帰りの切り替え: イベントの日にち切り替えと同じ、文字だけのボタン＋選択中の下線 */}
      <div
        role="tablist"
        aria-label="行き・帰りを選択"
        className={`${notoSansJP.className} mb-5 flex justify-center gap-10 text-xl font-bold md:mb-6 md:text-2xl`}
      >
        {BUS_DIRS.map((d) => {
          const isSelected = d.id === dirId;
          return (
            <button
              key={d.id}
              type="button"
              role="tab"
              id={`bus-tab-${d.id}`}
              aria-selected={isSelected}
              aria-controls={`bus-panel-${d.id}`}
              onClick={() => setDirId(d.id)}
              className={`rounded-none border-b-2 bg-transparent px-0 pt-0 pb-1 transition-colors ${
                isSelected
                  ? "border-[#1f3a4a] text-[#1f3a4a]"
                  : "border-transparent text-[#1f3a4a]/50 hover:text-[#1f3a4a]/80"
              }`}
            >
              {d.tab}
            </button>
          );
        })}
      </div>

      {/* 行き・帰りを同じグリッドセルに重ね、切り替えてもカードの高さが変わらないようにする */}
      <div className="grid">
        {BUS_DIRS.map((d) => {
          const isSelected = d.id === dirId;
          return (
            <div
              key={d.id}
              id={`bus-panel-${d.id}`}
              role="tabpanel"
              aria-labelledby={`bus-tab-${d.id}`}
              aria-hidden={!isSelected}
              className={`col-start-1 row-start-1 self-start ${isSelected ? "" : "invisible"}`}
            >
              <BusList dir={d} now={now} />
            </div>
          );
        })}
      </div>
    </>
  );
}

// マップページのモーダル用（トップページの BusCard とは別のカードで表示する）
export function BusScheduleCard() {
  const now = useNowMinutes();
  return (
    <ContentCard className={`${notoSansJP.className} ${INK}`} bodyClassName="!p-5">
      <BusScheduleContent now={now} />
    </ContentCard>
  );
}
 
/* ───────── ③ 列車時刻表（路線タブ） ───────── */
 
function TrainCard({ now }: { now: number | null }) {
  const [lineId, setLineId] = useState<LineId>("up");
  const line = LINES.find((l) => l.id === lineId) ?? LINES[0];
  const live = now !== null;
  const items = line.times.map((s) => {
    const [t, note = ""] = s.split("|");
    return { t, note, m: toMin(t) };
  });
  const nextIdx = findNext(items.map((i) => i.m), now);
  const next = nextIdx >= 0 ? items[nextIdx] : null;
 
  // 一覧はこの枠の中だけスクロール。路線を切り替えたとき・開催日に表示したときは、次の便の位置へ移動する
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = listRef.current;
    if (!box) return;
    const target = box.querySelector<HTMLElement>('[data-next="true"]');
    box.scrollTop = target ? Math.max(0, target.offsetTop - 8) : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId, live]);
 
  // 時（hour）ごとにまとめる
  const groups: { hour: number; chips: { idx: number; mm: string; note: string }[] }[] = [];
  items.forEach((it, idx) => {
    const hour = Math.floor(it.m / 60);
    let g = groups[groups.length - 1];
    if (!g || g.hour !== hour) {
      g = { hour, chips: [] };
      groups.push(g);
    }
    g.chips.push({ idx, mm: String(it.m % 60).padStart(2, "0"), note: it.note });
  });
 
  return (
    <Card className="p-5">
      <CardTitle icon={<Svg><rect x="5" y="3" width="14" height="14" rx="3" /><path d="M5 11h14M8 21l2-4M16 21l-2-4" /></Svg>} label="一ノ関駅発" tag="JR" title="列車時刻表" />
 
      <div role="tablist" aria-label="路線と方向" className="flex flex-wrap">
        {LINES.map((l) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={l.id === lineId}
            onClick={() => setLineId(l.id)}
            className={`mb-2 mr-2 min-h-11 border px-[18px] text-sm font-bold tracking-[0.08em] ${l.id === lineId ? "border-[#2f7f9c] bg-[#2f7f9c] text-white" : "border-[#8a9aa3] bg-white text-[#1f3a4a] hover:border-[#2f7f9c]"}`}
          >
            {l.tab}
          </button>
        ))}
      </div>
 
      <div className="mb-2.5 mt-0.5 text-sm tracking-[0.04em] text-[#51636d]"><b className={INK}>{line.title}</b>({line.sub})</div>
 
      {live && <NextBox dep={next ? next.t : "終了"} note={next ? `${remainText(next.m - now)}${next.note ? `・${next.note}` : ""}` : "本日の運行は終了しました"} />}
 
      <div
        ref={listRef}
        tabIndex={0}
        role="region"
        aria-label={`${line.title}の時刻表（上下にスクロールできます）`}
        className={`relative max-h-[320px] overflow-y-auto overscroll-contain border-b ${LINE}`}
      >
      <div className="flex flex-wrap">
        {groups.map((g) => (
          <div key={g.hour} className="flex w-full items-start border-t border-[#e3e9ec] pr-1.5 pt-1.5">
            <div className="w-[58px] flex-none text-[28px] font-extrabold leading-[44px] tracking-tight">
              {g.hour}<small className="ml-px text-xs font-medium tracking-normal text-[#51636d]">時</small>
            </div>
            <div className="flex flex-1 flex-wrap">
              {g.chips.map((c) => {
                const st = statusOf(c.idx, nextIdx, live);
                return (
                  <span
                    key={c.idx}
                    data-next={st === "next" ? "true" : undefined}
                    className={`mb-1.5 mr-1.5 inline-flex min-h-11 items-baseline gap-1.5 px-2.5 py-1 text-[28px] leading-[1.3] tracking-tight tabular-nums ${st === "next" ? "border-b-4 border-[#2f7f9c] font-extrabold" : "font-bold"} ${st === "past" ? "opacity-40" : ""}`}
                  >
                    {c.mm}
                    {c.note && <span className={`text-xs tracking-normal ${st === "next" ? "font-extrabold" : "font-bold text-[#51636d]"}`}>{c.note}</span>}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      </div>
 
      {line.footnote &&<p className="m-0 mt-1.5 text-xs leading-[1.7] text-[#51636d]">{line.footnote}</p>}
    </Card>
  );
}
 
/* ───────── ④ 雨天時 ───────── */
 
function RainCard() {
  return (
    <ContentCard className={notoSansJP.className}>
      <CardTitle icon={<Svg><path d="M3 12a9 9 0 0 1 18 0z" /><path d="M12 12v6a2 2 0 0 1-4 0" /></Svg>} label="RAIN" tag="NOTICE" title="雨天時の対応" />
      <p className="m-0 -mt-2.5 text-sm leading-[1.8]">雨天時も高専祭は開催されますが、一部の屋外企画が変更または中止になる場合があります。詳細は当サイトまたは公式SNSでご確認ください。</p>
    </ContentCard>
  );
}
 
/* ───────── 本体 ───────── */
 
export default function AccessSection() {
  const now = useNowMinutes();
  return (
    <div className={`${FONT_CLASS} flex flex-col gap-8 ${INK}`}>
      <MapAndInfo />
      {/* バスと列車を横にスライドさせたい場合は、この2枚を overflow-x-auto + snap-x の枠に入れる */}
      <BusCard now={now} />
      <TrainCard now={now} />
      <RainCard />
    </div>
  );
}
