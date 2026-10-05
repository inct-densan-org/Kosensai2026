import { cn } from "@/lib/utils";

// 背景とかのレイアウトをまとめるコンポーネント
export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full min-h-screen py-20"
      style={{
        backgroundColor: "#7fc7db",
        backgroundImage:
          "linear-gradient(120deg, #2299bd 0%, #7fc7db 48%, #d6f6ff 100%)",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        color: "var(--text-color-default)",
      }}
    >
      {children}
    </div>
  );
}

// ページのコンテンツを中央に寄せ、最大幅を制限するコンポーネント
// (中身の枠線用など)
export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[900px] px-4", className)}>
      {children}
    </div>
  );
}

