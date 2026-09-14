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

import { BlogArticles, NewsArticles } from './collections/Articles'
import { EventStatusOverrides } from './collections/EventStatusOverrides'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Shops } from './collections/Shops'
import { Tags } from './collections/Tags'

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
    Shops,
    Users,
    NewsArticles,
    BlogArticles,
    EventStatusOverrides,
  ],
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
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:8787',
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
