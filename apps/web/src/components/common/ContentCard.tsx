 import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

// 各ページの項目の本文を入れるシンプルなカード

type ContentCardProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children: ReactNode;
  // カードの外側の要素（既定: div）。項目単位なら "section" や "article" を指定する
  as?: ElementType;
  // 本文部分（内側の余白を持つ要素）に追加するクラス
  bodyClassName?: string;
};

export default function ContentCard({
  children,
  as: Tag = "div",
  className = "",
  bodyClassName = "",
  ...rest
}: ContentCardProps) {
  return (
    <Tag
      {...rest}
      className={`relative rounded-2xl bg-white ${className}`}
    >
      <div className={`p-6 md:p-10 ${bodyClassName}`}>{children}</div>
    </Tag>
  );
}
