import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { user } from './user'
import { mapLayers } from './map'

//イベント会場情報
export const eventVenues = sqliteTable('event_venues', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  mapLayerId: integer('map_layer_id').references(() => mapLayers.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  uniqueIndex('event_venues_code_unique').on(table.code),
  index('event_venues_map_layer_id_idx').on(table.mapLayerId)
])

//イベント **予定情報**
export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  venueId: integer('venue_id')
    .notNull()
    .references(() => eventVenues.id),
  eventDate: text('event_date').notNull(),
  startAt: integer('start_at', { mode: 'timestamp_ms' }).notNull(),
  endAt: integer('end_at', { mode: 'timestamp_ms' }).notNull(),
  status: text('status', { enum: ['scheduled', 'changed', 'cancelled'] }).notNull(),
  notes: text('notes'),
  rainyVenueText: text('rainy_venue_text'),
  restrictionText: text('restriction_text'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp_ms' })
}, table => [
  uniqueIndex('events_code_unique').on(table.code),
  index('events_event_date_venue_start_idx').on(table.eventDate, table.venueId, table.startAt),
  index('events_status_event_date_start_idx').on(table.status, table.eventDate, table.startAt)
])

// イベント **当日変更情報**
export const eventStatusOverrides = sqliteTable('event_status_overrides', {
  eventId: integer('event_id')
    .primaryKey()
    .references(() => events.id),
  changeType: text('change_type', {
    enum: ['cancelled', 'time_changed', 'venue_changed', 'note_updated']
  }).notNull(),
  overrideStatus: text('override_status', { enum: ['changed', 'cancelled'] }).notNull(),
  overrideStartAt: integer('override_start_at', { mode: 'timestamp_ms' }),
  overrideEndAt: integer('override_end_at', { mode: 'timestamp_ms' }),
  overrideVenueId: integer('override_venue_id').references(() => eventVenues.id),
  message: text('message'),
  updatedBy: text('updated_by')
    .notNull()
    .references(() => user.id),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
}, table => [
  index('event_status_overrides_override_venue_id_idx').on(table.overrideVenueId),
  index('event_status_overrides_updated_by_idx').on(table.updatedBy)
])
