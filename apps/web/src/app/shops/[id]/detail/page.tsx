import { notFound } from 'next/navigation'
import ShopDetail from '@/components/shops/ShopDetail'
import { getShopAnnouncements, getShopByCode } from '@/lib/shops'
import { postersData } from '@/posters.data'

type ShopDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { id } = await params
  const mapId = Number(id)
  const posterIndex = postersData.findIndex((poster) => poster.mapId === mapId)

  if (!Number.isInteger(mapId) || posterIndex < 0) {
    notFound()
  }

  const shop = await getShopByCode(mapId)
  const announcements = shop
    ? await getShopAnnouncements(String(shop.id))
    : []

  return <ShopDetail announcements={announcements} posterIndex={posterIndex} />
}
