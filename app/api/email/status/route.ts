import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSimple } from '@/app/lib/simple-auth';
import { logInfo, logError } from '@/app/lib/logger';

export async function POST(request: NextRequest) {
  try {
    await requireAdminSimple();
    
    const { email, type } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Import email functions dynamically to avoid circular dependencies
    const { sendUserConfirmationEmail, sendAdminResponseEmail } = await import('@/app/lib/mail');
    
    // Test email sending
    try {
      if (type === 'response') {
        await sendAdminResponseEmail(
          {
            id: 'test-' + Date.now(),
            name: 'Test User',
            email: email,
            messageTitle: 'Test Email Delivery'
          },
          'This is a test email to verify delivery functionality. If you receive this, the email system is working correctly.'
        );
      } else {
        await sendUserConfirmationEmail({
          id: 'test-' + Date.now(),
          name: 'Test User',
          email: email,
          messageTitle: 'Test Email Delivery',
          phone: '',
          company: '',
          country: 'Test',
          occupation: '',
          reason: 'General Inquiry' as const,
          howDidYouHear: 'Other' as const,
          message: 'Test message',
          consent: true
        });
      }

      logInfo('Test email sent successfully', { 
        email, 
        type: type || 'confirmation',
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully',
        email,
        type: type || 'confirmation'
      });

    } catch (error) {
      logError('Test email failed', { 
        email, 
        type: type || 'confirmation',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        email,
        type: type || 'confirmation'
      }, { status: 500 });
    }

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    logError('Email status test failed', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get email delivery statistics
export async function GET(request: NextRequest) {
  try {
    await requireAdminSimple();

    // This is a simple endpoint to check email configuration
    const config = {
      resendConfigured: !!process.env.RESEND_API_KEY,
      adminEmail: process.env.ADMIN_EMAIL || 'Not configured',
      fromEmail: process.env.FROM_EMAIL || 'Not configured',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(config);

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}