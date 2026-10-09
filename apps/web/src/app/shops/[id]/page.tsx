import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { shops } from '@/data/shops'
import ShopPoster from '@/features/shops/ShopPoster'
import { Card, CardContent } from '@/components/ui/Card'
import styles from './page.module.css'

type ShopPageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { id } = await params
  const shop = shops.find(shop => shop.id === id)
  return { title: shop ? `${shop.name} | 高専祭2026` : '屋台が見つかりません' }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { id } = await params
  const shop = shops.find(shop => shop.id === id)
  if (!shop) notFound()

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link href="/map">マップへ戻る</Link>
        <h1 className={styles.title}>{shop.name}</h1>
        <Card>
          <CardContent>
            <div className={styles.details}>
              <ShopPoster shop={shop} />
              <div>
                <p>場所: {shop.location}</p>
                <Link href={`/map?shopId=${shop.id}`}>場所を確認する</Link>
                <h2 className={styles.title}>コメント</h2>
                <p className={styles.description}>{shop.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
