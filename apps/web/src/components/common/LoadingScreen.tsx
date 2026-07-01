"use client"


import {motion} from "motion/react"
import {useEffect} from "react"
import {Noto_Serif_JP} from "next/font/google";

const notoSerifJP = Noto_Serif_JP({
    subsets: ['latin']
})

interface Props {
    onComplete: () => void
}

export default function LoadingScreen({onComplete}: Props) {
    // 画面が表示されてから一定時間後に終了処理を呼び出す
    useEffect(() => {
        const timer = setTimeout(() => {

            // onComplete();
        }, 2500); // 2.5秒間表示（文字が出る時間＋キープする時間）
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        // 画面全体を覆う白い背景。exitは親でAnimatePresenceを使った時のフェードアウト用
        <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-white text-[#525d5f] ${notoSerifJP.className}`}
            initial={{opacity: 1}}
            exit={{opacity: 0, transition: {duration: 0.8, ease: "easeOut"}}}
        >
            

                {/* 中身のコンテナ。初期位置を左にずらし（-100%）、
                  透明な状態から右へスライドしながら出現させます。
                */}
                <motion.div
                    
                    animate={{scale: 0.9, translateY: "-5em"}}
                    transition={{
                        duration: 0.8,
                        ease: [0.3, 0.3, 0.6, 1], // スッと出てゆっくり止まるイージング
                        delay: 1.8
                    }}
                >


                    <motion.div
                        className="flex items-center gap-6"
                        // initial={{ x: "-150%", opacity: 0 }}
                        initial={{x: 0, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        transition={{
                            duration: 0.8,
                            ease: [0.16, 0.3, 0.6, 1], // スッと出てゆっくり止まるイージング
                            delay: 0.2
                        }}
                    >
                        {/* 左側：大きく「高専祭」 */}
                        <div className="text-6xl md:text-8xl font-black leading-none tracking-widest text-right">
                            高専祭
                        </div>

                        {/* 右側：上下二分割（文字サイズは左の半分程度） */}
                        <div className="flex flex-col justify-center gap-3">
                            <div className="text-2xl md:text-3xl font-bold leading-none tracking-widest">
                                第62回
                            </div>
                            <div className="text-2xl md:text-3xl font-bold leading-none tracking-widest">
                                一関高専
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div>

                </motion.div>

            
        </motion.div>
    )
}