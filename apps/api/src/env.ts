const DEFAULT_PORT = 8787
const DEFAULT_CORS_ORIGIN = 'http://localhost:3000'
const DEFAULT_DATABASE_PATH = '../db/data/kosensai.sqlite'
const DEFAULT_BETTER_AUTH_URL = 'http://localhost:8787'

export type ApiEnv = {
  databasePath: string
  port: number
  corsOrigin: string
  betterAuthSecret: string
  betterAuthUrl: string
}

const readPort = (value: string | undefined) => {
  if (!value) {
    return DEFAULT_PORT
  }

  const port = Number(value)

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer')
  }

  return port
}

export const parseApiEnv = (env: NodeJS.ProcessEnv): ApiEnv => {
  const betterAuthSecret = env.BETTER_AUTH_SECRET?.trim()

  if (!betterAuthSecret) {
    throw new Error('BETTER_AUTH_SECRET is required')
  }

  return {
    databasePath: env.DATABASE_PATH?.trim() || DEFAULT_DATABASE_PATH,
    port: readPort(env.PORT),
    corsOrigin: env.CORS_ORIGIN?.trim() || DEFAULT_CORS_ORIGIN,
    betterAuthSecret,
    betterAuthUrl: env.BETTER_AUTH_URL?.trim() || DEFAULT_BETTER_AUTH_URL
  }
}

export const apiEnv = parseApiEnv(process.env)
