import { NextRequest, NextResponse } from 'next/server';

// Basic in-memory rate limiter - inline implementation for middleware
interface RateLimitBucket {
  count: number;
  resetTime: number;
}

const buckets = new Map<string, RateLimitBucket>();

function rateLimit(
  identifier: string, 
  maxRequests: number = 10,
  windowMs: number = 60 * 1000 // 1 minute
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const bucket = buckets.get(identifier);
  
  // Clean up expired buckets periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    for (const [key, value] of buckets.entries()) {
      if (now > value.resetTime) {
        buckets.delete(key);
      }
    }
  }
  
  if (!bucket || now > bucket.resetTime) {
    // Create new bucket or reset expired one
    const newBucket: RateLimitBucket = {
      count: 1,
      resetTime: now + windowMs
    };
    buckets.set(identifier, newBucket);
    
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: newBucket.resetTime
    };
  }
  
  if (bucket.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: bucket.resetTime
    };
  }
  
  bucket.count++;
  
  return {
    success: true,
    remaining: maxRequests - bucket.count,
    resetTime: bucket.resetTime
  };
}

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
