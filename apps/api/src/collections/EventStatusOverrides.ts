import type { CollectionConfig } from 'payload'
import { anyone, committeeOrAdmins } from '@/access/roles'

export const EventStatusOverrides: CollectionConfig = {
  slug: 'event-status-overrides',
  admin: {
    useAsTitle: 'eventCode',
    defaultColumns: ['eventCode', 'status', 'updatedAt'],
  },
  access: {
    create: committeeOrAdmins,
    read: anyone,
    update: committeeOrAdmins,
    delete: committeeOrAdmins,
  },
  fields: [
    {
      name: 'eventCode',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: '通常開催', value: 'normal' },
        { label: '時間変更', value: 'time_changed' },
        { label: '場所変更', value: 'venue_changed' },
        { label: '中止', value: 'cancelled' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
    },
  ],
}
