import { parseWebEnv } from '@kosensai/shared'
import type { HonoApp } from '@kosensai/api/app'
import { hc } from 'hono/client'

const { NEXT_PUBLIC_API_URL } = parseWebEnv(process.env)
const apiBaseUrl = NEXT_PUBLIC_API_URL.replace(/\/$/, '')

export const client = hc<HonoApp>(apiBaseUrl)
