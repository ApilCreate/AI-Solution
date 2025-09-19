import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { logInfo, logError } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json();
    
    if (!testEmail) {
      return NextResponse.json(
        { error: 'testEmail is required' },
        { status: 400 }
      );
    }

    // Check Gmail SMTP configuration
    const GMAIL_USER = process.env.GMAIL_USER;
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
    const FROM_EMAIL = process.env.FROM_EMAIL || GMAIL_USER;
    
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { error: 'Gmail SMTP not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD' },
        { status: 500 }
      );
    }

    logInfo('Testing direct Gmail SMTP call', { 
      testEmail,
      fromEmail: FROM_EMAIL,
      gmailUser: GMAIL_USER
    });

    try {
      // Create Gmail SMTP transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD
        }
      });

      const mailOptions = {
        from: FROM_EMAIL,
        to: testEmail,
        subject: 'Gmail SMTP Test - Email Delivery Debug',
        html: `
          <h2>Gmail SMTP Test</h2>
          <p>This is a direct test of the Gmail SMTP to debug email delivery issues.</p>
          <p><strong>Test Email:</strong> ${testEmail}</p>
          <p><strong>From:</strong> ${FROM_EMAIL}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p>If you receive this email, the Gmail SMTP is working correctly for your email address.</p>
        `
      };

      const result = await transporter.sendMail(mailOptions);

      logInfo('Direct Gmail SMTP call successful', {
        testEmail,
        messageId: result.messageId,
        response: result.response
      });

      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        testEmail,
        response: result.response
      });

    } catch (error) {
      logError('Direct Gmail SMTP call failed', {
        testEmail,
        error: error instanceof Error ? {
          message: error.message,
          name: error.name,
          stack: error.stack
        } : String(error)
      });

      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        testEmail
      }, { status: 500 });
    }

  } catch (error) {
    logError('Test endpoint error', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}