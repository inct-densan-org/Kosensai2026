"use client";

import { useEffect, useState } from "react";

export default function MovingVoxelTerrain() {
    const [bgUrl, setBgUrl] = useState("");

    useEffect(() => {
        // 1. クライアント側で「モザイク状の雲海テクスチャ」をSVGとして自動生成
        const tileSize = 600; // テクスチャの基本サイズ（これを無限に敷き詰める）
        const gridSize = 50;  // 1ブロックのサイズ
        const cols = tileSize / gridSize;
        const rows = tileSize / gridSize;

        let rects = "";
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                // 約60%の確率でブロックを配置（適度な隙間を作る）
                if (Math.random() > 0.4) {
                    const isWhite = Math.random() > 0.4;
                    // URLエンコードのため、# は %23 に変換
                    const fill = isWhite ? "%23ffffff" : "%23cffafe"; // 白 or 淡い水色
                    // const stroke = "%23bae6fd"; // ブロックのフチ（少し濃い水色）
                    const stroke = ""; // ブロックのフチ
                    const opacity = (Math.random() * 0.4 + 0.6).toFixed(2); // 0.6 〜 1.0 の透明度

                    // 時々、複数マスにまたがる大きなブロックを作る
                    const w = (Math.random() > 0.8 ? 2 : 1) * gridSize;
                    const h = (Math.random() > 0.8 ? 2 : 1) * gridSize;

                    rects += `<rect x="${x * gridSize}" y="${y * gridSize}" width="${w}" height="${h}" fill="${fill}" fill-opacity="${opacity}" stroke="${stroke}" stroke-width="1" />`;
                }
            }
        }

        // 2. 生成したSVGをData URIに変換し、CSSの背景画像としてセット
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileSize}" height="${tileSize}">${rects}</svg>`;
        setBgUrl(`url('data:image/svg+xml;utf8,${svg}')`);
    }, []);

    return (
        <div
            className="absolute inset-0 z-0 bg-gradient-to-t from-cyan-100 to-sky-50 overflow-hidden pointer-events-none"
            style={{ perspective: "1000px" }}
        >
            <style>{`
        /* 背景画像（モザイク）のY座標だけを動かして、前進しているように見せる */
        @keyframes scrollMosaic {
          0% { background-position: 0 0; }
          100% { background-position: 0 600px; } /* tileSizeと同じ値 */
        }
        .animate-mosaic-floor {
          /* 15秒で1ループ（数値を小さくすると速くなります） */
          animation: scrollMosaic 15s linear infinite;
        }
      `}</style>

            {/* 3D空間のコンテナ：平面を大きく寝かせる（rotateX） */}
            <div
                className="absolute inset-0"
                style={{
                    transformStyle: "preserve-3d",
                    // 雲海を見下ろす角度。rotateXの数値を80などにするとより地面すれすれになります
                    transform: "rotateX(75deg) translateY(10vh)",
                }}
            >
                {/* ★ DOMはこれ1つだけ！ 動くモザイクの床 */}
                <div
                    // 画面全体を覆い尽くすように、あえて巨大なサイズ（200%以上）にする
                    className="absolute left-[-50%] top-[-100%] w-[200%] h-[300%] animate-mosaic-floor"
                    style={{
                        backgroundImage: bgUrl,
                        backgroundSize: "600px 600px", // テクスチャの繰り返しサイズ
                    }}
                />
            </div>

            {/* 霧のレイヤー：奥の方を背景の空の色（sky-50: #f0f9ff）で隠す */}
            <div
                className="absolute top-0 left-0 w-full h-[60vh] z-10 pointer-events-none"
                style={{
                    background: "linear-gradient(to bottom, #f0f9ff 0%, #f0f9ff 15%, transparent 100%)"
                }}
            />
        </div>
    );
}