import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'
import { admins, canManageAssignedShops, publishedOrAuthenticated, readRole } from '@/access/roles'

const adminOnlyFieldAccess = ({ req }: { req: { user?: unknown } }) => readRole(req.user) === 'admin'

export const Shops: CollectionConfig = {
  slug: 'shops',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code'],
  },
  access: {
    create: admins,
    read: publishedOrAuthenticated,
    update: canManageAssignedShops,
    delete: admins,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      access: {
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      access: {
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: 'menu',
      type: 'richText',
      admin: {
        description: '屋台のお品書きや補足説明です。本文中の画像挿入はできません。',
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
}
