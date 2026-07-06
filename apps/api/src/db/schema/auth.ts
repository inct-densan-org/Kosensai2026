import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { user } from './user'
export { user, userRoles } from './user'

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  token: text('token').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
}, table => [
  uniqueIndex('session_token_unique').on(table.token),
  index('session_user_id_idx').on(table.userId),
  index('session_expires_at_idx').on(table.expiresAt)
])

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  uniqueIndex('account_provider_account_unique').on(table.providerId, table.accountId),
  index('account_user_id_idx').on(table.userId),
  index('account_user_provider_idx').on(table.userId, table.providerId)
])

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
}, table => [
  index('verification_identifier_idx').on(table.identifier),
  index('verification_expires_at_idx').on(table.expiresAt)
])
