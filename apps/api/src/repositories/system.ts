import { desc } from 'drizzle-orm'
import { db } from '../db/client'
import { messages } from '../db/schema'

export type Message = {
  id: number
  body: string
  createdAt: string
}

const toMessage = (row: Message): Message => {
  return {
    id: row.id,
    body: row.body,
    createdAt: row.createdAt
  }
}

export const listMessages = async () => {
  const rows = await db.select().from(messages).orderBy(desc(messages.id))

  return rows.map(toMessage)
}

export const createMessage = async (body: string) => {
  const createdAt = new Date().toISOString()
  const rows = await db
    .insert(messages)
    .values({ body, createdAt })
    .returning()

  return {
    id: rows[0].id,
    body: rows[0].body,
    createdAt: rows[0].createdAt
  }
}
