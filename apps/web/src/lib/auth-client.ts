import { createAuthClient } from 'better-auth/react'
import { usernameClient } from 'better-auth/client/plugins'
import { parseWebEnv } from '@kosensai/shared'

const { NEXT_PUBLIC_API_URL } = parseWebEnv(process.env)

export const authClient = createAuthClient({
  baseURL: NEXT_PUBLIC_API_URL,
  plugins: [
    usernameClient()
  ]
})
