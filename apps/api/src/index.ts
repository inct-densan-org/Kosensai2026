import { serve } from '@hono/node-server'
import { apiEnv } from './env'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth'
import { systemRoute } from './routes/system'

export const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}>()
  .use('*',cors({
        origin: apiEnv.corsOrigin,
        credentials: true
      })
    )
  .use('*', async (c, next) => {
    const currentSession = await auth.api.getSession({
      headers: c.req.raw.headers
    })

    c.set('user', currentSession?.user ?? null)
    c.set('session', currentSession?.session ?? null)

    await next()
  })
  .on(['GET', 'POST'], '/api/auth/*', c => auth.handler(c.req.raw))
  .route('/', systemRoute)

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
