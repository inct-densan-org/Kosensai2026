import { getUsersPageData } from '@/features/cms-admin/users/server-api'
import { UserManagementPage } from '@/features/cms-admin/users/UserManagementPage'
import { requireAdminSession } from '@/lib/server-auth'

export const dynamic = 'force-dynamic'

export default async function CmsAdminUsersPage() {
  const session = await requireAdminSession()
  const initialData = await getUsersPageData()

  return <UserManagementPage initialData={initialData} currentUserId={session.user.id} />
}
