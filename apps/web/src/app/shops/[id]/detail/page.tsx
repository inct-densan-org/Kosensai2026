import { notFound } from 'next/navigation'
import ShopDetail from '@/components/shops/ShopDetail'
import { getShopAnnouncements, getShopByName } from '@/lib/shops'
import { postersData } from '@/posters.data'

type ShopDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { id } = await params
  const index = Number(id)

  if (!Number.isInteger(index) || index < 0 || !postersData[index]) {
    notFound()
  }

  const shop = await getShopByName(postersData[index].title)
  const announcements = shop
    ? await getShopAnnouncements(String(shop.id))
    : []

  return <ShopDetail shop={shop} announcements={announcements} posterIndex={index} />
}
