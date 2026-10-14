import { apiBaseUrl } from './api'
import type { ArticleBody, ArticleTag } from './articles'

export type NewsRichText = ArticleBody

export type NewsArticle = {
  id: number
  title: string
  excerpt?: string | null
  body: NewsRichText
  tags?: (number | ArticleTag)[] | null
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  publishedAt?: string | null
  createdAt: string
  priority: 'high' | 'medium'
}

type NewsListResponse = {
  docs: NewsArticle[]
}

const newsEndpoint = `${apiBaseUrl}/news-articles`

const fetchNews = async (url: string): Promise<Response> => {
  return fetch(url, {
    next: {
      revalidate: 60,
    },
  })
}

export async function getNewsArticles() {
  const url = new URL(newsEndpoint)
  url.searchParams.set('where[status][equals]', 'published')
  url.searchParams.set('sort', '-publishedAt')
  url.searchParams.set('limit', '100')
  url.searchParams.set('depth', '1')

  const response = await fetchNews(url.toString())

  if (!response.ok) {
    throw new Error(`News API request failed: ${response.status}`)
  }

  const data = await response.json() as NewsListResponse
  return data.docs
}

export async function getNewsArticle(id: string) {
  const response = await fetchNews(`${newsEndpoint}/${encodeURIComponent(id)}?depth=1`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`News API request failed: ${response.status}`)
  }

  return await response.json() as NewsArticle
}

export const formatNewsDate = (date: string | null | undefined) => {
  if (!date) return ''

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}
