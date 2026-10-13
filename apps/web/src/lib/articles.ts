export type ArticleTag = {
  id: number
  name: string
  color?: string | null
}

export type ArticleBody = {
  root: {
    children: Array<{
      type?: string
      [key: string]: unknown
    }>
    [key: string]: unknown
  }
  [key: string]: unknown
}

export type PublicArticle = {
  id: number
  title: string
  excerpt?: string | null
  body: ArticleBody
  tags?: (number | ArticleTag)[] | null
  priority?: 'high' | 'medium'
  publishedAt?: string | null
  createdAt: string
}

export const getArticleTags = (article: Pick<PublicArticle, 'tags'>) => (
  (article.tags ?? []).filter((tag): tag is ArticleTag => typeof tag === 'object' && tag !== null)
)
