"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ArticleList from "@/components/common/ArticleList";
import { notoSansJP } from "@/components/common/fonts";
import type { PublicArticle } from "@/lib/articles";

type BlogTabsProps = {
  articles: PublicArticle[];
  shopAnnouncements: PublicArticle[];
  initialTab: BlogTab;
};

type BlogTab = "blog" | "announcements";

export default function BlogTabs({ articles, shopAnnouncements, initialTab }: BlogTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BlogTab>(initialTab);

  const selectTab = (tab: BlogTab) => {
    setActiveTab(tab);
    router.replace(`/blog?tab=${tab}`);
  };

  const isAnnouncements = activeTab === "announcements";

  return (
    <>
      <div className={`${notoSansJP.className} mb-8 flex border-b border-[#9AC7D6]`} role="tablist" aria-label="ブログの表示切り替え">
        <button
          type="button"
          role="tab"
          aria-selected={!isAnnouncements}
          onClick={() => selectTab("blog")}
          className={`flex-1 rounded-none border-b-2 bg-transparent px-4 py-3 text-sm font-bold transition-colors ${!isAnnouncements ? "border-[#287c95] text-[#1f3a4a]" : "border-transparent text-[#51636d] hover:text-[#1f3a4a]"}`}
        >
          ブログ
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isAnnouncements}
          onClick={() => selectTab("announcements")}
          className={`flex-1 rounded-none border-b-2 bg-transparent px-4 py-3 text-sm font-bold transition-colors ${isAnnouncements ? "border-[#287c95] text-[#1f3a4a]" : "border-transparent text-[#51636d] hover:text-[#1f3a4a]"}`}
        >
          屋台からのお知らせ
        </button>
      </div>

      {isAnnouncements ? (
        <ArticleList
          articles={shopAnnouncements}
          contentType="shop-announcements"
          hrefPrefix="/blog/announcements"
          filterHrefPrefix="/blog?tab=announcements"
          prioritizePriority={false}
        />
      ) : (
        <ArticleList
          articles={articles}
          contentType="blog-articles"
          hrefPrefix="/blog"
          filterHrefPrefix="/blog?tab=blog"
        />
      )}
    </>
  );
}
