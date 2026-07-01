"use client";

import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";
import { Noto_Serif_JP } from "next/font/google";
import MovingVoxelTerrain from "./MovingVoxelTerrain";
import Link from "next/link";

const notoSerifJP = Noto_Serif_JP({
    subsets: ['latin'],
    weight: ['400', '700', '900']
});

const KosenFesText = ({ colorClass }: { colorClass: string }) => (
    <div className="flex items-center gap-6">
        <div className={`text-6xl md:text-8xl font-black leading-none tracking-widest text-right ${colorClass}`}>
            高専祭
        </div>
        <div className={`flex flex-col justify-center gap-3 ${colorClass}`}>
            <div className="text-2xl md:text-3xl font-bold leading-none tracking-widest">
                第62回
            </div>
            <div className="text-2xl md:text-3xl font-bold leading-none tracking-widest">
                一関高専
            </div>
        </div>
    </div>
);

export default function LoadingCurtain() {
    const controls = useAnimation();
    const [isVoxelMounted, setIsVoxelMounted] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const sequence = async () => {
            if (typeof window !== 'undefined' && document.readyState !== "complete") {
                await new Promise((resolve) => window.addEventListener("load", resolve));
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (!isMounted) return;

            // 1. フェードイン
            await controls.start("appear");
            await new Promise((resolve) => setTimeout(resolve, 600));

            // 2. 帳（マスク）が上から降りてくる
            await controls.start("curtainDown");

            // ★修正: 帳が降りてから文字が移動するまでの遅延を半分に (500ms -> 250ms)
            await new Promise((resolve) => setTimeout(resolve, 250));

            // 3. テキスト群の移動を開始 (duration: 1.0s)
            // ★修正: awaitを外し、移動アニメーションと並行して次の処理へ進む
            controls.start("moveUp");

            // ★修正: 詳細が出るまでの時間も半分に (元は移動を1000ms待っていたのを500msに短縮)
            await new Promise((resolve) => setTimeout(resolve, 500));

            // 4. 詳細情報がフェードイン (文字が上に動き終わる頃にフワッと出始める)
            controls.start("showDetails");

            // ボクセルをマウント
            setIsVoxelMounted(true);

            // 5. ボクセルの出現
            // 詳細情報が出始めてから少し待って背景を透過
            await new Promise((resolve) => setTimeout(resolve, 400));
            controls.start("showVoxel");
        };

        sequence();

        return () => {
            isMounted = false;
        };
    }, [controls]);

    const textMoveVariants = {
        moveUp: {
            y: "-15vh",
            scale: 0.85,
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
        }
    };

    return (
        <div className={`relative w-full h-screen overflow-hidden bg-[#525d5f] ${notoSerifJP.className}`}>

            {/* 1. 最背面：ボクセル背景 */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={{ opacity: 0 }}
                variants={{ showVoxel: { opacity: 1, transition: { duration: 0.8 } } }}
                animate={controls}
            >
                {isVoxelMounted && <MovingVoxelTerrain />}
            </motion.div>

            {/* 2. 【ベースレイヤー】 */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 1 }}
                    // ★修正: ボクセル表示時に duration: 0 で「即座に」透明にする（白フラッシュを完全に防止）
                    variants={{ showVoxel: { opacity: 0, transition: { duration: 0 } } }}
                    animate={controls}
                />

                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center"
                    style={{ top: "40%" }}
                    initial={{ opacity: 0, y: 0, scale: 1 }}
                    variants={{
                        appear: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
                        ...textMoveVariants
                    }}
                    animate={controls}
                >
                    <KosenFesText colorClass="text-[#525d5f]" />
                </motion.div>
            </div>

            {/* 3. 【帳レイヤー】 */}
            <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                variants={{
                    curtainDown: { clipPath: "inset(0 0 0 0)", transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] } }
                }}
                animate={controls}
            >
                <div className="absolute inset-0">
                    {/* ★修正: グラデーション背景を「常に裏」に配置しておく */}
                    <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 100%)" }}
                    />

                    {/* ★修正: 手前の「完全な黒」だけをフェードアウトさせる（これで透けによる白フラッシュが起きない） */}
                    <motion.div
                        className="absolute inset-0 bg-black"
                        initial={{ opacity: 1 }}
                        variants={{ showVoxel: { opacity: 0, transition: { duration: 1.5 } } }}
                        animate={controls}
                    />
                </div>

                {/* 反転後の純白テキスト */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center"
                    style={{ top: "40%" }}
                    initial={{ y: 0, scale: 1 }}
                    variants={textMoveVariants}
                    animate={controls}
                >
                    <KosenFesText colorClass="text-white" />
                </motion.div>

                {/* COMING SOON */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center"
                    style={{ top: "54%" }}
                    initial={{ y: 0, scale: 1 }}
                    variants={textMoveVariants}
                    animate={controls}
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-[0.2em] text-white drop-shadow-md">
                        COMING SOON
                    </h2>
                </motion.div>
            </motion.div>

            {/* 4. 【下部の追加情報】 */}
            <motion.div
                className="absolute bottom-[15%] left-0 w-full flex flex-col items-center justify-center z-30 pointer-events-none text-white gap-3"
                initial={{ opacity: 0, y: 20 }}
                variants={{
                    showDetails: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
                }}
                animate={controls}
            >
                <p className="text-xl md:text-3xl tracking-widest font-medium">
                    青春はtimeless
                </p>
                <p className="text-sm md:text-lg tracking-wider mb-4 opacity-80">
                    〜今しかない、この瞬間を〜
                </p>
                <div className="flex flex-col items-center text-sm md:text-base tracking-widest font-light opacity-90 border-t border-white/30 pt-4">
                    <p>2026.10.24(土) - 25(日)</p>
                    <p>09:00 ~ 17:00</p>
                    <p>一関工業高等専門学校</p>
                </div>
                <div className="flex flex-col items-center text-sm md:text-base tracking-widest font-light opacity-90 mt-auto border-t border-white/30 pt-4">
                    <p>Archive</p>
                    <p className={"pointer-events-auto z-100 underline text-blue-500 hover:text-blue-600 hover:cursor-pointer flex flex-center gap-4"}>
                        <Link className={"block"} href={"https://kosensai.ichinoseki.ac.jp/archive/2023"}>
                            2023
                        </Link>
                        <Link className={"block"} href={"https://kosensai.ichinoseki.ac.jp/archive/2024"}>
                            2024
                        </Link>
                        <Link className={"block"} href={"https://kosensai.ichinoseki.ac.jp/archive/2025"}>
                            2025
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}