import { NextRequest, NextResponse } from 'next/server';
import { db, activityLogs, adminUsers } from '@/db';
import { desc, eq, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const adminId = url.searchParams.get('adminId');
    const action = url.searchParams.get('action');
    const days = parseInt(url.searchParams.get('days') || '30');

    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];
    
    if (adminId) {
      conditions.push(eq(activityLogs.adminId, adminId));
    }
    
    if (action) {
      conditions.push(eq(activityLogs.action, action));
    }

    // Filter by date range (last N days)
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);
    conditions.push(gte(activityLogs.createdAt, dateThreshold));

    // Fetch activity logs with admin user details
    const logs = await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        description: activityLogs.description,
        targetType: activityLogs.targetType,
        targetId: activityLogs.targetId,
        metadata: activityLogs.metadata,
        ipAddress: activityLogs.ipAddress,
        userAgent: activityLogs.userAgent,
        createdAt: activityLogs.createdAt,
        adminEmail: adminUsers.email,
        adminRole: adminUsers.role
      })
      .from(activityLogs)
      .leftJoin(adminUsers, eq(activityLogs.adminId, adminUsers.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalLogs = await db
      .select({ count: activityLogs.id })
      .from(activityLogs)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = totalLogs.length;
    const hasMore = (page * limit) < total;

    return NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          hasMore,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Activity logs fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}