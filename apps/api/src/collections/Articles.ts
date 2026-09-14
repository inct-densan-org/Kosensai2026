import type { CollectionConfig } from 'payload'
import { admins, committeeOrAdmins, publishedOrAuthenticated, shopStaffOrAbove } from '@/access/roles'

const articleStatusOptions = [
  { label: '下書き', value: 'draft' },
  { label: '公開予約', value: 'scheduled' },
  { label: '公開', value: 'published' },
  { label: 'アーカイブ', value: 'archived' },
]

const publicationFields: CollectionConfig['fields'] = [
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  {
    name: 'excerpt',
    type: 'textarea',
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
  },
  {
    name: 'scheduledAt',
    type: 'date',
  },
  {
    name: 'tags',
    type: 'relationship',
    relationTo: 'tags' as never,
    hasMany: true,
  },
]

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
  fields: [
    ...publicationFields,
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
    defaultColumns: ['title', 'articleType', 'status', 'publishedAt'],
  },
  access: {
    create: shopStaffOrAbove,
    read: publishedOrAuthenticated,
    update: shopStaffOrAbove,
    delete: admins,
  },
  fields: [
    ...publicationFields,
    {
      name: 'articleType',
      type: 'select',
      required: true,
      options: [
        { label: '屋台紹介', value: 'shop-feature' },
        { label: 'レビュー', value: 'review' },
        { label: 'ハイライト', value: 'highlight' },
        { label: '舞台裏', value: 'behind-the-scenes' },
      ],
    },
    {
      name: 'coverMedia',
      type: 'upload',
      relationTo: 'media',
      displayPreview: true,
      admin: {
        allowCreate: true,
        description: 'ブログ一覧や詳細で使うカバー画像です。記事編集画面内で選択・アップロードできます。',
      },
    },
    {
      name: 'authorDisplayName',
      type: 'text',
    },
  ],
}
