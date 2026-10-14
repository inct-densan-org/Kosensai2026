import Image from 'next/image'
import Link from 'next/link'
import ContentCard from '@/components/common/ContentCard'
import RichText from '@/components/common/RichText'
import { postersData } from '@/posters.data'
import type { Shop, ShopAnnouncement } from '@/lib/shops'

type ShopDetailProps = {
  shop: Shop | null
  announcements: ShopAnnouncement[]
  posterIndex: number
}

export default function ShopDetail({ shop, announcements, posterIndex }: ShopDetailProps) {
  const poster = postersData[posterIndex]

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <article className="mx-auto max-w-3xl bg-white p-5 md:p-8">
        {poster && (
          <p className="rounded-full w-fit bg-[#1f3a4a]/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            No. {String(poster.mapId).padStart(2, '0')}
          </p>

        )}
        <h2 className="mt-2 text-3xl font-bold">{shop?.name ?? poster.title}</h2>

        {poster?.images && poster.images.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {poster.images.map((image, imageIndex) => (
              <div
                key={image}
                className="relative aspect-[277/392] w-full max-w-sm bg-slate-100"
              >
                <Image
                  src={image}
                  alt={`${shop?.name ?? poster.title}のポスター ${imageIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-contain"
                  priority={imageIndex === 0}
                />
              </div>
            ))}
          </div>
        )}

        {poster?.desc && (
          <ContentCard as="section" className="mt-8">
            <h2 className="text-xl font-bold">コメント</h2>
            <p className="mt-3 whitespace-pre-wrap leading-8">{poster.desc}</p>
          </ContentCard>
        )}

        <ContentCard as="section" className="mt-8">
          <h2 className="text-xl font-bold">メニュー</h2>
          {shop?.menu ? (
            <RichText content={shop.menu} className="mt-3 leading-8" />
          ) : (
            <p className="mt-3 text-slate-500">メニューはまだ登録されていません。</p>
          )}
        </ContentCard>

        <ContentCard as="section" className="mt-8">
          <h2 className="text-xl font-bold">屋台からのお知らせ</h2>
          {announcements.length > 0 ? (
            <div className="mt-4 space-y-6">
              {announcements.map((announcement) => (
                <article key={announcement.id}>
                  <h3 className="text-lg font-bold">{announcement.title}</h3>
                  {announcement.excerpt && (
                    <p className="mt-2 text-slate-600">{announcement.excerpt}</p>
                  )}
                  <RichText content={announcement.body} className="mt-3 leading-8" />
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-slate-500">現在、お知らせはありません。</p>
          )}
        </ContentCard>

        <Link
          href={`/protected/map?mapId=${poster.mapId}`}
          className="mt-8 inline-block underline"
        >
          マップで場所を見る
        </Link>
      </article>
    </main>
  )
}
