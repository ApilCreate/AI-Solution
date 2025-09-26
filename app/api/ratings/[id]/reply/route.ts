import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { ratings } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '../../../../../app/lib/mail';

// POST /api/ratings/[id]/reply - Send email reply to feedback
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { replyMessage } = body;

    if (!replyMessage) {
      return NextResponse.json(
        { error: 'Reply message is required' },
        { status: 400 }
      );
    }

    // Await params before using
    const { id } = await params;

    // Get the rating
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

    // Send email reply
    const emailSent = await sendEmail({
      to: rating[0].email,
      subject: `Thank you for your feedback - AI Solutions`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #00FFB7; padding-bottom: 10px;">
            Thank You for Your Feedback
          </h2>
          
          <p>Dear ${rating[0].name},</p>
          
          <p>Thank you for taking the time to share your feedback with us. We truly appreciate your input and the ${rating[0].rating}-star rating you provided.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your Feedback:</strong></p>
            <p style="font-style: italic;">"${rating[0].comment}"</p>
          </div>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Our Response:</strong></p>
            <p>${replyMessage}</p>
          </div>
          
          <p>Your feedback helps us improve our services and better serve our clients. If you have any further questions or suggestions, please don't hesitate to reach out to us.</p>
          
          <p>Best regards,<br>
          The AI Solutions Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666;">
            This is an automated response to your feedback. If you need immediate assistance, please contact us directly.
          </p>
        </div>
      `,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Update the rating with the admin reply
    const updatedRating = await db
      .update(ratings)
      .set({
        adminReply: replyMessage,
        repliedAt: new Date(),
        status: 'replied',
        updatedAt: new Date(),
      })
      .where(eq(ratings.id, id))
      .returning();

    return NextResponse.json({
      message: 'Reply sent successfully',
      rating: updatedRating[0],
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
