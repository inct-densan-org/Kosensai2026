import type { CollectionConfig } from 'payload'
import { admins, anyone, committeeOrAdmins } from '@/access/roles'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'color', 'updatedAt'],
  },
  access: {
    create: committeeOrAdmins,
    read: anyone,
    update: committeeOrAdmins,
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
