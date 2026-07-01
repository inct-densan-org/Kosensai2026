import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
const apiRoot = resolve(currentDirectory, '..', '..')

export const resolveDatabasePath = (databasePath: string) => {
  return resolve(apiRoot, databasePath)
}

export const resolveMigrationsPath = () => {
  return resolve(apiRoot, 'drizzle')
}
