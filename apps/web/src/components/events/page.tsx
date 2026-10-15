"use client";

import { useState } from "react";
import Link from "next/link";

import ContentCard from "@/components/common/ContentCard";
import WhiteCard from "@/components/common/WhiteCard";
import { notoSansJP } from "@/components/common/fonts";

// スケジュール項目の型定義（shopId があれば /shops/{shopId}/detail に遷移する）
interface ScheduleItem {
  time: string;
  content: string;
  shopId?: number;
  // 注意事項。指定するとイベント名の右上に赤い「※」を付け、カード下部に内容を表示する
  note?: string;
}

interface VenueSchedule {
  venue: string;
  // 日にちのラベル（DAYS の値）ごとの項目
  days: Partial<Record<Day, ScheduleItem[]>>;
}

const DAYS = ["1日目", "2日目"] as const;
type Day = (typeof DAYS)[number];

// 屋台番号: 53 よさこい部 / 54 軽音学部 / 55 機械技術部 / 56 ダンス部 / 57 吹奏楽部
const scheduleData: VenueSchedule[] = [
  {
    venue: "第一体育館",
    days: {
      "1日目": [
        { time: "10:00〜17:00", content: "軽音学部", shopId: 54 },
        { time: "17:00〜19:00", content: "中夜祭(カラオケ)", note: "※17時以降は、本校学生以外はご参加いただけません。" },
      ],
      "2日目": [
        { time: "10:00〜14:30", content: "軽音学部", shopId: 54 },
        { time: "14:30〜17:00", content: "ダンス部", shopId: 56 },
        { time: "17:00〜18:00", content: "後夜祭(有志発表)" },
      ],
    },
  },
  {
    venue: "第二体育館",
    days: {
      "1日目": [
        { time: "10:00〜12:00", content: "吹奏楽部", shopId: 57 },
        { time: "12:30〜13:30", content: "よさこい部", shopId: 53 },
        { time: "13:30〜17:00", content: "機械技術部", shopId: 55 },
      ],
      "2日目": [
        { time: "10:00〜12:00", content: "機械技術部", shopId: 55 },
        { time: "12:00〜13:00", content: "よさこい部", shopId: 53 },
        { time: "13:00〜17:00", content: "機械技術部", shopId: 55 },
      ],
    },
  },
  {
    venue: "武道館前",
    days: {
      "1日目": [
        { time: "10:00〜12:00", content: "献血" },
        { time: "13:30〜16:00", content: "献血" },
      ],
    },
  },
];

function ScheduleRow({ item }: { item: ScheduleItem }) {
  // スマホ: 時刻（固定幅）とイベント名を左から並べる
  // md 以上: 左右の列を同じ幅（1fr）にし、イベント名を中央の列に置くことでカード（画面）の中央に揃える
  const rowClassName = "flex md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-2";
  const cells = (
    <>
      <span className="w-36 shrink-0 whitespace-nowrap px-2 py-3 tabular-nums sm:w-44 md:w-auto md:px-0 md:pl-8">
        {item.time}
      </span>
      <span className="flex-1 px-2 py-3 md:px-0 md:text-center">
        {item.content}
        {item.note && (
          <span aria-hidden className="align-super text-[20px] leading-none text-red-600">
            ※
          </span>
        )}
      </span>
      <span className={`${item.shopId === undefined ? "hidden md:block" : ""} px-2 py-3 md:justify-self-end`}>
        {item.shopId !== undefined && <span aria-hidden>›</span>}
      </span>
    </>
  );

  if (item.shopId === undefined) {
    return <li className={rowClassName}>{cells}</li>;
  }

  return (
    <li>
      <Link
        href={`/shops/${item.shopId}/detail`}
        className={`${rowClassName} transition-colors hover:bg-white/60 focus-visible:bg-white/60 focus-visible:outline-none`}
      >
        {cells}
      </Link>
    </li>
  );
}

// 注意事項の一覧（同じ内容は 1 回だけ表示する）
const notes = [
  ...new Set(
    scheduleData.flatMap((venue) =>
      Object.values(venue.days).flatMap((items) => items?.flatMap((item) => (item.note ? [item.note] : [])) ?? []),
    ),
  ),
];

function VenueList({ day }: { day: Day }) {
  const venues = scheduleData.filter((venue) => venue.days[day]?.length);

  return (
    <div className="space-y-10">
      {venues.map((venue) => (
        <section key={venue.venue}>
          <h2 className="mb-3 text-xl font-bold md:pl-8 md:text-2xl">{venue.venue}</h2>
          {/* 時刻の区切り線: グレー。WhiteCard の背景（白・不透明度70%）に合わせて不透明度70%にする */}
          <ul className="divide-y divide-gray-400/70 border-y border-gray-400/70 text-base md:text-lg">
            {venue.days[day]?.map((item) => (
              <ScheduleRow key={`${item.time}-${item.content}`} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function ScheduleTable() {
  const [selectedDay, setSelectedDay] = useState<Day>(DAYS[0]);

  return (
    <ContentCard bodyClassName="space-y-5 md:space-y-6">
      {/* 日にちの切り替え: 文字だけのボタン。選択中の日は濃い文字と下線で示す */}
      {/* globals.css の button 既定値（背景色・余白・角丸）を打ち消す */}
      <div
        role="tablist"
        aria-label="日にちを選択"
        className={`${notoSansJP.className} flex justify-center gap-10 text-xl font-bold md:text-2xl`}
      >
        {DAYS.map((day) => {
          const isSelected = day === selectedDay;
          return (
            <button
              key={day}
              type="button"
              role="tab"
              id={`events-tab-${day}`}
              aria-selected={isSelected}
              aria-controls={`events-panel-${day}`}
              onClick={() => setSelectedDay(day)}
              className={`rounded-none border-b-2 bg-transparent px-0 pt-0 pb-1 transition-colors ${
                isSelected
                  ? "border-[#1f3a4a] text-[#1f3a4a]"
                  : "border-transparent text-[#1f3a4a]/50 hover:text-[#1f3a4a]/80"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <WhiteCard className="p-4 text-[#1f3a4a] md:p-8">
        {/* 全日程を同じグリッドセルに重ねて描画し、非選択の日は隠す。
            高さは一番長い日に揃うため、日にちを切り替えてもカード（ページ）の長さが変わらない。
            短い日は self-center で上下中央に置く */}
        <div className="grid">
          {DAYS.map((day) => {
            const isSelected = day === selectedDay;
            return (
              <div
                key={day}
                id={`events-panel-${day}`}
                role="tabpanel"
                aria-labelledby={`events-tab-${day}`}
                aria-hidden={!isSelected}
                className={`col-start-1 row-start-1 self-center ${isSelected ? "" : "invisible"}`}
              >
                <VenueList day={day} />
              </div>
            );
          })}
        </div>
      </WhiteCard>

      {notes.length > 0 && (
        <ul className={`${notoSansJP.className} space-y-1 text-sm text-red-600 md:text-base`}>
          {notes.map((note) => (
            <li key={note} className="flex gap-1">
              <span className="shrink-0">※</span>
              {note}
            </li>
          ))}
        </ul>
      )}
    </ContentCard>
  );
}
