import { parseWebEnv } from '@kosensai/shared'

const { NEXT_PUBLIC_API_URL } = parseWebEnv(process.env)
export const apiOrigin = NEXT_PUBLIC_API_URL.replace(/\/$/, '').replace(/\/api$/, '')

export const apiBaseUrl = `${apiOrigin}/api`
