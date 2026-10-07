'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiBaseUrl } from '@/lib/api'
import { getPayloadTokenMaxAge, payloadTokenCookieName } from '@/lib/auth-cookie'

type LoginState = {
  error?: string
}

type LoginResponse = {
  exp?: unknown
  token?: unknown
  user?: {
    role?: unknown
  } | null
}

type CookieOptions = {
  path?: string
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'lax' | 'strict' | 'none'
  maxAge?: number
  expires?: Date
}

const splitSetCookieHeader = (header: string) => {
  return header.split(/,(?=\s*[^;,]+=)/).map((value) => value.trim())
}

const getSetCookieHeaders = (headers: Headers) => {
  const headerWithGetSetCookie = headers as Headers & {
    getSetCookie?: () => string[]
  }

  const setCookieHeaders = headerWithGetSetCookie.getSetCookie?.()
  if (setCookieHeaders?.length) {
    return setCookieHeaders
  }

  const fallbackHeader = headers.get('set-cookie')
  return fallbackHeader ? splitSetCookieHeader(fallbackHeader) : []
}

const parseSetCookie = (setCookie: string) => {
  const [nameValue, ...attributes] = setCookie.split(';').map((part) => part.trim())
  const separatorIndex = nameValue.indexOf('=')

  if (separatorIndex < 1) {
    return null
  }

  const name = nameValue.slice(0, separatorIndex)
  const value = nameValue.slice(separatorIndex + 1)
  const options: CookieOptions = {
    path: '/',
  }

  for (const attribute of attributes) {
    const [rawKey, ...rawValueParts] = attribute.split('=')
    const key = rawKey.toLowerCase()
    const rawValue = rawValueParts.join('=')

    if (key === 'path' && rawValue) {
      options.path = rawValue
    } else if (key === 'httponly') {
      options.httpOnly = true
    } else if (key === 'secure') {
      options.secure = true
    } else if (key === 'samesite') {
      const sameSite = rawValue.toLowerCase()
      if (sameSite === 'lax' || sameSite === 'strict' || sameSite === 'none') {
        options.sameSite = sameSite
      }
    } else if (key === 'max-age') {
      const maxAge = Number(rawValue)
      if (Number.isFinite(maxAge)) {
        options.maxAge = maxAge
      }
    } else if (key === 'expires') {
      const expires = new Date(rawValue)
      if (!Number.isNaN(expires.getTime())) {
        options.expires = expires
      }
    }
  }

  return { name, value, options }
}

const syncAuthCookies = async (headers: Headers) => {
  const cookieStore = await cookies()

  for (const setCookie of getSetCookieHeaders(headers)) {
    const parsedCookie = parseSetCookie(setCookie)
    if (!parsedCookie) {
      continue
    }

    cookieStore.set(parsedCookie.name, parsedCookie.value, parsedCookie.options)
  }
}

const setPayloadTokenCookie = async (data: LoginResponse) => {
  if (typeof data.token !== 'string') {
    return
  }

  const cookieStore = await cookies()

  cookieStore.set(payloadTokenCookieName, data.token, {
    path: '/',
    httpOnly: true,
    secure: apiBaseUrl.startsWith('https://'),
    sameSite: 'lax',
    maxAge: getPayloadTokenMaxAge(data.exp),
  })
}

const getSafeInternalPath = (path: FormDataEntryValue | null) => {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
    return null
  }

  return path
}

const getFallbackPath = (user: LoginResponse['user']) => {
  return user?.role === 'admin' ? '/cms/admin/users' : '/protected/map'
}

export const login = async (_prevState: LoginState, formData: FormData): Promise<LoginState> => {
  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const redirectTo = getSafeInternalPath(formData.get('redirectTo'))

  if (!username || !password) {
    return {
      error: 'ユーザー名とパスワードを入力してください',
    }
  }

  const response = await fetch(`${apiBaseUrl}/users/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    return {
      error: 'ログインに失敗しました。入力内容を確認してください',
    }
  }

  const data = await response.json() as LoginResponse
  await syncAuthCookies(response.headers)
  await setPayloadTokenCookie(data)

  redirect(redirectTo ?? getFallbackPath(data.user))
}
