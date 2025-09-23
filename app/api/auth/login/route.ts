import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db, adminUsers, activityLogs } from '@/db';
import { eq } from 'drizzle-orm';
import { logActivity, ACTIVITY_TYPES } from '@/app/lib/activity-logger';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find user in database
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Log the login activity (temporarily disabled for debugging)
    try {
      await logActivity({
        action: ACTIVITY_TYPES.LOGIN,
        description: `Admin ${user.email} logged in successfully`,
        targetType: 'admin_account',
        targetId: user.id,
        metadata: {
          email: user.email,
          loginTime: new Date().toISOString()
        },
        request,
        adminEmail: user.email
      });
    } catch (logError) {
      console.warn('Activity logging failed:', logError);
      // Continue with login even if logging fails
    }

    // Create session data
    const sessionData = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };

    // Create response with session cookie
    const response = NextResponse.json({ 
      success: true, 
      user: sessionData.user 
    });

    // Set secure session cookie for fast authentication
    const sessionExpires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
    response.cookies.set('admin-session', JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      loginTime: Date.now(),
      expires: sessionExpires
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
