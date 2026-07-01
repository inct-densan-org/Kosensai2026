import { defineConfig } from 'drizzle-kit'
import { resolveDatabasePath } from './src/db/path'
import { apiEnv } from './src/env'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: resolveDatabasePath(apiEnv.databasePath)
  }
})
