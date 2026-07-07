import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'
import { getServerSession } from '@/lib/server-auth'

export default async function LoginPage() {
  const session = await getServerSession()

  if (session?.user.role === 'admin' || session?.user.role === 'committee') {
    redirect('/protected/test')
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-10">
      <LoginForm />
    </main>
  )
}
