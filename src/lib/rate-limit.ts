// Basic in-memory rate limiter
// TODO: Replace with Upstash Redis for production use

interface RateLimitBucket {
  count: number;
  resetTime: number;
}

const buckets = new Map<string, RateLimitBucket>();

interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
}

export function rateLimit(
  identifier: string, 
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetTime: number } {
  const { maxRequests = 10, windowMs = 60 * 1000 } = options; // 10 requests per minute default
  
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
