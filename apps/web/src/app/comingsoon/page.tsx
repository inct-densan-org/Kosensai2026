"use client";

import { useState } from "react";
import LoadingCurtain from "@/components/common/LoadingCurtain";

export default function Page() {
    const [isIntroDone, setIsIntroDone] = useState(false);

    return (
        <main className="relative w-full h-screen bg-[#7ec5d9]">
            {/*ComingSoonを外したとき用*/}
            
            {/* AnimatePresenceで囲むことで、isIntroDoneがtrueになり
        LoadingScreenが破棄される時に exit のアニメーション（フェードアウト）が実行されます 
      */}
            {/*<AnimatePresence>*/}
            {/*    {!isIntroDone && (*/}
            {/*        <LoadingScreen onComplete={() => setIsIntroDone(true)} />*/}
            {/*    )}*/}
            {/*</AnimatePresence>*/}
            
            {/*/!* 3D空間は後ろに常にレンダリングしておくか、isIntroDoneがtrueになったらマウントします *!/*/}
            {/*<VoxelTerrainBackground/>   */}
            {/*{isIntroDone &&*/}
            {/* // <InteractiveParallax />*/}
            {/*}*/}
            
            <LoadingCurtain />
            

        </main>
    );
}