import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { events } from '../../../db/schema';
import { logActivity, ACTIVITY_TYPES } from '@/app/lib/activity-logger';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, date, location, bannerUrl } = body;
    
    // Insert using Drizzle schema
    const [newEvent] = await db.insert(events).values({
      title,
      description,
      date,
      location,
      bannerUrl: bannerUrl || null
    }).returning();

    // Log the event creation activity
    await logActivity({
      action: ACTIVITY_TYPES.EVENT_CREATED,
      description: `Created new event: ${title}`,
      targetType: 'event',
      targetId: newEvent.id,
      metadata: {
        eventTitle: title,
        eventDate: date,
        location: location,
        hasDescription: !!description,
        hasBanner: !!bannerUrl
      },
      request
    });

    return NextResponse.json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await db.execute(sql`
      SELECT * FROM events ORDER BY created_at DESC
    `);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}