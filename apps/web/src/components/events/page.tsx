import React from 'react';

import ContentCard from "@/components/common/ContentCard";
import TopBar from "@/components/common/TopBar";
import Footer from "@/components/common/Footer";
import { shipporiMincho } from "@/components/common/fonts";

// スケジュール項目の型定義
type ScheduleItem =
  | { time: string; content: string }
  | { time: string; secondTime: string };

interface ScheduleDay {
  label: string;
  items: ScheduleItem[];
}

interface VenueSchedule {
  venue: string;
  days: ScheduleDay[];
}

const scheduleData: VenueSchedule[] = [
  {
    venue: "第一体育館",
    days: [
      {
        label: "1日目",
        items: [
          { time: "10:00〜17:00", content: "軽音学部" },
          { time: "17:00〜19:00", content: "中夜祭(カラオケ)" },
        ],
      },
      {
        label: "2日目",
        items: [
          { time: "10:00〜14:30", content: "軽音学部" },
          { time: "14:30〜17:00", content: "ダンス部" },
          { time: "17:00〜18:00", content: "後夜祭(有志発表)" },
        ],
      },
    ],
  },
  {
    venue: "第二体育館",
    days: [
      {
        label: "1日目",
        items: [
          { time: "10:00〜12:00", content: "吹奏楽部" },
          { time: "12:30〜13:30", content: "よさこい部" },
          { time: "13:30〜17:00", content: "機械技術部" },
        ],
      },
      {
        label: "2日目",
        items: [
          { time: "10:00〜12:00", content: "機械技術部" },
          { time: "12:00〜13:00", content: "よさこい部" },
          { time: "13:00〜17:00", content: "機械技術部" },
        ],
      },
    ],
  },
  {
    venue: "武道館前",
    days: [
      {
        label: "1日目",
        items: [
          { time: "10:00〜12:00" , content: "献血"},
          { time: "13:30〜16:00" , content: "献血" },
        ],
      },
    ],
  },
];

export function ScheduleTable() {
  return (
    <div className={`${shipporiMincho.className} w-full text-gray-800`}>
      <TopBar current="EVENTS" />
      <main className="w-full px-4">
        <h1 className="mb-6 whitespace-nowrap py-[0.4em] text-center text-[min(1.5rem,calc((100vw-2rem)/10))] font-bold md:text-3xl">
          イベントスケジュール
        </h1>
        <ContentCard bodyClassName="space-y-8">
          {scheduleData.map((venueSchedule) => (
            <section key={venueSchedule.venue}>
              <h2 className="mb-3 text-center text-2xl font-bold">
                {venueSchedule.venue}
              </h2>

              <div className="overflow-hidden rounded-md border-2 border-teal-700 bg-white/80">
                <h3 className="border-b-2 border-teal-700 bg-teal-100 px-3 py-2 text-center text-lg font-bold text-teal-900">
                  タイムスケジュール
                </h3>

                <div
                  className={`grid grid-cols-1 divide-y divide-gray-400 ${
                    venueSchedule.days.length > 1
                      ? "md:grid-cols-2 md:divide-x md:divide-y-0"
                      : ""
                  }`}
                >
                  {venueSchedule.days.map((day) => (
                    <div key={day.label} className="flex flex-col">
                      <div className="border-b border-gray-400 bg-gray-100 py-1.5 text-center text-lg font-semibold">
                        {day.label}
                      </div>
                      <table className="h-full w-full border-collapse">
                        <tbody>
                          {day.items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-300 last:border-b-0">
                              {"secondTime" in item ? (
                                <>
                                  <td className="w-1/2 whitespace-nowrap border-r border-gray-300 px-3 py-2 text-center text-lg">
                                    {item.time}
                                  </td>
                                  <td className="w-1/2 whitespace-nowrap px-3 py-2 text-center text-lg">
                                    {item.secondTime}
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="w-5/12 whitespace-nowrap border-r border-gray-300 px-3 py-2 text-center text-lg">
                                    {item.time}
                                  </td>
                                  <td className="w-7/12 px-3 py-2 text-center text-lg">
                                    {item.content}
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </ContentCard>
      </main>
      <Footer />
    </div>
  );
}