import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { solutions } from '../../../../db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let query = db.select().from(solutions);

    // Apply filters
    if (status) {
      query = query.where(eq(solutions.status, status));
    }
    if (category) {
      query = query.where(eq(solutions.category, category));
    }
    if (featured === 'true') {
      query = query.where(eq(solutions.featured, true));
    }

    // Order by featured first, then sort_order, then created_at
    const result = await query.orderBy(
      desc(solutions.featured),
      solutions.sortOrder,
      desc(solutions.createdAt)
    );

    // Transform the data to match frontend expectations
    const transformedSolutions = result.map((solution: any) => ({
      id: solution.id,
      title: solution.title,
      description: solution.description,
      shortDescription: solution.short_description,
      category: solution.category,
      features: solution.features || [],
      benefits: solution.benefits || [],
      useCases: solution.use_cases || [],
      pricing: solution.pricing,
      imageUrl: solution.image_url,
      iconName: solution.icon_name,
      status: solution.status,
      featured: solution.featured,
      sortOrder: solution.sort_order,
      createdAt: solution.created_at?.toISOString(),
      updatedAt: solution.updated_at?.toISOString()
    }));

    return NextResponse.json(transformedSolutions);
  } catch (error) {
    console.error('Error fetching solutions list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solutions list' },
      { status: 500 }
    );
  }
}
