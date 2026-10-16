import ArticleList from '@/components/common/ArticleList'
import type { NewsArticle } from '@/lib/news'
import { TOP_BAR_HEIGHT } from '@/components/common/pageLayout'

// 白いカードの高さの上限：画面2枚分（トップバーを除く）から、ページ上下の余白と大見出しまわりのおおよその高さを引いたもの
// あふれた記事はカードの中だけスクロールする
const HEADING_AREA = '264px'
const MAX_HEIGHT = `calc((100svh - ${TOP_BAR_HEIGHT}) * 2 - ${HEADING_AREA})`

type NewsListProps = {
  articles: NewsArticle[]
}

export default function NewsList({ articles }: NewsListProps) {
  return <ArticleList articles={articles} contentType="news-articles" hrefPrefix="/news" variant="card" maxHeight={MAX_HEIGHT} />
}
