import { parseWebEnv } from '@kosensai/shared'
import type { AppType } from '@kosensai/api/index'
import { hc } from 'hono/client'

const { NEXT_PUBLIC_API_URL } = parseWebEnv(process.env)
const apiBaseUrl = NEXT_PUBLIC_API_URL.replace(/\/$/, '')

export const client = hc<AppType>(apiBaseUrl)
