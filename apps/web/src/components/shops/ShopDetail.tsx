import Image from 'next/image'
import Link from 'next/link'
import { Pin } from 'lucide-react'
import ContentCard from '@/components/common/ContentCard'
import WhiteCard from '@/components/common/WhiteCard'
import RichText from '@/components/common/RichText'
import { postersData } from '@/posters.data'
import type { ShopAnnouncement } from '@/lib/shops'

type ShopDetailProps = {
  announcements: ShopAnnouncement[]
  posterIndex: number
}

export default function ShopDetail({ announcements, posterIndex }: ShopDetailProps) {
  const poster = postersData[posterIndex]

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 text-slate-900 sm:py-16">
      <WhiteCard className="p-5 md:p-8">
        <article>
          {poster && (
            <p className="rounded-full w-fit bg-[#1f3a4a]/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              No. {String(poster.mapId).padStart(2, '0')}
            </p>

          )}
          <h2 className="mt-2 text-3xl font-bold">{poster.title}</h2>

          {poster?.cancellationNotice && (
            <p className="mt-8 rounded-xl border-2 border-black px-5 py-6 text-center text-2xl font-extrabold text-red-700">
              {poster.cancellationNotice}
            </p>
          )}

          {poster?.images && poster.images.length > 0 && (
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {poster.images.map((image, imageIndex) => (
                <div
                  key={image}
                  className="relative aspect-[277/392] w-full max-w-sm bg-slate-100"
                >
                  <Image
                    src={image}
                    alt={`${poster.title}のポスター ${imageIndex + 1}`}
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

          <section className="mt-10" aria-labelledby="shop-announcements-heading">
            <div className="flex items-end justify-between gap-4 px-1">
              <h2 id="shop-announcements-heading" className="text-xl font-bold text-slate-900">
                お知らせ
              </h2>
              {announcements.length > 0 && (
                <span className="text-xs font-bold tracking-[0.12em] text-slate-500">
                  {announcements.length}件
                </span>
              )}
            </div>

            {announcements.length > 0 ? (
              <div className="mt-4 space-y-4">
                {announcements.map((announcement) => {
                  const isHighPriority = announcement.priority === 'high'

                  return (
                  <ContentCard
                    as="article"
                    key={announcement.id}
                    className={isHighPriority ? 'border-2 border-[#287c95]' : ''}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {announcement.priority === 'high' && (
                        <span
                          aria-label="優先表示のお知らせ"
                          title="優先表示のお知らせ"
                          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#287c95] text-white shadow-sm"
                        >
                          <Pin aria-hidden="true" size={15} className="fill-current" />
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-slate-900">{announcement.title}</h3>
                    </div>
                    <RichText content={announcement.body} className="mt-3 leading-8" />
                  </ContentCard>
                  )
                })}
              </div>
            ) : (
              <p className="mt-3 px-1 text-slate-500">現在、お知らせはありません。</p>
            )}
          </section>

          <Link
            href={`/map?mapId=${poster.mapId}`}
            className="mt-8 inline-block underline"
          >
            マップで場所を見る
          </Link>
        </article>
      </WhiteCard>
    </main>
  )
}
