'use client'

import { useEffect, useState } from 'react'
import { parseWebEnv } from '@kosensai/shared'
import { authClient } from '@/lib/auth-client'

const { NEXT_PUBLIC_API_URL } = parseWebEnv(process.env)
const apiBaseUrl = NEXT_PUBLIC_API_URL.replace(/\/$/, '')

type HealthState = {
  ok: boolean
  timestamp: string
}

export default function ProtectedTestPage() {
  const { data: session } = authClient.useSession()
  const [health, setHealth] = useState<HealthState | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/health`, {
          cache: 'no-store'
        })

        if (!response.ok) {
          throw new Error(`Health check failed: ${response.status} ${response.statusText}`)
        }

        const payload = await response.json() as HealthState
        setHealth(payload)
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'Failed to load health')
      }
    }

    void loadHealth()
  }, [])

  const role = session?.user && 'role' in session.user ? session.user.role : null
  const loginId = session?.user
    ? ('loginId' in session.user ? session.user.loginId : 'username' in session.user ? session.user.username : null)
    : null

  return (
    <main className="mx-auto w-[min(960px,calc(100%-32px))] py-10 max-sm:w-[min(100%-20px,960px)] max-sm:py-6">
      <section className="mb-7 grid gap-4">
        <p className="m-0 text-[0.8rem] font-medium uppercase tracking-[0.08em] text-[#6b7280]">Protected</p>
        <h1 className="m-0 text-[clamp(1.7rem,4.2vw,2.8rem)] leading-[1.08] tracking-[-0.03em] text-[#111827]">
          実行委員向けテストページ
        </h1>
        <p className="m-0 max-w-[40rem] text-[0.98rem] leading-7 text-[#4b5563]">
          このページは `committee` または `admin` ロールのユーザーだけが閲覧できます。
        </p>
      </section>

      <section className="mt-[18px] rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm max-sm:p-[18px]">
        <h2 className="mb-4 text-[1rem] font-semibold text-[#111827]">セッション</h2>
        <dl className="grid gap-[14px]">
          <div className="rounded-md border border-[#e5e7eb] bg-white px-4 py-[14px]">
            <dt className="mb-1.5 text-[0.92rem] text-[#6b7280]">ユーザーID</dt>
            <dd className="m-0 break-words text-[#111827]">{String(session?.user.id ?? '-')}</dd>
          </div>
          <div className="rounded-md border border-[#e5e7eb] bg-white px-4 py-[14px]">
            <dt className="mb-1.5 text-[0.92rem] text-[#6b7280]">ログインID</dt>
            <dd className="m-0 break-words text-[#111827]">
              {String(loginId ?? '-')}
            </dd>
          </div>
          <div className="rounded-md border border-[#e5e7eb] bg-white px-4 py-[14px]">
            <dt className="mb-1.5 text-[0.92rem] text-[#6b7280]">名前</dt>
            <dd className="m-0 break-words text-[#111827]">{String(session?.user.name ?? '-')}</dd>
          </div>
          <div className="rounded-md border border-[#e5e7eb] bg-white px-4 py-[14px]">
            <dt className="mb-1.5 text-[0.92rem] text-[#6b7280]">ロール</dt>
            <dd className="m-0 break-words text-[#111827]">{String(role ?? '-')}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-[18px] rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm max-sm:p-[18px]">
        <h2 className="mb-4 text-[1rem] font-semibold text-[#111827]">API 状態</h2>
        <div className="grid min-w-[220px] w-fit gap-1.5 rounded-md border border-[#e5e7eb] bg-white px-[22px] py-5">
          <span className="text-[#6b7280]">Health</span>
          <strong className="text-[#111827]">{health?.ok ? 'OK' : error ? 'NG' : 'Loading'}</strong>
          <small className="text-[#6b7280]">{health?.timestamp ?? error ?? '読み込み中'}</small>
        </div>
      </section>
    </main>
  )
}
