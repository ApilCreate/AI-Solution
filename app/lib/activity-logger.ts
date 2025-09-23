import { db, activityLogs, adminUsers } from '@/db';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';

interface ActivityLogData {
  action: string;
  description: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, any>;
  request?: NextRequest;
  adminEmail?: string;
}

export async function logActivity(data: ActivityLogData): Promise<void> {
  try {
    let adminId = '';
    
    // Get admin user info
    if (data.adminEmail) {
      const [user] = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, data.adminEmail))
        .limit(1);
      
      if (user) {
        adminId = user.id;
      }
    } else {
      // Try to get from the default admin email
      const [user] = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, 'admin@aisolutions.com'))
        .limit(1);
      
      if (user) {
        adminId = user.id;
      }
    }

    if (!adminId) {
      console.warn('Cannot log activity: Admin user not found');
      return;
    }

    // Extract IP and User Agent from request if provided
    let ipAddress = 'unknown';
    let userAgent = 'unknown';
    
    if (data.request) {
      ipAddress = data.request.headers.get('x-forwarded-for') || 
                 data.request.headers.get('x-real-ip') || 
                 'unknown';
      userAgent = data.request.headers.get('user-agent') || 'unknown';
    }

    // Insert activity log
    await db.insert(activityLogs).values({
      id: randomUUID(),
      adminId,
      action: data.action,
      description: data.description,
      targetType: data.targetType || null,
      targetId: data.targetId || null,
      metadata: data.metadata || {},
      ipAddress,
      userAgent,
    });

  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw error to avoid breaking the main operation
  }
}

// Predefined activity types for consistency
export const ACTIVITY_TYPES = {
  LOGIN: 'logged_in',
  PASSWORD_CHANGED: 'password_changed',
  INQUIRY_RESPONDED: 'inquiry_responded',
  INQUIRY_UPDATED: 'inquiry_updated',
  INQUIRY_STATUS_CHANGED: 'inquiry_status_changed',
  EVENT_CREATED: 'event_created',
  EVENT_UPDATED: 'event_updated',
  EVENT_DELETED: 'event_deleted',
  BLOG_CREATED: 'blog_created',
  BLOG_UPDATED: 'blog_updated',
  BLOG_DELETED: 'blog_deleted',
  BLOG_PUBLISHED: 'blog_published',
  ADMIN_ACCESSED_ANALYTICS: 'admin_accessed_analytics',
  ADMIN_EXPORTED_DATA: 'admin_exported_data',
} as const;