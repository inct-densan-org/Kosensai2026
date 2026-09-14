import { getPayload, type Payload } from 'payload'
import configPromise from './payload.config'

let cachedPayload: Promise<Payload> | null = null

export const payloadConfig = configPromise

export const getPayloadClient = () => {
  cachedPayload ??= getPayload({ config: configPromise })

  return cachedPayload
}
