import type { CollectionConfig } from 'payload'
import { admins, authenticated } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'username', 'role', 'shop'],
  },
  auth: {
    loginWithUsername: true,
  },
  access: {
    create: admins,
    read: authenticated,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'CMSログイン用の運用IDです。',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'shop_staff',
      options: [
        { label: '屋台担当', value: 'shop_staff' },
        { label: '実行委員', value: 'committee' },
        { label: '管理者', value: 'admin' },
      ],
    },
    {
      name: 'shop',
      type: 'relationship',
      relationTo: 'shops' as never,
      admin: {
        condition: (_data, siblingData) => siblingData.role === 'shop_staff',
      },
    },
  ]
}
