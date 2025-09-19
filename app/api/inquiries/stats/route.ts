import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { inquiries } from '../../../../db/schema';
import { sql } from 'drizzle-orm';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found in environment variables');
}

const sqlConnection = neon(process.env.DATABASE_URL);
const db = drizzle(sqlConnection);

export async function GET() {
  try {
    console.log('Stats API called - simplified version');
    
    // Get all inquiries and count them by status in JavaScript
    const allInquiries = await db.select({
      status: inquiries.status
    }).from(inquiries);
    
    console.log('Fetched inquiries:', allInquiries.length);
    
    // Count statuses in JavaScript
    const counts = {
      new: 0,
      pending: 0,
      responded: 0,
      resolved: 0,
      cancelled: 0
    };
    
    allInquiries.forEach(inquiry => {
      const status = inquiry.status;
      if (status && status in counts) {
        counts[status as keyof typeof counts]++;
      }
    });
    
    console.log('Calculated counts:', counts);
    
    const response = {
      statusCounts: counts,
      total: allInquiries.length
    };
    
    console.log('Returning response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching inquiry stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch inquiry statistics', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}