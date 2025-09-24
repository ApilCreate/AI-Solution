import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/db';
import { sql } from 'drizzle-orm';
import { requireAdminSimple } from '../../../lib/simple-auth';
import { logInfo, logError } from '../../../lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    await requireAdminSimple();

    logInfo('Starting referral source analytics query');

    // Get referral source statistics
    const sourceStats = await db
      .select({
        source: inquiries.howDidYouHear,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(inquiries)
      .where(sql`${inquiries.howDidYouHear} IS NOT NULL AND ${inquiries.howDidYouHear} != ''`)
      .groupBy(inquiries.howDidYouHear)
      .orderBy(sql`count(*) DESC`);

    logInfo('Source stats query completed', { sourceCount: sourceStats.length });

    // Get total inquiries with referral source data
    const totalWithSource = await db
      .select({
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(inquiries)
      .where(sql`${inquiries.howDidYouHear} IS NOT NULL AND ${inquiries.howDidYouHear} != ''`);

    // Get total inquiries without referral source data
    const totalWithoutSource = await db
      .select({
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(inquiries)
      .where(sql`${inquiries.howDidYouHear} IS NULL OR ${inquiries.howDidYouHear} = ''`);

    const total = totalWithSource[0]?.count || 0;
    const withoutSource = totalWithoutSource[0]?.count || 0;

    logInfo('Total counts calculated', { total, withoutSource });

    // Calculate percentages
    const statsWithPercentages = sourceStats.map(stat => ({
      source: stat.source,
      count: stat.count,
      percentage: total > 0 ? Math.round((stat.count / total) * 100) : 0
    }));

    // Add "Not specified" category if there are inquiries without source
    if (withoutSource > 0) {
      statsWithPercentages.push({
        source: 'Not specified',
        count: withoutSource,
        percentage: total > 0 ? Math.round((withoutSource / (total + withoutSource)) * 100) : 0
      });
    }

    const response = {
      stats: statsWithPercentages,
      total: total + withoutSource,
      withSource: total,
      withoutSource: withoutSource
    };

    logInfo('Referral source analytics retrieved', {
      totalSources: sourceStats.length,
      totalInquiries: total + withoutSource,
      response
    });

    return NextResponse.json(response);

  } catch (error) {
    logError('Error fetching referral source analytics', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}