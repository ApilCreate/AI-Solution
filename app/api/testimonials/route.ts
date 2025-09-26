import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { testimonials, ratings } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/testimonials - Get all published ratings as testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';

    // Get published ratings as testimonials
    const testimonialsData = await db
      .select({
        id: ratings.id,
        name: ratings.name,
        role: ratings.name, // Using name as role for now
        company: ratings.name, // Using name as company for now
        testimonial: ratings.comment,
        rating: ratings.rating,
        status: ratings.status,
        createdAt: ratings.createdAt,
        updatedAt: ratings.updatedAt,
      })
      .from(ratings)
      .where(eq(ratings.isPublished, true))
      .orderBy(desc(ratings.createdAt));

    return NextResponse.json(testimonialsData);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create a testimonial from a rating
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ratingId, role, company } = body;

    // Get the rating
    const rating = await db
      .select()
      .from(ratings)
      .where(eq(ratings.id, ratingId))
      .limit(1);

    if (!rating[0]) {
      return NextResponse.json(
        { error: 'Rating not found' },
        { status: 404 }
      );
    }

    // Create testimonial
    const newTestimonial = await db
      .insert(testimonials)
      .values({
        ratingId: rating[0].id,
        name: rating[0].name,
        role: role || 'Client',
        company: company || 'Client Company',
        testimonial: rating[0].comment,
        rating: rating[0].rating,
        status: 'published',
      })
      .returning();

    // Update the rating to mark it as published
    await db
      .update(ratings)
      .set({ 
        isPublished: true,
        status: 'published',
        updatedAt: new Date()
      })
      .where(eq(ratings.id, ratingId));

    return NextResponse.json(newTestimonial[0], { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
