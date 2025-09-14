// Simple middleware - no rate limiting
import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}
