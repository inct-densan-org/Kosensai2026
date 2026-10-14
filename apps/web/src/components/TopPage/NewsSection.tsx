import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import ContentCard from "@/components/common/ContentCard";
import { formatNewsDate, getNewsArticles, type NewsArticle } from "@/lib/news";
import { screensHeight } from "./TopSection";
import WhiteCard from "@/components/common/WhiteCard";

// トップページのニュース項目
// - 白いカード（送迎バスと同じ）の大枠の上に、記事を1件ずつ ContentCard で新しい順（重要なものを先頭）に並べ、一覧ページへのリンクを置く
// - 項目全体（見出し＋大枠）が1画面に収まるよう大枠の高さに上限を設け、あふれた分は枠の中だけスクロールする

// 表示する件数
const NEWS_COUNT = 10;

// 1画面のうち大見出しまわり（上下の余白・見出し・見出し下の余白）が占めるおおよその高さ
const HEADING_AREA = "232px";

async function loadNews(): Promise<NewsArticle[]> {
  try {
    const articles = await getNewsArticles();
    return [...articles]
      .sort((a, b) => {
        if (a.priority === "high" && b.priority !== "high") return -1;
        if (a.priority !== "high" && b.priority === "high") return 1;
        return new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime();
      })
      .slice(0, NEWS_COUNT);
  } catch {
    // API に接続できなくてもトップページ自体は表示する
    return [];
  }
}

export default async function NewsSection() {
  const articles = await loadNews();

  return (
    <WhiteCard
      className="flex flex-col p-4 text-[#1f3a4a] sm:p-5"
      style={{ maxHeight: `calc(${screensHeight(1)} - ${HEADING_AREA})` }}
    >
      {articles.length === 0 ? (
        <p className="m-0 py-6 text-center text-sm text-[#51636d]">現在お知らせはありません。</p>
      ) : (
        <ul className="m-0 min-h-0 flex-1 list-none space-y-3 overflow-y-auto overscroll-contain p-1">
          {articles.map((article) => (
            <li key={article.id}>
              <ContentCard bodyClassName="!p-4 sm:!p-5">
                <Link href={`/news/${article.id}`} className="group grid grid-cols-[1fr_auto] items-center gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold tracking-[0.1em] text-[#51636d]">
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
                    <h3 className="m-0 mt-2 text-base font-bold leading-snug sm:text-lg">{article.title}</h3>
                    {article.excerpt && (
                      <p className="m-0 mt-1.5 line-clamp-2 text-sm leading-6 text-[#51636d]">{article.excerpt}</p>
                    )}
                  </div>
                  <ArrowUpRight
                    size={20}
                    aria-hidden
                    className="text-[#2f7f9c] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </Link>
              </ContentCard>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex-none text-right">
        <Link href="/news" className="text-sm font-bold text-[#2f7f9c] underline underline-offset-4">
          ニュース一覧へ →
        </Link>
      </div>
    </WhiteCard>
  );
}
