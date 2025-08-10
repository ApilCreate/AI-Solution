import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/db';
import { requireAdmin } from '@/lib/auth';
import { logError } from '@/lib/logger';
import { count, isNotNull, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    // Get top 10 countries by inquiry count
    const results = await db
      .select({
        country: inquiries.country,
        count: count()
      })
      .from(inquiries)
      .where(isNotNull(inquiries.country))
      .groupBy(inquiries.country)
      .orderBy(desc(count()))
      .limit(10);

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

    logError('Failed to fetch country analytics', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
