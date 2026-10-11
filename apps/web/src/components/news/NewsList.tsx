import Link from 'next/link'

const articles = [
  {
    id: 1,
    title: 'aaa',
    date: '2026/9/30',
  },
  {
    id: 2,
    title: 'bbb',
    date: '2026/9/30',
  },
  {
    id: 3,
    title: 'ccc',
    date: '2026/9/30',
  },
]

export default function NewsList() {
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
              {article.date}
            </div>

            <div className="truncate text-base font-bold">
              {article.title}
            </div>
          </div>

          <span className="self-center text-lg">
            &gt;
          </span>
        </Link>
      ))}
    </div>
  )
}