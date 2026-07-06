import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from './user'

export const mediaAssets = sqliteTable('media_assets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  kind: text('kind', { enum: ['image', 'video', 'document'] }).notNull(),
  storagePath: text('storage_path').notNull(),
  publicUrl: text('public_url').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  durationSeconds: integer('duration_seconds'),
  altText: text('alt_text'),
  uploadedBy: text('uploaded_by')
    .notNull()
    .references(() => user.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp_ms' })
}, table => [
  index('media_assets_kind_idx').on(table.kind),
  index('media_assets_uploaded_by_idx').on(table.uploadedBy)
])
