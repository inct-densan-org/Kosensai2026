import Link from "next/link"
import { ArrowLeft, CalendarDays } from "lucide-react"
import { notFound } from "next/navigation"
import { PAGE_BACKGROUND } from "@/components/common/pageLayout"
import { notoSansJP, shipporiMincho } from "@/components/common/fonts"
import ReactionBar from "@/components/common/ReactionBar"
import RichText from "@/components/common/RichText"
import { getArticleTags } from "@/lib/articles"
import { getShopAnnouncement } from "@/lib/shops"
import { formatNewsDate } from "@/lib/news"

export default async function ShopAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const announcement = await getShopAnnouncement(id)

  if (!announcement || announcement.status !== "published") notFound()

  const tags = getArticleTags(announcement)
  const shop = typeof announcement.shop === "object" ? announcement.shop : null

  return (
    <main
      className="min-h-screen px-5 py-10 sm:px-8 sm:py-20"
      style={{ backgroundColor: PAGE_BACKGROUND }}
    >
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/blog?tab=announcements"
          className="mb-10 inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-55 sm:mb-14"
        >
          <ArrowLeft size={16} aria-hidden /> BLOG一覧
        </Link>
        <article className="border-y border-black/20 py-8 sm:py-10">
          <div
            className={`${notoSansJP.className} flex flex-wrap items-center gap-2 text-xs font-bold tracking-[0.12em] text-black/55`}
          >
            <CalendarDays size={15} aria-hidden />
            <time dateTime={announcement.publishedAt ?? announcement.createdAt}>
              {formatNewsDate(announcement.publishedAt ?? announcement.createdAt)}
            </time>
            {shop && (
              <>
                <span aria-hidden>·</span>
                <Link href={`/shops/${shop.code}/detail`} className="hover:underline">
                  {shop.name}
                </Link>
              </>
            )}
          </div>
          <h1
            className={`${shipporiMincho.className} mt-6 !text-3xl !font-bold !leading-[1.3] tracking-[0.04em] sm:!text-4xl`}
          >
            {announcement.title}
          </h1>
          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tab=announcements&tag=${tag.id}`}
                  className="rounded-sm border px-1.5 py-1 text-xs font-bold transition-colors hover:bg-[#dcecf0]"
                  style={{
                    borderColor: tag.color || "#496473",
                    color: tag.color || "#496473",
                  }}
                >
                  # {tag.name}
                </Link>
              ))}
            </div>
          )}
          <RichText
            content={announcement.body}
            className="mt-7 text-base leading-8 sm:mt-8 sm:text-lg"
          />
          <div className="mt-10">
            <ReactionBar contentType="shop-announcements" contentId={announcement.id} />
          </div>
        </article>
      </div>
    </main>
  )
}
