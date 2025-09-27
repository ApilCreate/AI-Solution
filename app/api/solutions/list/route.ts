import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { solutions } from '../../../../db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    // Apply filters and execute query
    let result;
    if (status && category && featured === 'true') {
      result = await db.select().from(solutions)
        .where(and(
          eq(solutions.status, status),
          eq(solutions.category, category),
          eq(solutions.featured, true)
        ))
        .orderBy(desc(solutions.featured), solutions.sortOrder, desc(solutions.createdAt));
    } else if (status && category) {
      result = await db.select().from(solutions)
        .where(and(
          eq(solutions.status, status),
          eq(solutions.category, category)
        ))
        .orderBy(desc(solutions.featured), solutions.sortOrder, desc(solutions.createdAt));
    } else if (status && featured === 'true') {
      result = await db.select().from(solutions)
        .where(and(
          eq(solutions.status, status),
          eq(solutions.featured, true)
        ))
        .orderBy(desc(solutions.featured), solutions.sortOrder, desc(solutions.createdAt));
    } else if (category && featured === 'true') {
      result = await db.select().from(solutions)
        .where(and(
          eq(solutions.category, category),
          eq(solutions.featured, true)
        ))
        .orderBy(desc(solutions.featured), solutions.sortOrder, desc(solutions.createdAt));
    } else if (status) {
      result = await db.select().from(solutions)
        .where(eq(solutions.status, status))
        .orderBy(desc(solutions.featured), solutions.sortOrder, desc(solutions.createdAt));
    } else if (category) {
      result = await db.select().from(solutions)
        .where(eq(solutions.category, category))
        .orderBy(desc(solutions.featured), solutions.sortOrder, desc(solutions.createdAt));
    } else if (featured === 'true') {
      result = await db.select().from(solutions)
        .where(eq(solutions.featured, true))
        .orderBy(desc(solutions.featured), solutions.sortOrder, desc(solutions.createdAt));
    } else {
      result = await db.select().from(solutions)
        .orderBy(desc(solutions.featured), solutions.sortOrder, desc(solutions.createdAt));
    }

    // Transform the data to match frontend expectations
    const transformedSolutions = result.map((solution: any) => ({
      id: solution.id,
      title: solution.title,
      description: solution.description,
      shortDescription: (solution as any).short_description,
      category: solution.category,
      features: solution.features || [],
      benefits: solution.benefits || [],
      useCases: (solution as any).use_cases || [],
      pricing: solution.pricing,
      imageUrl: (solution as any).image_url,
      iconName: (solution as any).icon_name,
      status: solution.status,
      featured: solution.featured,
      sortOrder: (solution as any).sort_order,
      createdAt: (solution as any).created_at?.toISOString(),
      updatedAt: (solution as any).updated_at?.toISOString()
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
