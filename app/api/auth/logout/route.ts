import { NextRequest, NextResponse } from 'next/server';
import { logActivity } from '../../../lib/activity-logger';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const authToken = request.cookies.get('auth-token')?.value;
    
    let userEmail = 'unknown';
    let userId = 'unknown';
    
    if (authToken) {
      try {
        // Decode the token to get user info for logging
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'fallback-secret') as any;
        userEmail = decoded.email || 'unknown';
        userId = decoded.userId || 'unknown';
      } catch (error) {
        console.log('Token verification failed during logout:', error);
      }
    }

    // Log logout activity
    await logActivity({
      action: 'admin_logout',
      description: `Admin user ${userEmail} logged out`,
      targetType: 'admin_account',
      targetId: userId,
      metadata: {
        logoutTime: new Date().toISOString(),
        userAgent: request.headers.get('user-agent') || 'unknown',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      },
      request,
      adminEmail: userEmail
    });

    // Create response and clear the auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear the auth token cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}