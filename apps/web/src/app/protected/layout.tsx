import type { ReactNode } from 'react'
import { requireCommitteeSession } from '@/lib/server-auth'

export default async function ProtectedLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  await requireCommitteeSession()

  return children
}
