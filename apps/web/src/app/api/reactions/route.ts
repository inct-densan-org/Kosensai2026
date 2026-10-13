import { apiBaseUrl } from '@/lib/api'

const forwardRequest = async (request: Request) => {
  const requestUrl = new URL(request.url)
  const targetUrl = `${apiBaseUrl}/reactions${requestUrl.search}`
  const visitorId = request.headers.get('x-reaction-visitor-id')
  const headers = new Headers()

  if (visitorId) {
    headers.set('x-reaction-visitor-id', visitorId)
  }

  if (request.method === 'POST') {
    headers.set('content-type', 'application/json')
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === 'POST' ? await request.text() : undefined,
    cache: 'no-store',
  })

  return new Response(response.body, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') ?? 'application/json',
    },
  })
}

export const GET = forwardRequest
export const POST = forwardRequest
