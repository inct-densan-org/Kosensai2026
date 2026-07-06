import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

//リアクション
export const reactions = sqliteTable('reactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  targetType: text('target_type', { enum: ['blog', 'shop'] }).notNull(),
  targetId: integer('target_id').notNull(),
  fingerprint: text('fingerprint').notNull(),
  reactionType: text('reaction_type', { enum: ['heart'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  uniqueIndex('reactions_target_fingerprint_unique').on(
    table.targetType,
    table.targetId,
    table.fingerprint,
    table.reactionType
  ),
  index('reactions_target_idx').on(table.targetType, table.targetId)
])

//集計済みリアクション情報
export const reactionSummaries = sqliteTable('reaction_summaries', {
  targetType: text('target_type', { enum: ['blog', 'shop'] }).notNull(),
  targetId: integer('target_id').notNull(),
  reactionType: text('reaction_type', { enum: ['heart'] }).notNull(),
  count: integer('count').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  primaryKey({ columns: [table.targetType, table.targetId, table.reactionType] }),
  index('reaction_summaries_updated_at_idx').on(table.updatedAt)
])
