import { sql } from 'drizzle-orm'
import { check, index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { shops } from './shops'

export const userRoles = ['shop_staff', 'committee', 'admin'] as const

export const user: any = sqliteTable('user', {
  id: text('id').primaryKey(),
  // 人が入力するログインID
  loginId: text('login_id').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: userRoles }).notNull().default('shop_staff'),
  shopId: text('shop_id').references(() => shops.code),
  // better-auth の互換維持用に残す
  email: text('email').notNull(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  displayUsername: text('display_username'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  uniqueIndex('user_login_id_unique').on(table.loginId),
  uniqueIndex('user_email_unique').on(table.email),
  index('user_shop_id_idx').on(table.shopId),
  check('user_role_check', sql`${table.role} in ('shop_staff', 'committee', 'admin')`)
])
