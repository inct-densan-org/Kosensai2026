import { notFound } from 'next/navigation'
import ShopModal from '@/components/shops/ShopModal'
import { postersData } from '@/posters.data'

type ShopPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { id } = await params
  const index = Number(id)

  if (!Number.isInteger(index) || index < 0 || !postersData[index]) {
    notFound()
  }

  return <ShopModal index={index} />
}
