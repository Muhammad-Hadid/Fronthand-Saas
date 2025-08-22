import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Log for debugging (remove in production)
  console.log(`[Middleware] Path: ${pathname}, Has Token: ${!!token}`);
  
  // Define protected routes
  const protectedRoutes = [
    '/Dashboard',
    '/Dashboard/(.*)',
    '/CreateStore',
    '/Addnewproduct',
    '/Allproducts', 
    '/DeleteProduct',
    '/UpdateStore',
    '/Superadmin',
    '/Superadmin/(.*)'
  ];

  // Define public routes (accessible without login)
  const publicRoutes = [
    '/',
    '/Login',
    '/Register',
    '/Superadmin/Login'
  ];

  // Check if the current path is a public route first
  const isPublicRoute = publicRoutes.includes(pathname);

  // If it's a public route, allow access
  if (isPublicRoute) {
    // If user is logged in and trying to access login/register, redirect to dashboard
    if (token && (pathname === '/Login' || pathname === '/Register')) {
      return NextResponse.redirect(new URL('/Dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.includes('(.*)')) {
      const base = route.replace('/(.*)', '');
      return pathname.startsWith(base);
    }
    return pathname === route || pathname.startsWith(route + '/');
  });

  // Additional check for Dashboard routes to be extra sure
  const isDashboardRoute = pathname === '/Dashboard' || pathname.startsWith('/Dashboard/');

  // If accessing a protected route without a token, redirect to login
  if ((isProtectedRoute || isDashboardRoute) && !token) {
    const loginUrl = new URL('/Login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Super Admin auth: if accessing superadmin without token, redirect to superadmin login
  if (!token && (pathname === '/Superadmin' || pathname.startsWith('/Superadmin/'))) {
    // Don't redirect if already on superadmin login page
    if (pathname !== '/Superadmin/Login') {
      return NextResponse.redirect(new URL('/Superadmin/Login', request.url));
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$).*)',
  ],
};
