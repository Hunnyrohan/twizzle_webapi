import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;

  const { pathname } = req.nextUrl;

  // 🔒 Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!token || role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // 🔒 User routes protection
  if (pathname.startsWith('/user')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/admin/:path*', '/user/:path*'],
};
