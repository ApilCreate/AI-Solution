import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db, adminUsers } from '@/db';
import { eq } from 'drizzle-orm';
import { logActivity, ACTIVITY_TYPES } from '@/app/lib/activity-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, currentPassword, newPassword } = body;

    // Validate input
    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find the admin user
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password in database
    await db
      .update(adminUsers)
      .set({ passwordHash: newPasswordHash })
      .where(eq(adminUsers.id, user.id));

    // Log the activity
    await logActivity({
      action: ACTIVITY_TYPES.PASSWORD_CHANGED,
      description: `Admin ${user.email} changed their password`,
      targetType: 'admin_account',
      targetId: user.id,
      metadata: {
        email: user.email,
        timestamp: new Date().toISOString()
      },
      request,
      adminEmail: user.email
    });

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}