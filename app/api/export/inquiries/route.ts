import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/db';
import { requireAdmin } from '@/lib/auth';
import { logError } from '@/lib/logger';
import { and, or, like, gte, lte, eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const querySchema = z.object({
  q: z.string().optional(),
  reason: z.string().optional(),
  country: z.string().optional(),
  status: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional()
});

function escapeCsvField(field: string | null | undefined): string {
  if (field === null || field === undefined) {
    return '';
  }
  
  // Convert to string and escape quotes
  const str = String(field);
  
  // If the field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters (same as list endpoint)
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

    const { q, reason, country, status, from, to } = validationResult.data;

    // Build where conditions (same logic as list endpoint)
    const conditions = [];

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

    if (reason) {
      conditions.push(eq(inquiries.reason, reason));
    }

    if (country) {
      conditions.push(eq(inquiries.country, country));
    }

    if (status) {
      conditions.push(eq(inquiries.status, status));
    }

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

    // Get all matching records (no pagination for export)
    const rows = await db
      .select()
      .from(inquiries)
      .where(whereClause)
      .orderBy(desc(inquiries.createdAt));

    // Generate CSV headers
    const headers = [
      'ID',
      'Created At',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Country',
      'Occupation',
      'Reason',
      'How Did You Hear',
      'Message Title',
      'Message',
      'Status',
      'Source',
      'Tags'
    ];

    // Generate CSV content
    let csvContent = headers.join(',') + '\n';

    for (const row of rows) {
      const csvRow = [
        escapeCsvField(row.id),
        escapeCsvField(row.createdAt?.toISOString()),
        escapeCsvField(row.name),
        escapeCsvField(row.email),
        escapeCsvField(row.phone),
        escapeCsvField(row.company),
        escapeCsvField(row.country),
        escapeCsvField(row.occupation),
        escapeCsvField(row.reason),
        escapeCsvField(row.howDidYouHear),
        escapeCsvField(row.messageTitle),
        escapeCsvField(row.message),
        escapeCsvField(row.status),
        escapeCsvField(row.source),
        escapeCsvField(Array.isArray(row.tags) ? row.tags.join('; ') : '')
      ];
      
      csvContent += csvRow.join(',') + '\n';
    }

    // Generate filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `inquiries-${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
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

    logError('Failed to export inquiries', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
