import React, { useEffect, useState } from "react";

const times = [
  "9:00",
  "10:10",
  "11:00",
  "12:15",
  "13:30",
  "14:15",
  "15:15",
  "16:05",
  "16:45",
];
export function BusTimetable() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30 * 1000);
    return () => clearInterval(timer);
  }, []);

  // "HH:MM" → 今日の日付のDateオブジェクトに変換
  function toDate(timeStr: string): Date {
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }

  const nextIndex = times.findIndex((t) => toDate(t) > currentTime);
  const nextBusTime = nextIndex >= 0 ? toDate(times[nextIndex]) : null;

  const minutesUntilNext = nextBusTime
    ? Math.round((nextBusTime.getTime() - currentTime.getTime()) / 60000)
    : null;

  return (
    <div className="p-4 w-full h-full flex-col text-white">
      <div className="mt-3 text-sm text-white/70 text-right">
        現在時刻：{currentTime.toTimeString().slice(0, 5)}
      </div>
      一ノ関駅行きシャトルバスはこちらから
      <br />
      ※最新の運行情報を反映しているものではありませんのでご了承ください。
      {minutesUntilNext !== null ? (
        <div className="my-3 text-left text-white font-semibold">
          次のバスまであと {minutesUntilNext} 分
        </div>
      ) : (
        <div className="my-3 text-left text-white/80">
          本日の運行は終了しました
        </div>
      )}
      <div className="space-y-1 flex-wrap flex items-end">
        {times.map((time, idx) => {
          const busTime = toDate(time);
          const isPast = busTime < currentTime;
          const isNext = idx === nextIndex;

          return (
            <div
              key={time}
              className={`text-center transition-all rounded bg-black/20 p-2 m-1 flex items-center justify-center max-w-[60px] ${
                isNext
                  ? "font-bold text-yellow-300 text-xl !p-3"
                  : isPast
                    ? "text-white/50 opacity-60"
                    : "text-white text-base"
              }`}
            >
              {time}
            </div>
          );
        })}
      </div>
    </div>
  );
}
