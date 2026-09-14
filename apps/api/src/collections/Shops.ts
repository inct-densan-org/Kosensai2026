import type { CollectionConfig } from 'payload'
import { admins, publishedOrAuthenticated } from '@/access/roles'

export const Shops: CollectionConfig = {
  slug: 'shops',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'status', 'sortOrder'],
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
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'poster',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'snsUrl',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: '下書き', value: 'draft' },
        { label: '公開', value: 'published' },
        { label: '非表示', value: 'hidden' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'menuItems',
      type: 'array',
      fields: [
        {
          name: 'code',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'sortOrder',
          type: 'number',
          required: true,
          defaultValue: 0,
        },
      ],
    },
  ],
}
