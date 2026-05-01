import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter (for production, use Upstash Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMITS = {
  // API routes: 100 requests per minute
  api: { windowMs: 60 * 1000, max: 100 },
  // Auth routes: 5 requests per minute (prevent brute force)
  auth: { windowMs: 60 * 1000, max: 5 },
  // Webhook routes: 1000 requests per minute
  webhook: { windowMs: 60 * 1000, max: 1000 },
  // Default: 60 requests per minute
  default: { windowMs: 60 * 1000, max: 60 },
};

function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const path = request.nextUrl.pathname;
  
  return `${ip}:${path}`;
}

function getRateLimitConfig(pathname: string) {
  if (pathname.startsWith('/api/')) {
    if (pathname.includes('stripe/webhook')) return RATE_LIMITS.webhook;
    if (pathname.includes('auth')) return RATE_LIMITS.auth;
    return RATE_LIMITS.api;
  }
  return RATE_LIMITS.default;
}

export async function middleware(request: NextRequest) {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const key = getRateLimitKey(request);
  const config = getRateLimitConfig(request.nextUrl.pathname);
  const now = Date.now();

  const record = requestCounts.get(key);

  if (!record || now > record.resetTime) {
    // First request or window expired
    requestCounts.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return NextResponse.next();
  }

  if (record.count >= config.max) {
    // Rate limit exceeded
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Please try again later',
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((record.resetTime - now) / 1000)),
          'X-RateLimit-Limit': String(config.max),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // Increment counter
  record.count++;
  requestCounts.set(key, record);

  // Add rate limit headers to response
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(config.max));
  response.headers.set(
    'X-RateLimit-Remaining',
    String(config.max - record.count)
  );

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/auth/:path*',
  ],
};
