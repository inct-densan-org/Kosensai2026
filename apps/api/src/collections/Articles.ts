import { APIError, type CollectionBeforeValidateHook, type CollectionConfig } from 'payload'
import {
  admins,
  anyone,
  canCreateShopScopedContent,
  canManageShopScopedContent,
  committeeOrAdmins,
  publishedOrAuthenticated,
  readAssignedShopIds,
  readRole,
  shopStaffOrAbove,
} from '@/access/roles'

const articleStatusOptions = [
  { label: '下書き', value: 'draft' },
  { label: '公開予約', value: 'scheduled' },
  { label: '公開', value: 'published' },
  { label: 'アーカイブ', value: 'archived' },
]

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

const normalizePublicationDates: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  const nextData = data ?? {}

  if (nextData.status === 'published' && !nextData.publishedAt && !originalDoc?.publishedAt) {
    return {
      ...nextData,
      publishedAt: new Date().toISOString(),
    }
  }

  return nextData
}

const restrictShopToAssignedUser: CollectionBeforeValidateHook = ({ data, req }) => {
  const role = readRole(req.user)

  if (role === 'admin') {
    return data
  }

  const assignedShopIds = readAssignedShopIds(req.user)

  if ((role !== 'committee' && role !== 'shop_staff') || assignedShopIds.length === 0) {
    throw new APIError('担当屋台が設定されていません', 403, null, true)
  }

  const selectedShopId = readRelationshipId(data?.shop)

  if (!selectedShopId && assignedShopIds.length === 1) {
    return {
      ...data,
      shop: assignedShopIds[0],
    }
  }

  if (!selectedShopId || !assignedShopIds.includes(selectedShopId)) {
    throw new APIError('担当外の屋台にはお知らせを作成・編集できません', 403, null, true)
  }

  return data
}

const assignedShopFilter = ({ req }: { req: { user?: unknown } }) => {
  const role = readRole(req.user)

  if (role === 'admin') {
    return true
  }

  const assignedShopIds = readAssignedShopIds(req.user)

  if ((role !== 'committee' && role !== 'shop_staff') || assignedShopIds.length === 0) {
    return false
  }

  return {
    id: {
      in: assignedShopIds,
    },
  }
}

const publicationFields: CollectionConfig['fields'] = [
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  {
    name: 'body',
    type: 'richText',
    required: true,
  },
  {
    name: 'status',
    type: 'select',
    required: true,
    defaultValue: 'draft',
    options: articleStatusOptions,
  },
  {
    name: 'publishedAt',
    type: 'date',
    admin: {
      hidden: true,
      readOnly: true,
      description: '',
    },
  },
  {
    name: 'scheduledAt',
    type: 'date',
    admin: {
      condition: (_data, siblingData) => siblingData.status === 'scheduled',
      description: '',
    },
  },
]

const articleExcerptField = {
  name: 'excerpt',
  type: 'textarea' as const,
}

const articleTagsField = {
  name: 'tags',
  type: 'relationship' as const,
  relationTo: 'tags' as never,
  hasMany: true,
}

export const NewsArticles: CollectionConfig = {
  slug: 'news-articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'priority', 'status', 'publishedAt'],
  },
  access: {
    create: committeeOrAdmins,
    read: publishedOrAuthenticated,
    update: committeeOrAdmins,
    delete: admins,
  },
  hooks: {
    beforeValidate: [normalizePublicationDates],
  },
  fields: [
    ...publicationFields,
    articleExcerptField,
    articleTagsField,
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
      ],
    },
  ],
}

export const BlogArticles: CollectionConfig = {
  slug: 'blog-articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
  },
  access: {
    create: shopStaffOrAbove,
    read: publishedOrAuthenticated,
    update: shopStaffOrAbove,
    delete: admins,
  },
  hooks: {
    beforeValidate: [normalizePublicationDates],
  },
  fields: [
    ...publicationFields,
    articleExcerptField,
    articleTagsField,
  ],
}

export const ShopAnnouncements: CollectionConfig = {
  slug: 'shop-announcements',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'shop', 'priority', 'status', 'publishedAt'],
  },
  access: {
    create: canCreateShopScopedContent,
    read: anyone,
    update: canManageShopScopedContent,
    delete: admins,
  },
  hooks: {
    beforeValidate: [normalizePublicationDates, restrictShopToAssignedUser],
  },
  fields: [
    ...publicationFields,
    {
      name: 'priority',
      type: 'select',
      required: false,
      defaultValue: 'medium',
      options: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' },
      ],
    },
    {
      name: 'shop',
      type: 'relationship',
      relationTo: 'shops' as never,
      required: true,
      filterOptions: assignedShopFilter,
      admin: {
        description: 'このお知らせを掲載する屋台です。実行委員・屋台担当者は自分の担当屋台だけ選択できます。',
      },
    },
    articleTagsField,
  ],
}
