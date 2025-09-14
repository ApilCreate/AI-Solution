import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      success: true,
      session,
      url: process.env.NEXTAUTH_URL,
      hasSecret: !!process.env.NEXTAUTH_SECRET
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url: process.env.NEXTAUTH_URL,
      hasSecret: !!process.env.NEXTAUTH_SECRET
    }, { status: 500 });
  }
}
