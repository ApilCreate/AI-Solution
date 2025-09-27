import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db';
import { demoBookings } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { sendDemoBookingReplyEmail } from '../../../../app/lib/mail';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await db.select().from(demoBookings).where(eq(demoBookings.id, id));

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Demo booking not found' },
        { status: 404 }
      );
    }

    const booking = result[0];
    const transformedBooking = {
      id: booking.id,
      name: booking.name,
      email: booking.email,
      company: booking.company,
      solutionId: booking.solutionId,
      solutionName: booking.solutionName,
      message: booking.message,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      status: booking.status,
      adminNotes: booking.adminNotes,
      adminReply: booking.adminReply,
      repliedAt: booking.repliedAt?.toISOString(),
      scheduledAt: booking.scheduledAt?.toISOString(),
      createdAt: booking.createdAt?.toISOString(),
      updatedAt: booking.updatedAt?.toISOString()
    };

    return NextResponse.json(transformedBooking);
  } catch (error) {
    console.error('Error fetching demo booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo booking' },
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
      status,
      adminNotes,
      adminReply
    } = body;

    const result = await db
      .update(demoBookings)
      .set({
        status,
        adminNotes,
        adminReply,
        repliedAt: adminReply ? new Date() : null,
        updatedAt: new Date()
      })
      .where(eq(demoBookings.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Demo booking not found' },
        { status: 404 }
      );
    }

    const booking = result[0];
    const transformedBooking = {
      id: booking.id,
      name: booking.name,
      email: booking.email,
      company: booking.company,
      solutionId: booking.solutionId,
      solutionName: booking.solutionName,
      message: booking.message,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      status: booking.status,
      adminNotes: booking.adminNotes,
      adminReply: booking.adminReply,
      repliedAt: booking.repliedAt?.toISOString(),
      scheduledAt: booking.scheduledAt?.toISOString(),
      createdAt: booking.createdAt?.toISOString(),
      updatedAt: booking.updatedAt?.toISOString()
    };

    // Send reply email to user if adminReply is provided
    if (adminReply && adminReply.trim()) {
      try {
        await sendDemoBookingReplyEmail({
          id: booking.id,
          name: booking.name,
          email: booking.email,
          company: booking.company,
          solutionName: booking.solutionName,
          preferredDate: booking.preferredDate || '',
          preferredTime: booking.preferredTime || '',
          message: booking.message || undefined
        }, adminReply);
      } catch (emailError) {
        console.error('Failed to send reply email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(transformedBooking);
  } catch (error) {
    console.error('Error updating demo booking:', error);
    return NextResponse.json(
      { error: 'Failed to update demo booking' },
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
      .delete(demoBookings)
      .where(eq(demoBookings.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Demo booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Demo booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting demo booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete demo booking' },
      { status: 500 }
    );
  }
}
