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

    // Log the login activity
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

    // Create session data
    const sessionData = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };

    // Return success with user data
    return NextResponse.json({ 
      success: true, 
      user: sessionData.user 
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
