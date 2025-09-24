import { NextRequest } from 'next/server';
import { db, adminUsers } from '@/db';
import { eq } from 'drizzle-orm';

export async function requireAdminFromHeaders(request?: NextRequest) {
  try {
    // For now, we'll use a simple API key approach for the dashboard
    // In production, you'd want proper JWT tokens or session management
    
    // Get the admin email from localStorage (passed as header)
    const adminEmail = request?.headers.get('x-admin-email');
    
    if (!adminEmail || adminEmail !== 'admin@aisolutions.com') {
      throw new Error('Unauthorized');
    }

    // Verify the admin user exists in database
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, adminEmail))
      .limit(1);

    if (!user) {
      throw new Error('Unauthorized');
    }

    return user;
  } catch (error) {
    throw new Error('Unauthorized');
  }
}

// Alternative: Accept any request if we're in development mode and skip authentication
export async function requireAdminSimple() {
  try {
    // For development, we'll accept any request if the admin user exists
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, 'admin@aisolutions.com'))
      .limit(1);

    if (!user) {
      throw new Error('Admin user not found');
    }

    return user;
  } catch (error) {
    throw new Error('Unauthorized');
  }
}
