import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { canAccessProtectedPages, getCurrentUser } from '@/lib/auth'

const protectedPathHeader = 'x-protected-path'

const getLoginPath = async () => {
  const currentPath = (await headers()).get(protectedPathHeader)

  if (!currentPath?.startsWith('/') || currentPath.startsWith('//')) {
    return '/login'
  }

  return `/login?next=${encodeURIComponent(currentPath)}`
}

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(await getLoginPath())
  }

  if (!canAccessProtectedPages(user)) {
    notFound()
  }

  return children
}
