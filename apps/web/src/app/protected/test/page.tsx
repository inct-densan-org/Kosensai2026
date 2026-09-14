import { redirect } from 'next/navigation'
import { cmsAdminUrl } from '@/lib/cms'

export default function ProtectedTestPage() {
  redirect(cmsAdminUrl)
}
