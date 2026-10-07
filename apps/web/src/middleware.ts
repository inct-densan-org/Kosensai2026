import { NextResponse, type NextRequest } from 'next/server'

const protectedPathHeader = 'x-protected-path'

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const protectedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`

  requestHeaders.set(protectedPathHeader, protectedPath)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/protected/:path*'],
}
