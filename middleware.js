import { NextResponse } from 'next/server'

export function middleware(request) {
  // Solo aplicar a rutas de API
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const userId = request.headers.get('x-user-id')
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }

  // Agregar userId a los headers para que esté disponible en los handlers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', userId)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: '/api/:path*',
} 