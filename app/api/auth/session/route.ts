import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function GET() {
  try {
    console.log('Session API called');
    
    const session = await getServerSession(authOptions);
    console.log('Session result:', session ? 'Found' : 'Not found');
    
    if (session?.user) {
      return NextResponse.json({
        user: {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role
        }
      });
    } else {
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Session check failed:', error);
    return NextResponse.json(
      { error: 'Session check failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
