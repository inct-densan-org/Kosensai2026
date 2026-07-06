import { desc } from 'drizzle-orm'
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { user } from './user'
import { mediaAssets } from './media'

//タグ
export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  color: text('color'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp_ms' })
}, table => [
  uniqueIndex('tags_name_unique').on(table.name)
])

// お知らせ
export const newsArticles = sqliteTable('news_articles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  body: text('body').notNull(),
  sanitizedBody: text('sanitized_body').notNull(),
  status: text('status', { enum: ['draft', 'scheduled', 'published', 'archived'] }).notNull(),
  priority: text('priority', { enum: ['high', 'medium'] }).notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
  scheduledAt: integer('scheduled_at', { mode: 'timestamp_ms' }),
  createdBy: text('created_by')
    .notNull()
    .references(() => user.id),
  updatedBy: text('updated_by')
    .notNull()
    .references(() => user.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp_ms' })
}, table => [
  index('news_articles_status_published_at_idx').on(table.status, desc(table.publishedAt)),
  index('news_articles_priority_published_at_idx').on(table.priority, desc(table.publishedAt)),
  index('news_articles_created_by_idx').on(table.createdBy),
  index('news_articles_updated_by_idx').on(table.updatedBy)
])

//ブログ記事
export const blogArticles = sqliteTable('blog_articles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  body: text('body').notNull(),
  sanitizedBody: text('sanitized_body').notNull(),
  status: text('status', { enum: ['draft', 'scheduled', 'published', 'archived'] }).notNull(),
  articleType: text('article_type', {
    enum: ['shop-feature', 'review', 'highlight', 'behind-the-scenes']
  }).notNull(),
  coverMediaId: integer('cover_media_id').references(() => mediaAssets.id),
  authorUserId: text('author_user_id')
    .notNull()
    .references(() => user.id),
  authorDisplayName: text('author_display_name'),
  publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
  scheduledAt: integer('scheduled_at', { mode: 'timestamp_ms' }),
  createdBy: text('created_by')
    .notNull()
    .references(() => user.id),
  updatedBy: text('updated_by')
    .notNull()
    .references(() => user.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp_ms' })
}, table => [
  index('blog_articles_status_published_at_idx').on(table.status, desc(table.publishedAt)),
  index('blog_articles_article_type_published_at_idx').on(table.articleType, desc(table.publishedAt)),
  index('blog_articles_author_user_id_idx').on(table.authorUserId),
  index('blog_articles_cover_media_id_idx').on(table.coverMediaId)
])

export const newsArticleTags = sqliteTable('news_article_tags', {
  newsArticleId: integer('news_article_id')
    .notNull()
    .references(() => newsArticles.id),
  tagId: integer('tag_id')
    .notNull()
    .references(() => tags.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  primaryKey({ columns: [table.newsArticleId, table.tagId] }),
  index('news_article_tags_tag_id_idx').on(table.tagId)
])

//ブログ記事<->タグ 中間
export const blogArticleTags = sqliteTable('blog_article_tags', {
  blogArticleId: integer('blog_article_id')
    .notNull()
    .references(() => blogArticles.id),
  tagId: integer('tag_id')
    .notNull()
    .references(() => tags.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  primaryKey({ columns: [table.blogArticleId, table.tagId] }),
  index('blog_article_tags_tag_id_idx').on(table.tagId)
])

export const newsArticleMedia = sqliteTable('news_article_media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  newsArticleId: integer('news_article_id')
    .notNull()
    .references(() => newsArticles.id),
  mediaAssetId: integer('media_asset_id')
    .notNull()
    .references(() => mediaAssets.id),
  sortOrder: integer('sort_order').notNull(),
  usageType: text('usage_type', { enum: ['inline', 'thumbnail'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  index('news_article_media_article_sort_idx').on(table.newsArticleId, table.sortOrder),
  index('news_article_media_asset_id_idx').on(table.mediaAssetId)
])

export const blogArticleMedia = sqliteTable('blog_article_media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  blogArticleId: integer('blog_article_id')
    .notNull()
    .references(() => blogArticles.id),
  mediaAssetId: integer('media_asset_id')
    .notNull()
    .references(() => mediaAssets.id),
  sortOrder: integer('sort_order').notNull(),
  usageType: text('usage_type', { enum: ['cover', 'inline', 'gallery', 'video'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  index('blog_article_media_article_sort_idx').on(table.blogArticleId, table.sortOrder),
  index('blog_article_media_asset_id_idx').on(table.mediaAssetId)
])
