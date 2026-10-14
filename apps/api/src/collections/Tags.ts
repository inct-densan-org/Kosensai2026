import type { CollectionConfig } from 'payload'
import { admins, anyone } from '@/access/roles'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'color', 'updatedAt'],
    hidden: ({ user }) => user?.role !== 'admin',
  },
  access: {
    create: admins,
    read: anyone,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'color',
      type: 'text',
    },
  ],
}
