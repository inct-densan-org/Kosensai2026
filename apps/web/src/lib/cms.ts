import { apiBaseUrl } from './api'

export const cmsAdminUrl = `${apiBaseUrl}/admin`

export const buildCmsAdminUrl = (path = '') => {
  return `${cmsAdminUrl}${path}`
}
