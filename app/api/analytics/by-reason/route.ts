import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/db';
import { requireAdmin } from '@/lib/auth';
import { logError } from '@/lib/logger';
import { count } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    // Get count by reason using SQL grouping
    const results = await db
      .select({
        reason: inquiries.reason,
        count: count()
      })
      .from(inquiries)
      .groupBy(inquiries.reason)
      .orderBy(count());

    return NextResponse.json(
      results,
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

    logError('Failed to fetch reason analytics', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
