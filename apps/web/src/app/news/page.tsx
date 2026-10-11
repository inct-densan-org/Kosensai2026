
import NewsList from '@/components/news/NewsList'

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-6">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-4 text-center text-3xl font-bold">
          NEWS
        </h1>

        <NewsList />
      </div>
    </main>
  )
}