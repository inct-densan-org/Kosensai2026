import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

export const appName = 'kosensai2026'

export type Message = {
  id: number
  body: string
  createdAt: string
}

export type ApiDb = {
  listMessages: () => Promise<Message[]>
  createMessage: (body: string) => Promise<Message>
}

export type ApiDeps = {
  db: ApiDb
  corsOrigin?: string
}

const messageInputSchema = z.object({
  body: z.string().trim().min(1).max(500)
})

export const createApiApp = ({ db, corsOrigin }: ApiDeps) => {
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

  app.get('/health', c =>
    c.json({
      ok: true,
      timestamp: new Date().toISOString()
    })
  )

  app.get('/messages', async c => {
    const messages = await db.listMessages()
    return c.json({ messages })
  })

  app.post('/messages', zValidator('json', messageInputSchema), async c => {
    const { body } = c.req.valid('json')
    const message = await db.createMessage(body)

    return c.json({ message }, 201)
  })

  return app
}

export type ApiApp = ReturnType<typeof createApiApp>

