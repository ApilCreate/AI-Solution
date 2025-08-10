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

    // Get monthly count using SQL date functions
    // This works with PostgreSQL date_trunc function
    const results = await db
      .select({
        month: sql<string>`DATE_TRUNC('month', ${inquiries.createdAt})`,
        count: count()
      })
      .from(inquiries)
      .groupBy(sql`DATE_TRUNC('month', ${inquiries.createdAt})`)
      .orderBy(sql`DATE_TRUNC('month', ${inquiries.createdAt})`);

    // Transform results to the expected format
    const formattedResults = results.map(row => {
      const monthDate = new Date(row.month);
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      return {
        monthLabel: monthNames[monthDate.getMonth()],
        monthStartISO: monthDate.toISOString(),
        count: row.count
      };
    });

    return NextResponse.json(
      formattedResults,
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

    logError('Failed to fetch time series analytics', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
