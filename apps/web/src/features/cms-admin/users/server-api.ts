import { cookies } from 'next/headers'
import { apiBaseUrl } from '@/lib/server-auth'
import type { UsersPageData } from './types'

const usersEndpoint = `${apiBaseUrl}/cms/admin/users`

const readErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json() as { message?: string }
    return payload.message ?? `${response.status} ${response.statusText}`
  } catch {
    return `${response.status} ${response.statusText}`
  }
}

export const getUsersPageData = async (): Promise<UsersPageData> => {
  const cookieStore = await cookies()
  const response = await fetch(usersEndpoint, {
    headers: cookieStore.toString() ? { cookie: cookieStore.toString() } : {},
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  return await response.json() as UsersPageData
}
