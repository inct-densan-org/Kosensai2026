import ArticleList from '@/components/common/ArticleList'
import type { NewsArticle } from '@/lib/news'

type NewsListProps = {
  articles: NewsArticle[]
}

export default function NewsList({ articles }: NewsListProps) {
  return <ArticleList articles={articles} contentType="news-articles" hrefPrefix="/news" variant="card" />
}
