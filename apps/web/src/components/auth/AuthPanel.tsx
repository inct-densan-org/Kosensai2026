'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import { createPlaceholderEmail } from '@kosensai/shared'
import { authClient } from '@/lib/auth-client'

const readErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return '認証に失敗しました'
}

export const AuthPanel = () => {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [loginId, setLoginId] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const { data: session, isPending: sessionPending } = authClient.useSession()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setMessage(null)
    setError(null)

    try {
      if (mode === 'sign-up') {
        const result = await authClient.signUp.email({
          name,
          email: createPlaceholderEmail(loginId),
          password,
          username: loginId,
          displayUsername: name
        })

        if (result.error) {
          throw new Error(result.error.message)
        }

        setMessage('アカウントを作成しました')
      } else {
        const result = await authClient.signIn.username({
          username: loginId,
          password
        })

        if (result.error) {
          throw new Error(result.error.message)
        }

        setMessage('サインインしました')
      }

      setLoginId('')
      setPassword('')
    } catch (nextError) {
      setError(readErrorMessage(nextError))
    } finally {
      setPending(false)
    }
  }

  const handleSignOut = async () => {
    setPending(true)
    setMessage(null)
    setError(null)

    try {
      const result = await authClient.signOut()

      if (result.error) {
        throw new Error(result.error.message)
      }

      setMessage('サインアウトしました')
    } catch (nextError) {
      setError(readErrorMessage(nextError))
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="panel">
      <h2>BetterAuth</h2>
      <p className="lead">ログインIDとパスワードで認証できます。</p>

      <div className="statusCard">
        <span className="statusLabel">セッション</span>
        <strong>{sessionPending ? '確認中' : session ? 'サインイン済み' : '未サインイン'}</strong>
        <small>{session ? ('username' in session.user ? session.user.username : session.user.email) : 'ゲスト'}</small>
      </div>

      {session ? (
        <div className="form">
          <p>{session.user.name} として利用中です。</p>
          <button type="button" onClick={handleSignOut} disabled={pending}>
            {pending ? '処理中' : 'サインアウト'}
          </button>
        </div>
      ) : (
        <>
          <div className="tabRow">
            <button type="button" onClick={() => setMode('sign-in')} disabled={pending || mode === 'sign-in'}>
              ログイン
            </button>
            <button type="button" onClick={() => setMode('sign-up')} disabled={pending || mode === 'sign-up'}>
              新規登録
            </button>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            {mode === 'sign-up' ? (
              <input
                value={name}
                onChange={event => setName(event.target.value)}
                placeholder="表示名"
                autoComplete="name"
                required
              />
            ) : null}

            <input
              value={loginId}
              onChange={event => setLoginId(event.target.value)}
              placeholder="ログインID"
              autoComplete="username"
              minLength={3}
              required
            />
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="パスワード"
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
              minLength={8}
              required
            />
            <button type="submit" disabled={pending}>
              {pending ? '送信中' : mode === 'sign-up' ? '登録する' : 'ログインする'}
            </button>
          </form>
        </>
      )}

      {message ? <p>{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </section>
  )
}
