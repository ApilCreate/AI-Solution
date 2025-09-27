import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { demoBookings } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { sendDemoBookingConfirmationEmail } from '../../../app/lib/mail';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Apply status filter if provided
    let result;
    if (status) {
      result = await db.select().from(demoBookings)
        .where(eq(demoBookings.status, status))
        .orderBy(desc(demoBookings.createdAt));
    } else {
      result = await db.select().from(demoBookings)
        .orderBy(desc(demoBookings.createdAt));
    }

    // Transform the data to ensure JSON serialization
    const transformedBookings = result.map((booking: any) => ({
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
    }));

    return NextResponse.json(transformedBookings);
  } catch (error) {
    console.error('Error fetching demo bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      company,
      solutionId,
      solutionName,
      message,
      preferredDate,
      preferredTime
    } = body;

    // Validate required fields
    if (!name || !email || !company || !solutionId || !solutionName) {
      return NextResponse.json(
        { error: 'Name, email, company, solution ID, and solution name are required' },
        { status: 400 }
      );
    }

    const result = await db.insert(demoBookings).values({
      name,
      email,
      company,
      solutionId,
      solutionName,
      message,
      preferredDate,
      preferredTime,
      status: 'pending'
    }).returning();

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

    // Send confirmation email to user
    try {
      await sendDemoBookingConfirmationEmail({
        id: booking.id,
        name: booking.name,
        email: booking.email,
        company: booking.company,
        solutionName: booking.solutionName,
        preferredDate: booking.preferredDate || '',
        preferredTime: booking.preferredTime || '',
        message: booking.message || undefined
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(transformedBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating demo booking:', error);
    return NextResponse.json(
      { error: 'Failed to create demo booking' },
      { status: 500 }
    );
  }
}
