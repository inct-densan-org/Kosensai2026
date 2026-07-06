import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth'
import { username } from 'better-auth/plugins'
import { createPlaceholderEmail } from '@kosensai/shared'
import { db } from '../db/client'
import * as schema from '../db/schema'
import { apiEnv } from '../env'

export const auth = betterAuth({
  baseURL: apiEnv.betterAuthUrl,
  secret: apiEnv.betterAuthSecret,
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema
  }),
  emailAndPassword: {
    enabled: true
  },
  databaseHooks: {
    user: {
      create: {
        before: async user => {
          const loginId = typeof user.username === 'string' ? user.username : null

          if (!loginId) {
            throw new Error('loginId is required')
          }

          return {
            data: {
              ...user,
              email: createPlaceholderEmail(loginId),
              emailVerified: true,
              role: typeof user.role === 'string' ? user.role : 'shop_staff'
            }
          }
        }
      }
    }
  },
  plugins: [
    username({
      usernameNormalization: false,
      displayUsernameNormalization: false,
      schema: {
        user: {
          fields: {
            username: 'loginId',
            displayUsername: 'displayUsername'
          }
        }
      }
    })
  ]
}) as unknown as ReturnType<typeof betterAuth>
