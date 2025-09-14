import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/db';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { logInfo, logError } from '@/lib/logger';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();

    // Validate the request body
    const allowedFields = ['status', 'tags', 'messageTitle', 'message'];
    const updateData: Record<string, unknown> = {};

    // Only allow specific fields to be updated
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update the inquiry
    const [updatedInquiry] = await db
      .update(inquiries)
      .set(updateData)
      .where(eq(inquiries.id, id))
      .returning();

    if (!updatedInquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    logInfo('Inquiry updated', { 
      inquiryId: id,
      updatedFields: Object.keys(updateData)
    });

    return NextResponse.json(updatedInquiry, { status: 200 });

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Try to get the id from params if available
    let inquiryId = 'unknown';
    try {
      const { id } = await params;
      inquiryId = id;
    } catch {
      // If we can't get the id, use 'unknown'
    }

    logError('Failed to update inquiry', { inquiryId, error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { id } = await params;

    // Get the inquiry
    const [inquiry] = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.id, id))
      .limit(1);

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inquiry, { status: 200 });

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Try to get the id from params if available
    let inquiryId = 'unknown';
    try {
      const { id } = await params;
      inquiryId = id;
    } catch {
      // If we can't get the id, use 'unknown'
    }

    logError('Failed to fetch inquiry', { inquiryId, error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { id } = await params;

    // Delete the inquiry
    const [deletedInquiry] = await db
      .delete(inquiries)
      .where(eq(inquiries.id, id))
      .returning();

    if (!deletedInquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    logInfo('Inquiry deleted', { inquiryId: id });

    return NextResponse.json(
      { message: 'Inquiry deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Try to get the id from params if available
    let inquiryId = 'unknown';
    try {
      const { id } = await params;
      inquiryId = id;
    } catch {
      // If we can't get the id, use 'unknown'
    }

    logError('Failed to delete inquiry', { inquiryId, error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
