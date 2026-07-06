import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { mediaAssets } from './media'

//屋台・出展情報
export const shops = sqliteTable('shops', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  posterMediaId: integer('poster_media_id').references(() => mediaAssets.id),
  snsUrl: text('sns_url'),
  status: text('status', { enum: ['draft', 'published', 'hidden'] }).notNull(),
  sortOrder: integer('sort_order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp_ms' })
}, table => [
  uniqueIndex('shops_code_unique').on(table.code),
  index('shops_status_sort_order_idx').on(table.status, table.sortOrder),
  index('shops_poster_media_id_idx').on(table.posterMediaId)
])

//メニュー・提供情報
export const shopMenuItems = sqliteTable('shop_menu_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull(),
  shopId: integer('shop_id')
    .notNull()
    .references(() => shops.id),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  sortOrder: integer('sort_order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  uniqueIndex('shop_menu_items_code_unique').on(table.code),
  index('shop_menu_items_shop_sort_order_idx').on(table.shopId, table.sortOrder)
])
