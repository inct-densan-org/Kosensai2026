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

  return (
    <main className="mx-auto w-[min(960px,calc(100%-32px))] py-[72px] max-sm:w-[min(100%-20px,960px)] max-sm:py-14">
      <section className="mb-7 grid gap-4">
        <p className="m-0 text-sm font-bold uppercase tracking-[0.08em] text-[#0d5b6d]">Protected</p>
        <h1 className="m-0 text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02] tracking-[-0.03em] text-[#1f1c17]">
          管理者向けテストページ
        </h1>
        <p className="m-0 max-w-[40rem] text-[1.1rem] leading-8 text-[#6c6256]">
          このページは `admin` ロールのユーザーだけが閲覧できます。
        </p>
      </section>

      <section className="mt-[18px] rounded-3xl border border-black/10 bg-white/70 p-6 shadow-[0_20px_60px_rgba(31,28,23,0.08)] backdrop-blur-md max-sm:p-[18px]">
        <h2 className="mb-4 text-[1.1rem] text-[#1f1c17]">セッション</h2>
        <dl className="grid gap-[14px]">
          <div className="rounded-2xl border border-black/10 bg-white/75 px-4 py-[14px]">
            <dt className="mb-1.5 text-[0.92rem] text-[#6c6256]">ユーザーID</dt>
            <dd className="m-0 break-words text-[#1f1c17]">{String(session?.user.id ?? '-')}</dd>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/75 px-4 py-[14px]">
            <dt className="mb-1.5 text-[0.92rem] text-[#6c6256]">ログインID</dt>
            <dd className="m-0 break-words text-[#1f1c17]">
              {String(session?.user && 'loginId' in session.user ? session.user.loginId ?? '-' : '-')}
            </dd>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/75 px-4 py-[14px]">
            <dt className="mb-1.5 text-[0.92rem] text-[#6c6256]">名前</dt>
            <dd className="m-0 break-words text-[#1f1c17]">{String(session?.user.name ?? '-')}</dd>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/75 px-4 py-[14px]">
            <dt className="mb-1.5 text-[0.92rem] text-[#6c6256]">ロール</dt>
            <dd className="m-0 break-words text-[#1f1c17]">{String(role ?? '-')}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-[18px] rounded-3xl border border-black/10 bg-white/70 p-6 shadow-[0_20px_60px_rgba(31,28,23,0.08)] backdrop-blur-md max-sm:p-[18px]">
        <h2 className="mb-4 text-[1.1rem] text-[#1f1c17]">API 状態</h2>
        <div className="grid min-w-[220px] w-fit gap-1.5 rounded-3xl border border-black/10 bg-white/70 px-[22px] py-5 shadow-[0_20px_60px_rgba(31,28,23,0.08)] backdrop-blur-md">
          <span className="text-[#6c6256]">Health</span>
          <strong className="text-[#1f1c17]">{health?.ok ? 'OK' : error ? 'NG' : 'Loading'}</strong>
          <small className="text-[#6c6256]">{health?.timestamp ?? error ?? '読み込み中'}</small>
        </div>
      </section>
    </main>
  )
}
