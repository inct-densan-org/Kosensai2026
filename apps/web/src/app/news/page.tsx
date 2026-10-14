import NewsList from '@/components/news/NewsList'
import PageBackground from '@/components/common/PageBackground'
import { PAGE_BACKGROUND } from '@/components/common/pageLayout'
import { shipporiMincho } from '@/components/common/fonts'
import { getNewsArticles } from '@/lib/news'

export default async function NewsPage() {
  const articles = await getNewsArticles()

  return (
    <main className="relative isolate min-h-screen px-5 py-12 sm:px-8 sm:py-16" style={{ backgroundColor: PAGE_BACKGROUND }}>
      <PageBackground />
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 border-b border-black/20 pb-8 sm:mb-10 sm:pb-9">
          <h1 className={`${shipporiMincho.className} !text-4xl !font-bold !leading-none tracking-[0.08em] sm:!text-6xl`}>ニュース</h1>
        </header>

        <NewsList articles={articles} />
      </div>
    </main>
  )
}
