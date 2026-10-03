import type { Access } from 'payload'

type Role = 'shop_staff' | 'committee' | 'admin'

const readRelationshipId = (value: unknown) => {
  if (typeof value === 'number' || typeof value === 'string') {
    return value
  }

  if (value && typeof value === 'object' && 'id' in value) {
    const id = value.id
    return typeof id === 'number' || typeof id === 'string' ? id : null
  }

  return null
}

export const readRole = (user: unknown) => {
  if (!user || typeof user !== 'object' || !('role' in user)) {
    return null
  }

  const role = user.role
  return typeof role === 'string' ? role as Role : null
}

export const readAssignedShopIds = (user: unknown) => {
  if (!user || typeof user !== 'object') {
    return []
  }

  if ('shops' in user && Array.isArray(user.shops)) {
    return user.shops.flatMap(shop => {
      const id = readRelationshipId(shop)
      return id === null ? [] : [id]
    })
  }

  if ('shop' in user) {
    const id = readRelationshipId(user.shop)
    return id === null ? [] : [id]
  }

  return []
}

export const anyone: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const admins: Access = ({ req }) => readRole(req.user) === 'admin'

export const committeeOrAdmins: Access = ({ req }) => {
  const role = readRole(req.user)
  return role === 'committee' || role === 'admin'
}

export const shopStaffOrAbove: Access = ({ req }) => Boolean(readRole(req.user))

export const canCreateShopScopedContent: Access = ({ req }) => {
  const role = readRole(req.user)

  if (role === 'admin') {
    return true
  }

  return (role === 'committee' || role === 'shop_staff') && readAssignedShopIds(req.user).length > 0
}

export const canManageShopScopedContent: Access = ({ req }) => {
  const role = readRole(req.user)

  if (role === 'admin') {
    return true
  }

  const assignedShopIds = readAssignedShopIds(req.user)

  if ((role !== 'committee' && role !== 'shop_staff') || assignedShopIds.length === 0) {
    return false
  }

  return {
    shop: {
      in: assignedShopIds,
    },
  }
}

export const canManageAssignedShops: Access = ({ req }) => {
  const role = readRole(req.user)

  if (role === 'admin') {
    return true
  }

  const assignedShopIds = readAssignedShopIds(req.user)

  if (role !== 'shop_staff' || assignedShopIds.length === 0) {
    return false
  }

  return {
    id: {
      in: assignedShopIds,
    },
  }
}

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
