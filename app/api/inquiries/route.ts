import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/db';
import { createInquirySchema } from '../../lib/validations/inquiry';
import { logInfo, logError } from '../../lib/logger';
import { sendAdminNewInquiryEmail, sendUserConfirmationEmail } from '../../lib/mail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validationResult = createInquirySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // TODO: Verify reCAPTCHA if RECAPTCHA_SECRET exists
    // if (process.env.RECAPTCHA_SECRET && body.recaptchaToken) {
    //   const recaptchaResponse = await fetch(
    //     `https://www.google.com/recaptcha/api/siteverify`,
    //     {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //       body: `secret=${process.env.RECAPTCHA_SECRET}&response=${body.recaptchaToken}`
    //     }
    //   );
    //   const recaptchaData = await recaptchaResponse.json();
    //   if (!recaptchaData.success) {
    //     return NextResponse.json(
    //       { error: 'reCAPTCHA verification failed' },
    //       { status: 400 }
    //     );
    //   }
    // }

    // Insert the inquiry into the database
    const [newInquiry] = await db
      .insert(inquiries)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        country: validatedData.country,
        occupation: validatedData.occupation,
        reason: validatedData.reason,
        howDidYouHear: validatedData.howDidYouHear,
        messageTitle: validatedData.messageTitle,
        message: validatedData.message,
        status: 'new',
        source: 'web-form',
        tags: null,
      })
      .returning({ id: inquiries.id });

    logInfo('New inquiry created', { 
      inquiryId: newInquiry.id,
      email: validatedData.email,
      reason: validatedData.reason 
    });

    // Send notification emails (non-blocking)
    const inquiryWithId = { ...validatedData, id: newInquiry.id };
    
    // Note: Email sending is optional and won't block the response
    // Remove the await to make it truly non-blocking in production
    Promise.allSettled([
      // sendAdminNewInquiryEmail(inquiryWithId),
      // sendUserConfirmationEmail(inquiryWithId)
    ]).catch(error => {
      logError('Email sending failed', { inquiryId: newInquiry.id, error });
    });

    return NextResponse.json(
      { id: newInquiry.id },
      { status: 201 }
    );

  } catch (error) {
    logError('Failed to create inquiry', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
