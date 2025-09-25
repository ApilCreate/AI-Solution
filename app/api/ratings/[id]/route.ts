import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { ratings, testimonials } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

// GET /api/ratings/[id] - Get a specific rating
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rating = await db
      .select()
      .from(ratings)
      .where(eq(ratings.id, id))
      .limit(1);

    if (!rating[0]) {
      return NextResponse.json(
        { error: 'Rating not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rating[0]);
  } catch (error) {
    console.error('Error fetching rating:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rating' },
      { status: 500 }
    );
  }
}

// PUT /api/ratings/[id] - Update a rating (admin reply, status, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { status, adminReply, isPublished } = body;

    const { id } = await params;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status !== undefined) {
      updateData.status = status;
    }

    if (adminReply !== undefined) {
      updateData.adminReply = adminReply;
      updateData.repliedAt = new Date();
    }

    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
    }

    const updatedRating = await db
      .update(ratings)
      .set(updateData)
      .where(eq(ratings.id, id))
      .returning();

    if (!updatedRating[0]) {
      return NextResponse.json(
        { error: 'Rating not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRating[0]);
  } catch (error) {
    console.error('Error updating rating:', error);
    return NextResponse.json(
      { error: 'Failed to update rating' },
      { status: 500 }
    );
  }
}

// DELETE /api/ratings/[id] - Delete a rating
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedRating = await db
      .delete(ratings)
      .where(eq(ratings.id, id))
      .returning();

    if (!deletedRating[0]) {
      return NextResponse.json(
        { error: 'Rating not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    return NextResponse.json(
      { error: 'Failed to delete rating' },
      { status: 500 }
    );
  }
}
