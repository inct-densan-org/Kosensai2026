import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { messagesRoute } from './routes/messages'
import { systemRoute } from './routes/system'

const buildApp = (corsOrigin?: string) => {
  const app = new Hono()

  if (corsOrigin) {
    app.use(
      '*',
      cors({
        origin: corsOrigin,
        credentials: true
      })
    )
  }

  return app.route('/', systemRoute).route('/', messagesRoute)
}

export const createApp = (corsOrigin?: string) => {
  return buildApp(corsOrigin)
}

export const app = buildApp()

export type HonoApp = typeof app
