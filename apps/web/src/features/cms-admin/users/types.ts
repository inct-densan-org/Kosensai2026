export const userRoles = ['shop_staff', 'committee', 'admin'] as const

export type UserRole = typeof userRoles[number]

export type CmsAdminUser = {
  id: string
  loginId: string
  name: string
  role: UserRole
  shopId: string | null
  createdAt: string
  updatedAt: string
}

export type ShopOption = {
  code: string
  name: string
}

export type UsersPageData = {
  users: CmsAdminUser[]
  shops: ShopOption[]
}

export type UserMutationPayload = {
  loginId: string
  name: string
  role: UserRole
  shopId: string | null
  password?: string
}
