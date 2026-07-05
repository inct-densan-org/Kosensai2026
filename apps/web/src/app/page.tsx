import LoadingCurtain from "@/components/common/LoadingCurtain";
import { Noto_Serif_JP } from "next/font/google";

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '700', '900']
});

export default function Page() {

  return (
      <main className={`relative w-full h-screen bg-[#7ec5d9] ${notoSerifJP.className}`}>
        <LoadingCurtain />
      </main>
  );
}