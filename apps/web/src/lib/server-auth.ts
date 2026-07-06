import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { parseWebEnv } from '@kosensai/shared'

const { NEXT_PUBLIC_API_URL } = parseWebEnv(process.env)
export const apiBaseUrl = NEXT_PUBLIC_API_URL.replace(/\/$/, '')

type BetterAuthSessionResponse = {
  session: {
    id: string
    expiresAt: string
  }
  user: {
    id: string
    name?: string | null
    email?: string | null
    role?: string | null
    loginId?: string | null
  }
}

const buildLoginPath = (reason?: 'unauthorized' | 'forbidden') => {
  const params = new URLSearchParams()

  if (reason) {
    params.set('reason', reason)
  }

  const query = params.toString()
  return query ? `/login?${query}` : '/login'
}

export const getServerSession = async (): Promise<BetterAuthSessionResponse | null> => {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  const response = await fetch(`${apiBaseUrl}/api/auth/get-session`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: 'no-store'
  })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch session: ${response.status} ${response.statusText}`)
  }

  const payload = await response.json() as BetterAuthSessionResponse | null
  return payload
}

export const requireAdminSession = async () => {
  const session = await getServerSession()

  if (!session) {
    redirect(buildLoginPath('unauthorized'))
  }

  if (session.user.role !== 'admin') {
    redirect(buildLoginPath('forbidden'))
  }

  return session
}
