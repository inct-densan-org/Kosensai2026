import { z } from 'zod'

export const messageInputSchema = z.object({
  body: z.string().trim().min(1).max(500)
})

export type MessageInput = z.infer<typeof messageInputSchema>
