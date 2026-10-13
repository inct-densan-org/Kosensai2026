import Link from 'next/link'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { PAGE_BACKGROUND } from '@/components/common/pageLayout'
import { notoSansJP, shipporiMincho } from '@/components/common/fonts'
import ReactionBar from '@/components/common/ReactionBar'
import RichText from '@/components/common/RichText'
import { formatNewsDate, getNewsArticle } from '@/lib/news'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params
  const article = await getNewsArticle(id)

  if (!article) {
    notFound()
  }

  return (
    <main className="min-h-screen px-5 py-10 sm:px-8 sm:py-20" style={{ backgroundColor: PAGE_BACKGROUND }}>
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/news"
          className="mb-10 inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-55 sm:mb-14"
        >
          <ArrowLeft size={16} aria-hidden />
          NEWS一覧
        </Link>

        <article className="border-y border-black/20 py-8 sm:py-10">
          <div className={`${notoSansJP.className} flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-black/55`}>
            <CalendarDays size={15} aria-hidden />
            <time dateTime={article.publishedAt ?? article.createdAt}>
              {formatNewsDate(article.publishedAt ?? article.createdAt)}
            </time>
            <span aria-hidden>·</span>
            <span>NEWS</span>
          </div>

          <h1 className={`${shipporiMincho.className} mt-6 !text-3xl !font-bold !leading-[1.3] tracking-[0.04em] sm:!text-4xl`}>
            {article.title}
          </h1>

          {article.excerpt && (
            <p className={`${notoSansJP.className} mt-6 border-l-2 border-black/35 pl-4 text-base leading-8 text-black/65 sm:text-lg`}>
              {article.excerpt}
            </p>
          )}

          <RichText
            content={article.body}
            className="mt-7 text-base leading-8 sm:mt-8 sm:text-lg"
          />

          <div className="mt-10">
            <ReactionBar contentType="news-articles" contentId={article.id} />
          </div>
        </article>
      </div>
    </main>
  )
}
