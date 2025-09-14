import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/db';
import { requireAdminSimple } from '@/app/lib/simple-auth';
import { logError } from '@/lib/logger';
import { count, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Require admin authentication
    await requireAdminSimple();

    // Get inquiries grouped by month for the last 6 months
    const results = await db
      .select({
        month: sql<string>`TO_CHAR(created_at, 'MON')`,
        count: count()
      })
      .from(inquiries)
      .where(sql`created_at >= NOW() - INTERVAL '6 months'`)
      .groupBy(sql`TO_CHAR(created_at, 'MON')`)
      .orderBy(sql`MIN(created_at)`);

    // If no data, return sample data for demonstration
    if (results.length === 0) {
      const sampleData = [
        { month: 'JAN', count: 7 },
        { month: 'FEB', count: 10 },
        { month: 'MAR', count: 15 },
        { month: 'APR', count: 5 },
        { month: 'MAY', count: 11 },
        { month: 'JUN', count: 8 }
      ];
      return NextResponse.json(sampleData, { status: 200 });
    }

    return NextResponse.json(results, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    logError('Failed to fetch time analytics', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
