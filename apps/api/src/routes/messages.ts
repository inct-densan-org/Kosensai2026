import { Hono, type Context } from 'hono'
import { listMessages, createMessage } from '../repositories/system'
import { messageInputSchema } from '../schemas/system'

const readRequestBody = async (c: Context) => {
  try {
    return await c.req.json()
  } catch {
    return null
  }
}

export const messagesRoute = new Hono()
  .get('/messages', async c => {
    const messages = await listMessages()
    return c.json({ messages })
  })
  .post('/messages', async c => {
    const result = messageInputSchema.safeParse(await readRequestBody(c))

    if (!result.success) {
      return c.json({ error: 'Invalid request' }, 400)
    }

    const message = await createMessage(result.data.body)
    return c.json({ message }, 201)
  })
