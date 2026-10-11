// ページ共通のレイアウト値
// TopBar はクライアントコンポーネントのため、サーバーコンポーネントからも使う値はここに置く
// （"use client" のモジュールから import した値はサーバー側では文字列として扱えない）

// ページ自体の背景色（トップページのヒーロー以下の背景と揃える）
export const PAGE_BACKGROUND = "#F2F4F0";

// トップバーの高さ。スマホ（512px 未満）ではトップバーを表示しないため 0 になる
// 値は globals.css の --top-bar-height で定義（TopBar の header の h-[...] と揃える）
export const TOP_BAR_HEIGHT = "var(--top-bar-height)";
