'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { login } from './actions'

type LoginFormProps = {
  redirectTo?: string
}

const initialState = {
  error: undefined,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="h-11 w-full" disabled={pending}>
      <LogIn aria-hidden="true" />
      {pending ? 'ログイン中' : 'ログイン'}
    </Button>
  )
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction] = useActionState(login, initialState)

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo ?? ''} />
      <label className="grid gap-2 text-sm font-medium text-slate-800">
        ユーザー名
        <input
          name="username"
          type="text"
          autoComplete="username"
          className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-sky-700 focus:ring-3 focus:ring-sky-700/20"
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-800">
        パスワード
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-sky-700 focus:ring-3 focus:ring-sky-700/20"
          required
        />
      </label>
      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  )
}
