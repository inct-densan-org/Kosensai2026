import { serve } from '@hono/node-server'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { apiEnv } from './env'
import { db } from './db/client'
import { resolveMigrationsPath } from './db/path'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { messagesRoute } from './routes/messages'
import { systemRoute } from './routes/system'

migrate(db, {
  migrationsFolder: resolveMigrationsPath()
})

export const app = new Hono()
  .use('*',cors({
        origin: apiEnv.corsOrigin,
        credentials: true
      })
    )
  .route('/', systemRoute)
  .route('/', messagesRoute)

serve(
  {
    fetch: app.fetch,
    port: apiEnv.port
  },
  info => {
    console.log(`API server is running on http://localhost:${info.port}`)
  }
)

export type AppType = typeof app
