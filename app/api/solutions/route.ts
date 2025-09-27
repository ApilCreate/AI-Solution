import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { solutions } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
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

    // Order by sort_order and created_at
    const result = await query.orderBy(solutions.sortOrder, solutions.createdAt);

    // Transform the data to ensure JSON serialization
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
    console.error('Error fetching solutions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solutions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      shortDescription,
      category,
      features = [],
      benefits = [],
      useCases = [],
      pricing,
      imageUrl,
      iconName,
      status = 'draft',
      featured = false,
      sortOrder = 0
    } = body;

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    const result = await db.insert(solutions).values({
      title,
      description,
      shortDescription,
      category,
      features,
      benefits,
      useCases,
      pricing,
      imageUrl,
      iconName,
      status,
      featured,
      sortOrder
    }).returning();

    const solution = result[0];
    const transformedSolution = {
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
    };

    return NextResponse.json(transformedSolution, { status: 201 });
  } catch (error) {
    console.error('Error creating solution:', error);
    return NextResponse.json(
      { error: 'Failed to create solution' },
      { status: 500 }
    );
  }
}
