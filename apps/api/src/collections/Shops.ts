import type { CollectionConfig } from 'payload'
import { admins, publishedOrAuthenticated } from '@/access/roles'

export const Shops: CollectionConfig = {
  slug: 'shops',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code'],
  },
  access: {
    create: admins,
    read: publishedOrAuthenticated,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
