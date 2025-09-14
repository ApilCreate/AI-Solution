import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/db';
import { requireAdminSimple } from '@/app/lib/simple-auth';
import { logError } from '@/lib/logger';
import { count, gte, or, eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Require admin authentication
    await requireAdminSimple();

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get total inquiries count
    const [totalResult] = await db
      .select({ count: count() })
      .from(inquiries);

    // Get inquiries from last 7 days
    const [last7Result] = await db
      .select({ count: count() })
      .from(inquiries)
      .where(gte(inquiries.createdAt, sevenDaysAgo));

    // Get pending inquiries count (status = 'new' or 'pending')
    const [pendingResult] = await db
      .select({ count: count() })
      .from(inquiries)
      .where(
        or(
          eq(inquiries.status, 'new'),
          eq(inquiries.status, 'pending')
        )
      );

    return NextResponse.json(
      {
        total: totalResult.count,
        last7: last7Result.count,
        pending: pendingResult.count
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    logError('Failed to fetch overview analytics', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
