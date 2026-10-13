import Link from 'next/link'
import { ArrowUpRight, CalendarDays } from 'lucide-react'
import { notoSansJP } from '@/components/common/fonts'
import ReactionSummary from '@/components/common/ReactionSummary'
import type { NewsArticle } from '@/lib/news'
import { formatNewsDate } from '@/lib/news'

type NewsListProps = {
  articles: NewsArticle[]
}

export default function NewsList({ articles }: NewsListProps) {
  if (articles.length === 0) {
    return (
      <div className="border-y border-black/20 py-12 text-center">
        <p className="text-sm font-bold">現在お知らせはありません。</p>
        <p className="mt-2 text-sm text-black/55">新しいお知らせをお待ちください。</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/news/${article.id}`}
          className={`${notoSansJP.className} group grid grid-cols-[1fr_auto] items-center gap-4 border border-[#9AC7D6]/70 bg-[#f7fcfd]/75 p-4 transition-colors hover:bg-white sm:p-5`}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold tracking-[0.1em] text-black/55">
              <CalendarDays size={14} aria-hidden />
              <time dateTime={article.publishedAt ?? article.createdAt}>
                {formatNewsDate(article.publishedAt ?? article.createdAt)}
              </time>
              {article.priority === 'high' && (
                <span className="border border-black/30 px-2 py-0.5 text-[10px] tracking-[0.15em] text-black/75">
                  IMPORTANT
                </span>
              )}
            </div>

            <h2 className="mt-2 text-base font-bold leading-snug sm:text-lg">
              {article.title}
            </h2>

            {article.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/60">
                {article.excerpt}
              </p>
            )}

            <div className="mt-4">
              <ReactionSummary contentType="news-articles" contentId={article.id} />
            </div>
          </div>

          <ArrowUpRight
            size={22}
            aria-hidden
            className="self-center text-[#287c95] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>
      ))}
    </div>
  )
}
