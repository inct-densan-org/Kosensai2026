"use client";

import { motion } from "motion/react";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";

// 雨の波紋演出（岩手県一関市が雨のときだけ表示する）
// - PageBackground の中で背景画像より後に置き、背景の演出よりも手前に出す
// - 一定間隔で、画面に映っている範囲のどこかからリング状の波紋が広がってフェードアウトする
// - 波紋の部分は backdrop-filter で後ろの背景をゆがませる
//   （SVG フィルターを backdrop-filter で使えるのは Chromium 系のみなので、それ以外はぼかしで代用する）
// - URL に ?rain=1 を付けると天気に関係なく表示する（確認用）

// 波紋を出す間隔（ms）、広がりきったときの直径（px）、広がる時間（秒）
const SPAWN_INTERVAL = 500;
const SPAWN_JITTER = 600;
const RIPPLE_SIZE_MIN = 512;
const RIPPLE_SIZE_MAX = 1024;
const RIPPLE_DURATION = 2.2;
// 天気を確認し直す間隔（ms）
const WEATHER_POLL_INTERVAL = 10 * 60 * 1000;

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

// 同じページに PageBackground が複数あっても天気の取得は 1 回にまとめる
let weatherRequest: { promise: Promise<boolean>; fetchedAt: number } | null = null;

function fetchIsRaining(): Promise<boolean> {
  const now = Date.now();
  if (!weatherRequest || now - weatherRequest.fetchedAt > WEATHER_POLL_INTERVAL / 2) {
    weatherRequest = {
      fetchedAt: now,
      promise: fetch("/api/weather")
        .then((res) => res.json() as Promise<{ isRaining?: boolean }>)
        .then((data) => data.isRaining === true)
        .catch(() => false),
    };
  }
  return weatherRequest.promise;
}

function useIsRaining() {
  const [isRaining, setIsRaining] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("rain") === "1") {
      setIsRaining(true);
      return;
    }

    let cancelled = false;
    const check = () => {
      fetchIsRaining().then((raining) => {
        if (!cancelled) setIsRaining(raining);
      });
    };
    check();
    const timer = window.setInterval(check, WEATHER_POLL_INTERVAL);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return isRaining;
}

// 波紋が重なった部分の背景のゆがませ方
const FALLBACK_FILTER = "blur(1.5px) brightness(1.08)";

function useDistortionStyle(filterId: string): CSSProperties {
  const [isChromium, setIsChromium] = useState(false);

  useEffect(() => {
    // navigator.userAgentData は Chromium 系にだけある
    setIsChromium("userAgentData" in navigator);
  }, []);

  return isChromium
    ? { backdropFilter: `url(#${filterId}) brightness(1.06)` }
    : { backdropFilter: FALLBACK_FILTER, WebkitBackdropFilter: FALLBACK_FILTER };
}

export default function RainRipples() {
  const isRaining = useIsRaining();
  const layerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const filterId = `rain-ripple-${useId().replace(/:/g, "")}`;
  const distortionStyle = useDistortionStyle(filterId);

  useEffect(() => {
    if (!isRaining) {
      setRipples([]);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let nextId = 0;
    let timer: number;

    const spawn = () => {
      const layer = layerRef.current;
      if (layer && !document.hidden) {
        // 背景のうち、いま画面に映っている範囲を求める
        const rect = layer.getBoundingClientRect();
        const left = Math.max(rect.left, 0);
        const right = Math.min(rect.right, window.innerWidth);
        const top = Math.max(rect.top, 0);
        const bottom = Math.min(rect.bottom, window.innerHeight);

        if (right > left && bottom > top) {
          const ripple: Ripple = {
            id: nextId++,
            x: left + Math.random() * (right - left) - rect.left,
            y: top + Math.random() * (bottom - top) - rect.top,
            size: RIPPLE_SIZE_MIN + Math.random() * (RIPPLE_SIZE_MAX - RIPPLE_SIZE_MIN),
          };
          setRipples((prev) => [...prev, ripple]);
        }
      }
      timer = window.setTimeout(spawn, SPAWN_INTERVAL + Math.random() * SPAWN_JITTER);
    };

    spawn();
    return () => window.clearTimeout(timer);
  }, [isRaining]);

  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  };

  if (!isRaining) return null;

  return (
    <div ref={layerRef} className="absolute inset-0">
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="64" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            marginLeft: -ripple.size / 2,
            marginTop: -ripple.size / 2,
          }}
        >
          {/* 外側の大きな輪と、少し遅れて広がる内側の小さな輪 */}
          {[
            { scale: 1, delay: 0 },
            { scale: 0.6, delay: 0.25 },
          ].map((ring, index, rings) => (
            <motion.div
              key={index}
              className="absolute inset-0 rounded-full"
              style={{
                ...distortionStyle,
                // 中心をくり抜いてリング状にする（ゆがみもこの範囲だけにかかる）
                maskImage:
                  "radial-gradient(circle closest-side, transparent 58%, #000 80%)",
                WebkitMaskImage:
                  "radial-gradient(circle closest-side, transparent 58%, #000 80%)",
                boxShadow:
                  "inset 0 0 0 1.5px rgba(255, 255, 255, 0.55), inset 0 0 14px rgba(255, 255, 255, 0.35)",
              }}
              initial={{ scale: 0.05, opacity: 0 }}
              animate={{ scale: ring.scale, opacity: [0, 1, 0] }}
              transition={{
                delay: ring.delay,
                duration: RIPPLE_DURATION,
                ease: "easeOut",
                opacity: { delay: ring.delay, duration: RIPPLE_DURATION, times: [0, 0.12, 1], ease: "easeIn" },
              }}
              onAnimationComplete={
                index === rings.length - 1 ? () => removeRipple(ripple.id) : undefined
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
