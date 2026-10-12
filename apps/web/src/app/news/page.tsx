
import NewsList from '@/components/news/NewsList'
import PageBackground from '@/components/common/PageBackground'
import { getNewsArticles } from '@/lib/news'

export default async function NewsPage() {
  const articles = await getNewsArticles()

  return (
    <main className="relative isolate min-h-screen bg-[#f5f5f5] px-4 py-6">
      <PageBackground />
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-4 text-center text-3xl font-bold">
          NEWS
        </h1>

        <NewsList articles={articles} />
      </div>
    </main>
  )
}
