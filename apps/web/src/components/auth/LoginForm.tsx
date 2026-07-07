'use client'

import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

const readErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return 'ログインに失敗しました'
}

const readReasonMessage = (reason: string | null) => {
  if (reason === 'forbidden') {
    return '実行委員または管理者アカウントでログインしてください'
  }

  if (reason === 'unauthorized') {
    return 'ログインが必要です'
  }

  return null
}

export const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(readReasonMessage(searchParams.get('reason')))
  const [pending, setPending] = useState(false)
  const { data: session, isPending: sessionPending } = authClient.useSession()

  useEffect(() => {
    if (sessionPending || !session) {
      return
    }

    const role = 'role' in session.user ? session.user.role : null

    if (role === 'admin' || role === 'committee') {
      router.replace('/protected/test')
      router.refresh()
    }
  }, [router, session, sessionPending])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      const result = await authClient.signIn.username({
        username: loginId,
        password
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      const nextSession = await authClient.getSession()

      if (nextSession.error) {
        throw new Error(nextSession.error.message)
      }

      const role = nextSession.data?.user && 'role' in nextSession.data.user ? nextSession.data.user.role : null

      if (role !== 'admin' && role !== 'committee') {
        await authClient.signOut()
        throw new Error('実行委員または管理者アカウントでログインしてください')
      }

      router.replace('/protected/test')
      router.refresh()
    } catch (nextError) {
      setError(readErrorMessage(nextError))
    } finally {
      setPending(false)
    }
  }

  const handleSignOut = async () => {
    setPending(true)
    setError(null)

    try {
      const result = await authClient.signOut()

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (nextError) {
      setError(readErrorMessage(nextError))
    } finally {
      setPending(false)
    }
  }

  if (sessionPending) {
    return (
      <section className="w-full max-w-md rounded-[28px] border border-black/10 bg-white/75 p-7 shadow-[0_20px_60px_rgba(31,28,23,0.08)] backdrop-blur-md">
        <p className="m-0 text-base text-[#1f1c17]">セッションを確認しています…</p>
      </section>
    )
  }

  if (session) {
    const role = 'role' in session.user ? session.user.role : null

    return (
      <section className="grid w-full max-w-md gap-4 rounded-[28px] border border-black/10 bg-white/75 p-7 shadow-[0_20px_60px_rgba(31,28,23,0.08)] backdrop-blur-md">
        <p className="m-0 text-base text-[#1f1c17]">現在 {session.user.name} でログインしています。</p>
        <p className="m-0 text-sm text-[#6c6256]">権限: {String(role ?? 'unknown')}</p>
        {role !== 'admin' && role !== 'committee'
          ? <p className="m-0 text-sm text-[#a31313]">実行委員以上の権限が必要です。</p>
          : null}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={pending}
          className="justify-self-start rounded-full bg-[#0d5b6d] px-5 py-3 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
            {pending ? '処理中' : 'サインアウト'}
        </button>
      </section>
    )
  }

  return (
    <section className="grid w-full max-w-md gap-5 rounded-[28px] border border-black/10 bg-white/75 p-7 shadow-[0_20px_60px_rgba(31,28,23,0.08)] backdrop-blur-md">
      <div className="grid gap-3">
        <p className="m-0 text-sm font-bold uppercase tracking-[0.08em] text-[#0d5b6d]">Admin Access</p>
        <h1 className="m-0 text-[clamp(2rem,5vw,3rem)] leading-none tracking-[-0.03em] text-[#1f1c17]">
          管理画面ログイン
        </h1>

      </div>

      <form className="grid gap-3" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-[#1f1c17] outline-none ring-0 placeholder:text-[#6c6256] focus:border-[#0d5b6d]"
          value={loginId}
          onChange={event => setLoginId(event.target.value)}
          placeholder="ログインID"
          autoComplete="username"
          minLength={3}
          required
        />
        <input
          className="w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-[#1f1c17] outline-none ring-0 placeholder:text-[#6c6256] focus:border-[#0d5b6d]"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          placeholder="パスワード"
          autoComplete="current-password"
          minLength={8}
          required
        />
        <button
          type="submit"
          disabled={pending}
          className="justify-self-start rounded-full bg-[#0d5b6d] px-5 py-3 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'ログイン中' : 'ログイン'}
        </button>
      </form>

      {error ? <p className="m-0 text-sm text-[#a31313]">{error}</p> : null}
    </section>
  )
}
