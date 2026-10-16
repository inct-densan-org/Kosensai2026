// スケジュール項目の型定義（shopId があればマップの該当ピン（/map?mapId={shopId}&t=true）に遷移する）
export interface ScheduleItem {
  time: string;
  content: string;
  shopId?: number;
  // 注意事項。指定するとイベント名の右上に赤い「※」を付け、カード下部に内容を表示する
  note?: string;
}

export interface VenueSchedule {
  venue: string;
  // 日にちのラベル（DAYS の値）ごとの項目
  days: Partial<Record<Day, ScheduleItem[]>>;
}

export const DAYS = ["1日目", "2日目"] as const;
export type Day = (typeof DAYS)[number];

// 屋台番号: 53 よさこい部 / 54 軽音学部 / 55 機械技術部 / 56 ダンス部 / 57 吹奏楽部 / 58 献血
export const scheduleData: VenueSchedule[] = [
  {
    venue: "第一体育館",
    days: {
      "1日目": [
        { time: "10:00〜17:00", content: "軽音学部", shopId: 54 },
        { time: "17:00〜19:00", content: "中夜祭(カラオケ)", note: "17時以降は、本校学生以外はご参加いただけません。" },
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
        { time: "10:00〜12:00", content: "献血", shopId: 58 },
        { time: "13:30〜16:00", content: "献血", shopId: 58 },
      ],
    },
  },
];

// 注意事項の一覧（同じ内容は 1 回だけ表示する）
export const notes = [
  ...new Set(
    scheduleData.flatMap((venue) =>
      Object.values(venue.days).flatMap((items) => items?.flatMap((item) => (item.note ? [item.note] : [])) ?? []),
    ),
  ),
];
