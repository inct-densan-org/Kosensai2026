import type { CollectionConfig } from 'payload'
import { anyone, shopStaffOrAbove } from '@/access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: shopStaffOrAbove,
    read: anyone,
    update: shopStaffOrAbove,
    delete: shopStaffOrAbove,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
