import { z } from 'zod'

export const apiEnvSchema = z.object({
  DATABASE_URL: z.string().min(1).default('file:../db/data/kosensai.sqlite'),
  PAYLOAD_SECRET: z.string().min(1),
  PAYLOAD_PUBLIC_SERVER_URL: z.string().url().default('http://localhost:8787')
})

export type ApiEnv = z.infer<typeof apiEnvSchema>

export const parseApiEnv = (env: NodeJS.ProcessEnv): ApiEnv => {
  return apiEnvSchema.parse(env)
}
