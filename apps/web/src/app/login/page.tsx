import { LoginForm } from './login-form'

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string
  }>
}

const getSafeNextPath = (next?: string) => {
  if (!next?.startsWith('/') || next.startsWith('//')) {
    return undefined
  }

  return next
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const nextPath = getSafeNextPath(params?.next)

  return (
    <main className="grid min-h-screen place-items-center bg-sky-50 px-4 py-12 text-slate-950">
      <section className="w-full max-w-sm rounded-lg border border-sky-100 bg-white p-6 shadow-sm">
        <div className="mb-6 grid gap-2">
          <p className="text-xl font-semibold text-sky-700">高専祭2026 運営ログイン</p>
        </div>
        <LoginForm redirectTo={nextPath} />
      </section>
    </main>
  )
}
