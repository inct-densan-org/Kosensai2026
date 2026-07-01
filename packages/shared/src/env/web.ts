import { z } from 'zod'

export const webEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:8787')
})

export type WebEnv = z.infer<typeof webEnvSchema>

export const parseWebEnv = (env: NodeJS.ProcessEnv): WebEnv => {
  return webEnvSchema.parse(env)
}

