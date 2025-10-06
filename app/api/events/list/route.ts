import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { events } from '../../../../db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('🔄 Fetching events from database...');
    
    // Use Drizzle schema instead of raw SQL
    const result = await db.select().from(events).orderBy(desc(events.createdAt));
    
    console.log(`✅ Found ${result.length} events`);
    
    // Curated AI/Tech event images
    const eventImages = [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&crop=center", // Tech conference presentation
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop&crop=center", // Hackathon coding session
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center", // Team collaboration
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop&crop=center", // Workshop discussion
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop&crop=center", // Tech meetup networking
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop&crop=center", // Community event
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center", // AI technology showcase
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center", // Data analytics presentation
    ];

    // Transform data to add missing fields for frontend compatibility
    const transformedEvents = result.map((event: any, index: number) => ({
      ...event,
      time: '', // Default empty string for time
      category: 'Workshop', // Default category
      status: 'published', // Default status for existing events
      updatedAt: event.createdAt, // Use createdAt as updatedAt fallback
      bannerUrl: eventImages[index % eventImages.length], // Assign image based on index
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