import Link from 'next/link'
import type { ReactNode } from 'react'
import { requireAdminSession } from '@/lib/server-auth'

export default async function CmsAdminLayout({
  children
}: {
  children: ReactNode
}) {
  const session = await requireAdminSession()

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111827]">
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4 py-4 max-sm:w-[min(100%-20px,1180px)] max-sm:flex-col max-sm:items-start">
          <div className="grid gap-1">
            <p className="m-0 text-xs font-medium uppercase tracking-[0.12em] text-[#6b7280]">CMS Admin</p>
            <h1 className="m-0 text-base font-semibold text-[#111827]">管理者ページ</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#4b5563]">
            <span>{session.user.name}</span>
            <Link
              href="/cms/admin/users"
              className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-[#111827] transition hover:bg-[#f9fafb]"
            >
              ユーザー管理
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
