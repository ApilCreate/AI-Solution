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

// Verify admin session for API routes
export async function verifyAdminSession(request: NextRequest) {
  try {
    // For now, we'll use a simple approach - check if the request has admin headers
    // In production, you'd want proper JWT tokens or session management
    
    const adminEmail = request.headers.get('x-admin-email');
    
    if (!adminEmail) {
      // Try to get from cookie or other sources
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split(';').map(c => c.trim().split('='))
        );
        const adminUserData = cookies.adminUser;
        if (adminUserData) {
          try {
            const userData = JSON.parse(decodeURIComponent(adminUserData));
            if (userData.email) {
              const [user] = await db
                .select()
                .from(adminUsers)
                .where(eq(adminUsers.email, userData.email))
                .limit(1);
              
              if (user) {
                return { adminId: user.id, email: user.email, role: user.role };
              }
            }
          } catch (error) {
            console.error('Failed to parse admin user cookie:', error);
          }
        }
      }
      
      // Fallback: use default admin for development
      const [user] = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, 'admin@aisolutions.com'))
        .limit(1);
      
      if (user) {
        return { adminId: user.id, email: user.email, role: user.role };
      }
      
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

    return { adminId: user.id, email: user.email, role: user.role };
  } catch (error) {
    throw new Error('Unauthorized');
  }
}