import { Hono } from 'hono'

export const systemRoute = new Hono().get('/health', c => {
  return c.json({
    ok: true,
    timestamp: new Date().toISOString()
  })
})
