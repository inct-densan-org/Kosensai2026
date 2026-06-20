import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { apiEnv } from '../env'
import * as schema from './schema'
import { resolveDatabasePath } from './path'

const sqlite = new Database(resolveDatabasePath(apiEnv.databasePath))

export const db = drizzle({
  client: sqlite,
  schema
})

export type DatabaseClient = typeof db
