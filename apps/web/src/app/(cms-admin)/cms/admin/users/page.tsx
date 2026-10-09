import { redirect } from 'next/navigation'
import { buildCmsAdminUrl } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export default async function CmsAdminUsersPage() {
  redirect(buildCmsAdminUrl('/collections/users'))
}
