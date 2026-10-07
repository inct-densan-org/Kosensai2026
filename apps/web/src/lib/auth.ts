import 'server-only'

import { cookies } from 'next/headers'
import { apiBaseUrl } from './api'
import { payloadTokenCookieName } from './auth-cookie'

type ProtectedRole = 'committee' | 'admin'

type AuthUser = {
  role?: unknown
}

type MeResponse = {
  user?: AuthUser | null
}

const protectedRoles = new Set<ProtectedRole>(['committee', 'admin'])

const isProtectedRole = (role: unknown): role is ProtectedRole => {
  return typeof role === 'string' && protectedRoles.has(role as ProtectedRole)
}

export const getCurrentUser = async () => {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const payloadToken = cookieStore.get(payloadTokenCookieName)?.value

  if (!cookieHeader) {
    return null
  }

  const response = await fetch(`${apiBaseUrl}/users/me`, {
    headers: {
      cookie: cookieHeader,
      ...(payloadToken ? { authorization: `Bearer ${payloadToken}` } : {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json() as MeResponse
  return data.user ?? null
}

export const canAccessProtectedPages = (user: AuthUser | null) => {
  return isProtectedRole(user?.role)
}
