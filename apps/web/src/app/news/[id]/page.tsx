import Link from 'next/link'
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
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-6">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-4 text-center text-3xl font-bold">
          NEWS
        </h1>

        <article className="rounded-md bg-[#899c9a] p-4">
          <h2 className="text-2xl font-bold">
            {article.title}
          </h2>

          <div className="mt-4 flex gap-4 text-sm font-bold">
            <span>{formatNewsDate(article.publishedAt ?? article.createdAt)}</span>
            <span>ニュース</span>
          </div>

          <RichText
            content={article.body}
            className="mt-5 text-sm leading-7"
          />
        </article>

        <Link
          href="/news"
          className="mt-4 inline-block underline"
        >
          ← NEWS一覧に戻る
        </Link>
      </div>
    </main>
  )
}
