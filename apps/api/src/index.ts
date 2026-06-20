import { serve } from '@hono/node-server'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { apiEnv } from './env'
import { db } from './db/client'
import { resolveMigrationsPath } from './db/path'
import { createApp } from './app'

migrate(db, {
  migrationsFolder: resolveMigrationsPath()
})

const app = createApp(apiEnv.corsOrigin)

serve(
  {
    fetch: app.fetch,
    port: apiEnv.port
  },
  info => {
    console.log(`API server is running on http://localhost:${info.port}`)
  }
)
