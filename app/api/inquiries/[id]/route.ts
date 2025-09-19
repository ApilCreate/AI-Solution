import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries, withRetry } from '@/db';
import { eq } from 'drizzle-orm';
import { requireAdminSimple } from '@/app/lib/simple-auth';
import { logInfo, logError } from '@/lib/logger';
import { sendAdminResponseEmail } from '@/app/lib/mail';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminSimple();

    const { id } = await context.params;
    const body = await request.json();

    // Validate the request body
    const allowedFields = ['status', 'tags', 'messageTitle', 'message', 'adminResponse'];
    const updateData: Record<string, unknown> = {};

    // Only allow specific fields to be updated
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // If adminResponse is being set, add respondedAt timestamp
    if (body.adminResponse && typeof body.adminResponse === 'string' && body.adminResponse.trim()) {
      updateData.respondedAt = new Date();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update the inquiry using retry logic
    const [updatedInquiry] = await withRetry(async () => {
      return await db
        .update(inquiries)
        .set(updateData)
        .where(eq(inquiries.id, id))
        .returning();
    });

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

    // Send email response if adminResponse was provided
    if (body.adminResponse && typeof body.adminResponse === 'string' && body.adminResponse.trim()) {
      logInfo('About to send admin response email', {
        inquiryId: id,
        recipientEmail: updatedInquiry.email,
        recipientName: updatedInquiry.name,
        messageTitle: updatedInquiry.messageTitle
      });

      const emailResult = await sendAdminResponseEmail(
        {
          id: updatedInquiry.id,
          name: updatedInquiry.name,
          email: updatedInquiry.email,
          messageTitle: updatedInquiry.messageTitle
        },
        body.adminResponse
      );
      
      if (emailResult.success) {
        logInfo('Admin response email sent successfully', { 
          inquiryId: id,
          messageId: emailResult.messageId,
          recipientEmail: updatedInquiry.email
        });
      } else {
        logError('Failed to send admin response email', { 
          inquiryId: id,
          error: emailResult.error,
          recipientEmail: updatedInquiry.email
        });
        // Don't fail the update if email fails - but log the detailed error
      }
    }

    return NextResponse.json(updatedInquiry, { status: 200 });

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Try to get the id from context if available
    let inquiryId = 'unknown';
    try {
      const { id } = await context.params;
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

// PATCH handler - same as PUT for partial updates
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Use the same logic as PUT for PATCH requests
  return PUT(request, context);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminSimple();

    const { id } = await context.params;

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

    // Try to get the id from context if available
    let inquiryId = 'unknown';
    try {
      const { id } = await context.params;
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminSimple();

    const { id } = await context.params;

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

    // Try to get the id from context if available
    let inquiryId = 'unknown';
    try {
      const { id } = await context.params;
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
