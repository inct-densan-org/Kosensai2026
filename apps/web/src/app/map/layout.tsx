import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "校内マップ | 高専祭2026",
    description: "高専祭の校内マップです。各企画の場所や、受付、休憩所などの施設を確認できます。",
    openGraph: {
        title: "校内マップ | 高専祭2026",
        description: "高専祭の校内マップです。各企画の場所や、受付、休憩所などの施設を確認できます。",
    },
};

export default function MapLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
