import { redirect } from 'next/navigation'
import { cmsAdminUrl } from '@/lib/cms'

export default async function LoginPage() {
  redirect(cmsAdminUrl)
}
