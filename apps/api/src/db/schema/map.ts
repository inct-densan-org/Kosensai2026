import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { shops } from './shops'

//マップ画像
export const mapLayers = sqliteTable('map_layers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull(),
  name: text('name').notNull(),
  imageUrl: text('image_url').notNull(),
  width: integer('width'),
  height: integer('height'),
  sortOrder: integer('sort_order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  uniqueIndex('map_layers_code_unique').on(table.code),
  index('map_layers_sort_order_idx').on(table.sortOrder)
])

// ピン
export const mapPins = sqliteTable('map_pins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull(),
  mapLayerId: integer('map_layer_id')
    .notNull()
    .references(() => mapLayers.id),
  pinType: text('pin_type', { enum: ['shop', 'timetable', 'label'] }).notNull(),
  shopId: text('shop_id').references(() => shops.code),
  title: text('title').notNull(),
  label: text('label'),
  description: text('description'),
  x: real('x').notNull(),
  y: real('y').notNull(),
  color: text('color'),
  isInteractive: integer('is_interactive', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  uniqueIndex('map_pins_code_unique').on(table.code),
  index('map_pins_shop_id_idx').on(table.shopId),
])

//タイムテーブル情報(シャトルバス時刻表)
export const mapPinTimetableGroups = sqliteTable('map_pin_timetable_groups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  mapPinId: integer('map_pin_id')
    .notNull()
    .references(() => mapPins.id),
  title: text('title').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  index('map_pin_timetable_groups_pin_sort_order_idx').on(table.mapPinId, table.sortOrder)
])

//タイムテーブル各時刻(10:00発とか)
export const mapPinTimetableEntries = sqliteTable('map_pin_timetable_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  groupId: integer('group_id')
    .notNull()
    .references(() => mapPinTimetableGroups.id),
  departureAt: text('departure_at').notNull(),
  label: text('label').notNull(),
  note: text('note'),
  sortOrder: integer('sort_order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  index('map_pin_timetable_entries_group_sort_order_idx').on(table.groupId, table.sortOrder)
])
