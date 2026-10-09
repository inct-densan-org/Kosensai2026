import CampusMap from '@/features/map/CampusMap'
import { Card, CardContent } from '@/components/ui/Card'
import styles from './page.module.css'
import { maps } from '@/data/maps'

export default async function MapPage({ searchParams }: {
  searchParams: Promise<{ shopId?: string }>
}) {
  const { shopId } = await searchParams

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>校内マップ</h1>

        <Card className={styles.noticeCard}>
          <CardContent>
            <p>屋台ピンを押すと概要が表示されます。</p>
            <p className={styles.note}>地図は2025年版です。屋台名・紹介文・ピンの位置は表示確認用の仮データです。</p>
            <p className={styles.note}>地図は2本の指で拡大・縮小、ドラッグで移動できます。「全体」で元の表示に戻ります。番号は地図下の屋台一覧と対応しています。</p>
          </CardContent>
        </Card>

        <nav className={styles.navigation} aria-label="マップのエリア">
          {maps.map(map => <a key={map.id} href={`#${map.id}`}>{map.name}</a>)}
        </nav>

        <CampusMap initialShopId={shopId} />
      </div>
    </main>
  )
}
