import type { ReactNode } from 'react'
import { requireAdminSession } from '@/lib/server-auth'

export default async function ProtectedLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  await requireAdminSession()

  return children
}
