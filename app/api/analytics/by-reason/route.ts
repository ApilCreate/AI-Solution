import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/db';
import { requireAdminSimple } from '@/app/lib/simple-auth';
import { logError } from '@/app/lib/logger';
import { count, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Require admin authentication
    await requireAdminSimple();

    // Get inquiries grouped by reason
    const results = await db
      .select({
        reason: inquiries.reason,
        count: count()
      })
      .from(inquiries)
      .groupBy(inquiries.reason)
      .orderBy(sql`count DESC`);

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

    logError('Failed to fetch reason analytics', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
