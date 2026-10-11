import Link from 'next/link'
import type { NewsArticle } from '@/lib/news'
import { formatNewsDate } from '@/lib/news'

type NewsListProps = {
  articles: NewsArticle[]
}

export default function NewsList({ articles }: NewsListProps) {
  if (articles.length === 0) {
    return <p className="rounded-md bg-[#aaa] px-3 py-4 text-center">現在お知らせはありません。</p>
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-md bg-[#aaa]">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/news/${article.id}`}
          className="grid grid-cols-[1fr_auto] gap-2 border-b border-black px-3 py-4 transition-opacity hover:opacity-70"
        >
          <div className="min-w-0">
            <div className="text-sm font-bold">
              {formatNewsDate(article.publishedAt ?? article.createdAt)}
            </div>

            <div className="truncate text-base font-bold">
              {article.title}
            </div>
          </div>

          <span className="self-center text-lg">
            →
          </span>
        </Link>
      ))}
    </div>
  )
}
