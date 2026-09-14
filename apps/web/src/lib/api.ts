import { parseWebEnv } from '@kosensai/shared'

const { NEXT_PUBLIC_API_URL } = parseWebEnv(process.env)
export const apiBaseUrl = NEXT_PUBLIC_API_URL.replace(/\/$/, '')
