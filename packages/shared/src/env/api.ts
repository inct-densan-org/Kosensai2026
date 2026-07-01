import { z } from 'zod'

export const apiEnvSchema = z.object({
  DATABASE_PATH: z.string().min(1).default('../db/data/kosensai.sqlite'),
  PORT: z.coerce.number().int().positive().default(8787),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000')
})

export type ApiEnv = z.infer<typeof apiEnvSchema>

export const parseApiEnv = (env: NodeJS.ProcessEnv): ApiEnv => {
  return apiEnvSchema.parse(env)
}
