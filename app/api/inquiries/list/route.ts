import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/db';
import { requireAdmin } from '@/lib/auth';
import { logError } from '@/lib/logger';
import { and, or, like, gte, lte, eq, desc, count } from 'drizzle-orm';
import { z } from 'zod';

const querySchema = z.object({
  q: z.string().optional(),
  reason: z.string().optional(),
  country: z.string().optional(),
  status: z.string().optional(),
  from: z.string().optional(), // ISO date string
  to: z.string().optional(),   // ISO date string
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
});

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Validate and parse query parameters
    const validationResult = querySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { q, reason, country, status, from, to, page, limit } = validationResult.data;

    // Build where conditions
    const conditions = [];

    // Full-text search across multiple fields
    if (q) {
      conditions.push(
        or(
          like(inquiries.name, `%${q}%`),
          like(inquiries.email, `%${q}%`),
          like(inquiries.company, `%${q}%`),
          like(inquiries.messageTitle, `%${q}%`),
          like(inquiries.message, `%${q}%`)
        )
      );
    }

    // Filter by reason
    if (reason) {
      conditions.push(eq(inquiries.reason, reason));
    }

    // Filter by country
    if (country) {
      conditions.push(eq(inquiries.country, country));
    }

    // Filter by status
    if (status) {
      conditions.push(eq(inquiries.status, status));
    }

    // Date range filter
    if (from) {
      try {
        const fromDate = new Date(from);
        conditions.push(gte(inquiries.createdAt, fromDate));
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid from date format' },
          { status: 400 }
        );
      }
    }

    if (to) {
      try {
        const toDate = new Date(to);
        conditions.push(lte(inquiries.createdAt, toDate));
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid to date format' },
          { status: 400 }
        );
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(inquiries)
      .where(whereClause);

    const total = totalResult.count;

    // Get paginated results
    const offset = (page - 1) * limit;
    const rows = await db
      .select()
      .from(inquiries)
      .where(whereClause)
      .orderBy(desc(inquiries.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(
      {
        rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
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

    logError('Failed to fetch inquiries', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
