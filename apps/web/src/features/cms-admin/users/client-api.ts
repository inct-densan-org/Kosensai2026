import { parseWebEnv } from '@kosensai/shared'
import type { CmsAdminUser, UserMutationPayload } from './types'

const { NEXT_PUBLIC_API_URL } = parseWebEnv(process.env)
const usersEndpoint = `${NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/cms/admin/users`

const readErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json() as { message?: string }
    return payload.message ?? `${response.status} ${response.statusText}`
  } catch {
    return `${response.status} ${response.statusText}`
  }
}

export const createUser = async (payload: UserMutationPayload) => {
  const response = await fetch(usersEndpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload),
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  const data = await response.json() as { user: CmsAdminUser }
  return data.user
}

export const updateUser = async (userId: string, payload: Partial<UserMutationPayload>) => {
  const response = await fetch(`${usersEndpoint}/${userId}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload),
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  const data = await response.json() as { user: CmsAdminUser }
  return data.user
}

export const deleteUser = async (userId: string) => {
  const response = await fetch(`${usersEndpoint}/${userId}`, {
    method: 'DELETE',
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }
}
