const AUTH_PLACEHOLDER_EMAIL_DOMAIN = 'local.invalid'

export const createPlaceholderEmail = (loginId: string) => {
  return `${loginId}@${AUTH_PLACEHOLDER_EMAIL_DOMAIN}`
}
