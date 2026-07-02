'use client';

import React, {useRef} from 'react';
import {motion, useMotionValue, useSpring, useTransform} from 'motion/react';

export function InteractiveParallax() {
    const containerRef = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = {stiffness: 150, damping: 20, mass: 0.5};
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const rotateX = useTransform(springY, [-1, 1], [15, -15]);
    const rotateY = useTransform(springX, [-1, 1], [-15, 15]);

    const inverseRotateX = useTransform(rotateX, (v) => -v);
    const inverseRotateY = useTransform(rotateY, (v) => -v);


    // 親が「X → Y」の順で回転するため、子要素は完全に相殺するために「Y → X」の順でCSSを適用する
    const billboardTemplate = ({translateZ, rotateX, rotateY}: any) => {
        return `translateZ(${translateZ}) rotateY(${rotateY}) rotateX(${rotateX})`;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / rect.width - 0.5) * 2;
        const yPct = (mouseY / rect.height - 0.5) * 2;

        x.set(xPct);
        y.set(yPct);
    };

    const handlePointerLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative w-full h-screen flex items-center justify-center bg-white overflow-hidden"
            style={{perspective: 1200}}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                className="relative w-full max-w-3xl aspect-video flex items-center justify-center"
            >

                {/* レイヤー1: 一番奥 */}
                <motion.div
                    style={{
                        translateZ: -150,
                        rotateX: inverseRotateX,
                        rotateY: inverseRotateY,
                    }}
                    transformTemplate={billboardTemplate} // テンプレートを適用
                    className="absolute inset-0 bg-blue-900/30 rounded-2xl border border-white/10 "
                >
                    {/*<MosaicBackground />*/}
                </motion.div>


                {/* レイヤー2: 中間 */}
                <motion.div
                    style={{
                        translateZ: -50,
                        rotateX: inverseRotateX,
                        rotateY: inverseRotateY,
                    }}
                    transformTemplate={billboardTemplate} // テンプレートを適用
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    aa
                </motion.div>

                {/* レイヤー3: 一番手前 */}
                <motion.div
                    style={{
                        translateZ: 150,
                        rotateX: inverseRotateX,
                        rotateY: inverseRotateY,
                    }}
                    transformTemplate={billboardTemplate} // テンプレートを適用
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <p className="text-cyan-400 text-xl md:text-3xl font-bold mt-48 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                        {/*高専祭 2026*/}
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}