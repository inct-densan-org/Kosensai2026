import { sqliteAdapter } from '@payloadcms/db-sqlite'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { BlogArticles, BlogArticleTypes, NewsArticles, ShopAnnouncements } from './collections/Articles'
import { EventStatusOverrides } from './collections/EventStatusOverrides'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Shops } from './collections/Shops'
import { Tags } from './collections/Tags'
import { ContentReactions, ReactionDefinitions, reactionEndpoints } from './collections/Reactions'

const defaultReactionDefinitions = [
  { key: 'like', emoji: '👍', sortOrder: 10 },
  { key: 'love', emoji: '❤️', sortOrder: 20 },
  { key: 'great', emoji: '👏', sortOrder: 30 },
  { key: 'funny', emoji: '😂', sortOrder: 40 },
  { key: 'warm', emoji: '😊', sortOrder: 50 },
  { key: 'excited', emoji: '🔥', sortOrder: 60 },
  { key: 'celebrate', emoji: '🎉', sortOrder: 70 },
  { key: 'useful', emoji: '💡', sortOrder: 80 },
]

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Media,
    Tags,
    ReactionDefinitions,
    ContentReactions,
    Shops,
    Users,
    BlogArticleTypes,
    NewsArticles,
    BlogArticles,
    ShopAnnouncements,
    EventStatusOverrides,
  ],
  routes: {
    admin: '/api/admin',
    api: '/api',
  },
  endpoints: reactionEndpoints,
  onInit: async (payload) => {
    const existing = await payload.find({
      collection: 'reaction-definitions',
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs > 0) return

    for (const definition of defaultReactionDefinitions) {
      await payload.create({
        collection: 'reaction-definitions',
        data: {
          ...definition,
          enabled: true,
        },
        overrideAccess: true,
      })
    }
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      UploadFeature({
        enabledCollections: ['media'],
      }),
    ],
  }),
  serverURL:
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    `http://localhost:${process.env.API_PORT || '8787'}`,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
