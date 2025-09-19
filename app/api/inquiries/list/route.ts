import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/db';
import { requireAdminSimple } from '@/app/lib/simple-auth';
import { logError } from '@/lib/logger';
import { desc, eq, like, gte, lte, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable auth for debugging
    // await requireAdminSimple();
    console.log('API endpoint hit: /api/inquiries/list');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const reason = searchParams.get('reason');
    const country = searchParams.get('country');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where conditions
    const whereConditions = [];

    if (status) {
      whereConditions.push(eq(inquiries.status, status));
    }

    if (reason) {
      whereConditions.push(eq(inquiries.reason, reason));
    }

    if (country) {
      whereConditions.push(eq(inquiries.country, country));
    }

    if (search) {
      // Search across multiple fields using OR condition
      whereConditions.push(
        or(
          like(inquiries.name, `%${search}%`),
          like(inquiries.email, `%${search}%`),
          like(inquiries.messageTitle, `%${search}%`),
          like(inquiries.company, `%${search}%`),
          like(inquiries.message, `%${search}%`)
        )
      );
    }

    if (startDate) {
      whereConditions.push(gte(inquiries.createdAt, new Date(startDate)));
    }

    if (endDate) {
      whereConditions.push(lte(inquiries.createdAt, new Date(endDate)));
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Execute query with all conditions
    const results = await db
      .select()
      .from(inquiries)
      .where(
        whereConditions.length > 0 
          ? whereConditions.reduce((acc, condition) => acc ? and(acc, condition) : condition)
          : undefined
      )
      .orderBy(desc(inquiries.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: inquiries.id })
      .from(inquiries)
      .where(
        whereConditions.length > 0 
          ? whereConditions.reduce((acc, condition) => acc ? and(acc, condition) : condition)
          : undefined
      );
    
    const totalCount = totalCountResult.length;

    return NextResponse.json({
      inquiries: results,
      total: totalCount,
      page,
      limit,
      hasMore: results.length === limit
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Error in /api/inquiries/list:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    logError('Failed to fetch inquiries list', { error });
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
