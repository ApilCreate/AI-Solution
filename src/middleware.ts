import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  
  // Only rate limit specific endpoints
  const shouldRateLimit = 
    (pathname === '/api/inquiries' && method === 'POST') ||
    pathname.startsWith('/api/auth/');
  
  if (!shouldRateLimit) {
    return NextResponse.next();
  }
  
  // Get client IP for rate limiting identifier
  const identifier = request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.headers.get('x-real-ip') || 
    request.headers.get('cf-connecting-ip') ||
    'anonymous';
  
  const { success, remaining, resetTime } = rateLimit(identifier);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.toString(),
          'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
        }
      }
    );
  }
  
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', '10');
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', resetTime.toString());
  
  return response;
}

export const config = {
  matcher: [
    '/api/inquiries',
    '/api/auth/:path*'
  ]
};
