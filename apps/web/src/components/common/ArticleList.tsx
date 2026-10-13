"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ContentCard from "@/components/common/ContentCard";
import { notoSansJP } from "@/components/common/fonts";
import WhiteCard from "@/components/common/WhiteCard";
import ReactionSummary from "@/components/common/ReactionSummary";
import {
  getArticleTags,
  type ArticleTag,
  type PublicArticle,
} from "@/lib/articles";
import type { ReactionTargetType } from "@/lib/reactions";
import { formatNewsDate } from "@/lib/news";

type ArticleListProps = {
  articles: PublicArticle[];
  contentType: ReactionTargetType;
  hrefPrefix: string;
  // 記事の並べ方
  // - "plain": 記事ごとに枠線付きの行で並べる
  // - "card": トップページのニュースと同じく、白いカードの大枠の中に記事を1件ずつ ContentCard で並べる
  variant?: "plain" | "card";
};

const tagStyle = (tag: ArticleTag) => ({
  borderColor: tag.color || "#496473",
  color: tag.color || "#496473",
});

export default function ArticleList({
  articles,
  contentType,
  hrefPrefix,
  variant = "plain",
}: ArticleListProps) {
  const isCard = variant === "card";
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [tagMenuOpen, setTagMenuOpen] = useState(false);

  const tags = useMemo(() => {
    const tagMap = new Map<number, ArticleTag>();
    articles.forEach((article) =>
      getArticleTags(article).forEach((tag) => tagMap.set(tag.id, tag)),
    );
    return [...tagMap.values()].sort((a, b) =>
      a.name.localeCompare(b.name, "ja"),
    );
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ja");
    const filtered = articles.filter((article) => {
      const matchesQuery =
        !normalizedQuery ||
        [article.title, article.excerpt ?? ""]
          .join(" ")
          .toLocaleLowerCase("ja")
          .includes(normalizedQuery);
      const articleTagIds = getArticleTags(article).map((tag) => tag.id);
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tagId) => articleTagIds.includes(tagId));
      return matchesQuery && matchesTags;
    });

    return filtered.sort((a, b) => {
      if (a.priority === "high" && b.priority !== "high") return -1;
      if (a.priority !== "high" && b.priority === "high") return 1;
      return (
        new Date(b.publishedAt ?? b.createdAt).getTime() -
        new Date(a.publishedAt ?? a.createdAt).getTime()
      );
    });
  }, [articles, query, selectedTags]);

  const toggleTag = (tagId: number) => {
    setSelectedTags((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    );
  };

  const selectedTagObjects = tags.filter((tag) =>
    selectedTags.includes(tag.id),
  );

  useEffect(() => {
    const tagId = Number(
      new URLSearchParams(window.location.search).get("tag"),
    );
    setSelectedTags(Number.isInteger(tagId) && tagId > 0 ? [tagId] : []);
  }, []);

  const openTag = (tagId: number) => {
    setSelectedTags([tagId]);
    router.push(`${hrefPrefix}?tag=${tagId}`);
  };

  const content = (
    <>
      <div className="mb-8 border-y border-[#9AC7D6]/70 bg-[#f7fcfd]/60 px-4 py-4 sm:px-5">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[#287c95]"
            size={17}
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="記事を検索"
            aria-label="記事を検索"
            className="w-full border-0 border-b border-[#9AC7D6] bg-transparent py-2 pl-7 pr-8 text-sm outline-none placeholder:text-[#496473]/65 focus:border-[#287c95]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="検索をクリア"
              className="absolute right-0 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-transparent p-0 text-[#287c95] hover:bg-[#dcecf0]"
            >
              <X size={15} aria-hidden />
            </button>
          )}
        </div>
        {tags.length > 0 && (
          <div className="relative mt-4">
            <button
              type="button"
              onClick={() => setTagMenuOpen((open) => !open)}
              aria-expanded={tagMenuOpen}
              aria-haspopup="listbox"
              className="inline-flex items-center gap-2 rounded-sm border border-[#496473]/55 bg-transparent px-3 py-2 text-xs font-bold text-[#496473] transition-colors hover:bg-[#dcecf0]"
            >
              <span># タグで絞り込む</span>
              {selectedTags.length > 0 && (
                <span className="rounded-full bg-[#287c95] px-1.5 py-0.5 text-[10px] text-white">
                  {selectedTags.length}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${tagMenuOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {tagMenuOpen && (
              <div
                role="listbox"
                aria-label="タグで絞り込み"
                className="absolute left-0 top-full z-10 mt-2 flex max-h-48 min-w-48 flex-col gap-1 overflow-y-auto border border-[#9AC7D6] bg-[#f7fcfd] p-2 shadow-lg"
              >
                {tags.map((tag) => {
                  const selected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      aria-pressed={selected}
                      className={`rounded-sm border bg-transparent px-3 py-2 text-left text-xs font-bold transition-colors ${selected ? "border-[#287c95] bg-[#dcecf0] text-[#1f3a4a]" : "border-transparent text-[#496473] hover:border-[#9AC7D6] hover:bg-white"}`}
                      style={selected ? undefined : tagStyle(tag)}
                    >
                      # {tag.name}
                    </button>
                  );
                })}
              </div>
            )}
            {selectedTagObjects.length > 0 && (
              <div
                className="mt-3 flex flex-wrap items-center gap-2"
                aria-label="選択中のタグ"
              >
                <span className="text-[11px] font-bold text-[#496473]">
                  絞り込み中:
                </span>
                {selectedTagObjects.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className="border border-[#287c95] bg-[#dcecf0] p-0 px-2 py-1 text-[11px] font-bold text-[#1f3a4a]"
                  >
                    # {tag.name} <span aria-hidden>×</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {filteredArticles.length === 0 ? (
        <div className={isCard ? "py-12 text-center text-[#1f3a4a]" : "border-y border-black/20 py-12 text-center"}>
          <p className="text-sm font-bold">条件に一致する記事がありません。</p>
          <p className={`mt-2 text-sm ${isCard ? "text-[#51636d]" : "text-black/55"}`}>
            検索条件やタグを変更してください。
          </p>
        </div>
      ) : (
        <ul className={`m-0 list-none p-0 ${isCard ? "space-y-3" : "space-y-4"}`}>
          {filteredArticles.map((article) => {
            const articleTags = getArticleTags(article);
            const link = (
            <Link
              href={`${hrefPrefix}/${article.id}`}
              className={
                isCard
                  ? "group grid grid-cols-[1fr_auto] items-center gap-4 text-[#1f3a4a]"
                  : `group grid grid-cols-[1fr_auto] items-center gap-4 border p-4 transition-colors sm:p-5 ${article.priority === "high" ? "border-[#d58a2a]/70 bg-[#fffaf0] hover:bg-[#fff4d8]" : "border-[#9AC7D6]/70 bg-[#f7fcfd]/75 hover:bg-white"}`
              }
            >
                <div className="min-w-0">
                  <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold tracking-[0.1em] ${isCard ? "text-[#51636d]" : "text-black/55"}`}>
                    <CalendarDays size={14} aria-hidden />
                    <time dateTime={article.publishedAt ?? article.createdAt}>
                      {formatNewsDate(article.publishedAt ?? article.createdAt)}
                    </time>
                    {article.priority === "high" && (
                      <span className="border border-[#d58a2a] bg-[#ffe7ad] px-2 py-0.5 text-[10px] tracking-[0.15em] text-[#8a4b08]">
                        IMPORTANT
                      </span>
                    )}
                  </div>
                  <h2 className="m-0 mt-2 text-base font-bold leading-snug sm:text-lg">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className={`m-0 line-clamp-2 text-sm leading-6 ${isCard ? "mt-1.5 text-[#51636d]" : "mt-2 text-black/60"}`}>
                      {article.excerpt}
                    </p>
                  )}
                  {articleTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                      {articleTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              openTag(tag.id);
                            }}
                            className={
                              isSelected
                                ? "border border-[#287c95] bg-[#dcecf0] p-0 px-1.5 py-1 text-[11px] font-bold text-[#1f3a4a]"
                                : "border-b border-dashed bg-transparent p-0 px-0.5 pb-0.5 text-[11px] font-bold"
                            }
                            style={isSelected ? undefined : tagStyle(tag)}
                          >
                            # {tag.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className="mt-4">
                    <ReactionSummary
                      contentType={contentType}
                      contentId={article.id}
                    />
                  </div>
                </div>
                <ArrowUpRight
                  size={isCard ? 20 : 22}
                  aria-hidden
                  className={`self-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${isCard ? "text-[#2f7f9c]" : "text-[#287c95]"}`}
                />
              </Link>
            );
            return (
              <li key={article.id}>
                {isCard ? <ContentCard bodyClassName="!p-4 sm:!p-5">{link}</ContentCard> : link}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );

  return isCard ? (
    <WhiteCard className="p-4 sm:p-5">{content}</WhiteCard>
  ) : (
    <div className={notoSansJP.className}>{content}</div>
  );
}
