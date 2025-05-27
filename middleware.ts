import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtener el origen de la petición
  const origin = request.headers.get('origin') || '';
  console.log('[Middleware] Origen de la petición:', origin);

  // Verificar si es una petición de API
  if (request.nextUrl.pathname.startsWith('/api')) {
    console.log('[Middleware] Es una petición de API');
    
    // Crear la respuesta
    const response = NextResponse.next();
    
    // Configurar CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    // Si es una petición OPTIONS, responder inmediatamente
    if (request.method === 'OPTIONS') {
      console.log('[Middleware] Es una petición OPTIONS, respondiendo...');
      return new NextResponse(null, { status: 204 });
    }
    
    return response;
  }

  // Para rutas no-API, verificar autenticación
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');
  
  const token = request.cookies.get('token')?.value;
  console.log('[Middleware] Token presente:', !!token);
  console.log('[Middleware] Es página de auth:', isAuthPage);

  if (!token && !isAuthPage) {
    console.log('[Middleware] Redirigiendo a login...');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    console.log('[Middleware] Redirigiendo a dashboard...');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/login',
    '/register'
  ]
}; 