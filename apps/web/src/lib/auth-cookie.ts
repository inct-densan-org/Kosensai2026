export const payloadTokenCookieName = 'payload-token'

export const getPayloadTokenMaxAge = (exp?: unknown) => {
  if (typeof exp !== 'number') {
    return 60 * 60 * 2
  }

  const maxAge = exp - Math.floor(Date.now() / 1000)
  return maxAge > 0 ? maxAge : undefined
}
