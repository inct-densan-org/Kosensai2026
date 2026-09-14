import type { Access } from 'payload'

type Role = 'shop_staff' | 'committee' | 'admin'

const readRole = (user: unknown) => {
  if (!user || typeof user !== 'object' || !('role' in user)) {
    return null
  }

  const role = user.role
  return typeof role === 'string' ? role as Role : null
}

export const anyone: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const admins: Access = ({ req }) => readRole(req.user) === 'admin'

export const committeeOrAdmins: Access = ({ req }) => {
  const role = readRole(req.user)
  return role === 'committee' || role === 'admin'
}

export const shopStaffOrAbove: Access = ({ req }) => Boolean(readRole(req.user))

export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) {
    return true
  }

  return {
    status: {
      equals: 'published',
    },
  }
}
