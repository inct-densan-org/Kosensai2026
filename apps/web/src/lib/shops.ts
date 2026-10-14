import { apiBaseUrl } from './api'
import type { NewsRichText } from './news'

export type Shop = {
  id: number
  code: string
  name: string
  menu?: NewsRichText | null
  createdAt: string
  updatedAt: string
}

export type ShopAnnouncement = {
  id: number
  title: string
  excerpt?: string | null
  body: NewsRichText
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

type ShopAnnouncementListResponse = {
  docs: ShopAnnouncement[]
}

type ShopListResponse = {
  docs: Shop[]
}

const fetchShopData = (url: string) => {
  return fetch(url, {
    next: {
      revalidate: 60,
    },
  })
}

export async function getShopByName(name: string) {
  const url = new URL(`${apiBaseUrl}/shops`)
  url.searchParams.set('where[name][equals]', name)
  url.searchParams.set('limit', '1')
  url.searchParams.set('depth', '1')

  const response = await fetchShopData(url.toString())

  if (!response.ok) {
    throw new Error(`Shop API request failed: ${response.status}`)
  }

  const data = await response.json() as ShopListResponse
  return data.docs[0] ?? null
}

export async function getShopAnnouncements(shopId: string) {
  const url = new URL(`${apiBaseUrl}/shop-announcements`)
  url.searchParams.set('where[status][equals]', 'published')
  url.searchParams.set('where[shop][equals]', shopId)
  url.searchParams.set('sort', '-publishedAt')
  url.searchParams.set('limit', '100')
  url.searchParams.set('depth', '1')

  const response = await fetchShopData(url.toString())

  if (!response.ok) {
    throw new Error(`Shop announcement API request failed: ${response.status}`)
  }

  const data = await response.json() as ShopAnnouncementListResponse
  return data.docs
}
