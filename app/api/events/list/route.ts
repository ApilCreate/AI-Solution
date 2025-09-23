import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('🔄 Fetching events from database...');
    
    const result = await db.execute(sql`
      SELECT * FROM events ORDER BY created_at DESC
    `);
    
    console.log(`✅ Found ${result.rows.length} events`);
    
    // Transform data to add missing fields for frontend compatibility
    const transformedEvents = result.rows.map((event: any) => ({
      ...event,
      time: '', // Default empty string for time
      category: 'Workshop', // Default category
      status: 'published', // Default status for existing events
      updatedAt: event.created_at, // Use created_at as updatedAt fallback
    }));

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}