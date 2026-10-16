import { apiBaseUrl } from './api'
import type { ArticleTag } from './articles'
import type { NewsRichText } from './news'

export type ShopAnnouncementPriority = 'high' | 'medium' | 'low'

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
  body: NewsRichText
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  priority?: ShopAnnouncementPriority | null
  tags?: (number | ArticleTag)[] | null
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
  shop?: number | { id: number; name: string; code: string } | null
}

type ShopAnnouncementListResponse = {
  docs: ShopAnnouncement[]
}

type ShopListResponse = {
  docs: Shop[]
}

const priorityWeight: Record<ShopAnnouncementPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

const sortShopAnnouncements = (announcements: ShopAnnouncement[]) => {
  return [...announcements].sort((a, b) => {
    const priorityDifference = priorityWeight[b.priority ?? 'medium'] - priorityWeight[a.priority ?? 'medium']
    if (priorityDifference !== 0) return priorityDifference

    return new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime()
  })
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

export async function getShopByCode(code: number) {
  const url = new URL(`${apiBaseUrl}/shops`)
  url.searchParams.set('where[code][equals]', String(code))
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
  return sortShopAnnouncements(data.docs)
}

export async function getPublishedShopAnnouncements() {
  const url = new URL(`${apiBaseUrl}/shop-announcements`)
  url.searchParams.set('where[status][equals]', 'published')
  url.searchParams.set('sort', '-publishedAt')
  url.searchParams.set('limit', '100')
  url.searchParams.set('depth', '1')

  const response = await fetchShopData(url.toString())

  if (!response.ok) {
    throw new Error(`Shop announcement API request failed: ${response.status}`)
  }

  const data = await response.json() as ShopAnnouncementListResponse
  return sortShopAnnouncements(data.docs)
}

export async function getShopAnnouncement(id: string) {
  const response = await fetchShopData(
    `${apiBaseUrl}/shop-announcements/${encodeURIComponent(id)}?depth=1`,
  )

  if (response.status === 404) return null

  if (!response.ok) {
    throw new Error(`Shop announcement API request failed: ${response.status}`)
  }

  return await response.json() as ShopAnnouncement
}

export async function getLatestShopAnnouncements() {
  const url = new URL(`${apiBaseUrl}/shop-announcements`)
  url.searchParams.set('where[status][equals]', 'published')
  url.searchParams.set('sort', '-publishedAt')
  url.searchParams.set('limit', '100')
  url.searchParams.set('depth', '1')

  const response = await fetchShopData(url.toString())

  if (!response.ok) {
    throw new Error(`Shop announcement API request failed: ${response.status}`)
  }

  const data = await response.json() as ShopAnnouncementListResponse
  const latestByShop: Record<string, ShopAnnouncement> = {}

  for (const announcement of sortShopAnnouncements(data.docs)) {
    const shop = announcement.shop
    if (shop && typeof shop === 'object' && !latestByShop[shop.code]) {
      latestByShop[shop.code] = announcement
    }
  }

  return latestByShop
}
