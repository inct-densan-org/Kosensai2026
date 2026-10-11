import Link from 'next/link'

const articles = [
  {
    id: 1,
    title: 'aaa',
    date: '2026/9/30',
    category: 'ニュース',
    content: 'ここに記事の内容が入ります。',
  },
  {
    id: 2,
    title: 'bbb',
    date: '2026/9/30',
    category: 'ニュース',
    content: 'ここに記事の内容が入ります。',
  },
  {
    id: 3,
    title: 'ccc',
    date: '2026/9/30',
    category: 'ニュース',
    content: 'ここに記事の内容が入ります。',
  },
]

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params
  const article = articles.find((item) => item.id === Number(id))

  if (!article) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            記事が見つかりません
          </h1>

          <Link
            href="/news"
            className="mt-4 inline-block underline"
          >
            NEWS一覧に戻る
          </Link>
        </div>
      </main>
    )
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
            <span>{article.date}</span>
            <span>{article.category}</span>
          </div>

          <div className="mt-5 whitespace-pre-wrap text-sm leading-7">
            {article.content}
          </div>
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