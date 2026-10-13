import type { CSSProperties, ReactNode } from "react";
import { notoSansJP } from "@/components/common/fonts";

export default function WhiteCard({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={`${notoSansJP.className} border border-[#cfd8dc] bg-white/70 ${className}`} style={style}>{children}</div>;
}
