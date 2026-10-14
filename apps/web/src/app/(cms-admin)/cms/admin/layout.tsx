import type { ReactNode } from 'react'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function CmsAdminLayout({
  children
}: {
  children: ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?next=%2Fcms%2Fadmin')
  }

  if (user.role !== 'admin') {
    notFound()
  }

  return children
}
