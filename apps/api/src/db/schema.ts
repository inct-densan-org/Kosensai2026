import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  body: text('body').notNull(),
  createdAt: text('created_at').notNull()
})

export type MessageRow = typeof messages.$inferSelect
