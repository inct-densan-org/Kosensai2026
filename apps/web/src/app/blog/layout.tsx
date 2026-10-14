import TopBar from "@/components/common/TopBar";
import type { ReactNode } from "react";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar current="BLOG" />
      {children}
    </>
  );
}
