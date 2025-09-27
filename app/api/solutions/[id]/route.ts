import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { solutions } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await db.select().from(solutions).where(eq(solutions.id, id));

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(transformedSolution);
  } catch (error) {
    console.error('Error fetching solution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solution' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
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
    } = body;

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    const result = await db
      .update(solutions)
      .set({
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
        sortOrder,
        updatedAt: new Date()
      })
      .where(eq(solutions.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(transformedSolution);
  } catch (error) {
    console.error('Error updating solution:', error);
    return NextResponse.json(
      { error: 'Failed to update solution' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await db
      .delete(solutions)
      .where(eq(solutions.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Solution deleted successfully' });
  } catch (error) {
    console.error('Error deleting solution:', error);
    return NextResponse.json(
      { error: 'Failed to delete solution' },
      { status: 500 }
    );
  }
}
