import nodemailer from 'nodemailer';
import { logInfo, logError, logWarn } from './logger';
import type { CreateInquiryInput } from './validations/inquiry';

// Email service types
interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Environment variables
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || GMAIL_USER;

// Create Gmail SMTP transporter
function createTransporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error('Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD
    }
  });
}

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Retry function for email sending with exponential backoff
async function retryEmailSend<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logWarn(`Email send attempt ${attempt}/${maxRetries} failed`, { 
        error: lastError.message,
        attempt,
        maxRetries 
      });
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff: wait 1s, 2s, 4s, etc.
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw lastError!;
}

export async function sendAdminResponseEmail(
  inquiry: { id: string; name: string; email: string; messageTitle: string }, 
  adminResponse: string
): Promise<EmailResult> {
  logInfo('Starting sendAdminResponseEmail', { 
    inquiryId: inquiry.id, 
    email: inquiry.email,
    name: inquiry.name,
    messageTitle: inquiry.messageTitle
  });

  // Enhanced email validation with detailed logging
  if (!inquiry.email || inquiry.email.trim() === '') {
    logError('Empty email address for admin response', { 
      inquiryId: inquiry.id,
      emailValue: inquiry.email
    });
    return { success: false, error: 'Email address is empty or undefined' };
  }

  const trimmedEmail = inquiry.email.trim();
  if (!isValidEmail(trimmedEmail)) {
    logError('Invalid email address for admin response', { 
      inquiryId: inquiry.id, 
      email: trimmedEmail,
      emailLength: trimmedEmail.length
    });
    return { success: false, error: `Invalid email address format: ${trimmedEmail}` };
  }

  if (!adminResponse.trim()) {
    logError('Admin response is empty', { inquiryId: inquiry.id });
    return { success: false, error: 'Admin response cannot be empty' };
  }

  // Log email attempt with all details
  logInfo('Attempting to send admin response email', { 
    inquiryId: inquiry.id, 
    to: trimmedEmail,
    from: FROM_EMAIL,
    gmailConfigured: !!(GMAIL_USER && GMAIL_APP_PASSWORD)
  });

  try {
    const transporter = createTransporter();
    
    const result = await retryEmailSend(async () => {
      logInfo('Making Gmail SMTP call', { 
        inquiryId: inquiry.id, 
        to: trimmedEmail 
      });
      
      const mailOptions = {
        from: FROM_EMAIL,
        to: trimmedEmail,
        subject: `Re: ${inquiry.messageTitle}`,
        html: `
          <h2>Response to your inquiry</h2>
          <p>Hi ${inquiry.name},</p>
          <p>Thank you for reaching out to us. Here's our response to your inquiry:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
            ${adminResponse.replace(/\n/g, '<br>')}
          </div>
          <p>If you have any follow-up questions, please feel free to contact us again.</p>
          <p>Best regards,<br>Your Team</p>
          <p><small>Reference ID: ${inquiry.id}</small></p>
        `
      };

      return await transporter.sendMail(mailOptions);
    });

    logInfo('Admin response email sent successfully via Gmail SMTP', { 
      inquiryId: inquiry.id,
      messageId: result.messageId,
      to: trimmedEmail
    });

    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logError('Failed to send admin response email', { 
      inquiryId: inquiry.id, 
      to: trimmedEmail,
      error: errorMessage,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      fromEmail: FROM_EMAIL
    });
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Generic email sending function
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  if (!isValidEmail(options.to)) {
    logError('Invalid email address', { email: options.to });
    return false;
  }

  logInfo('Sending email', {
    to: options.to,
    subject: options.subject,
    from: FROM_EMAIL
  });

  try {
    const transporter = createTransporter();
    
    const result = await retryEmailSend(async () => {
      const mailOptions = {
        from: FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html
      };

      return await transporter.sendMail(mailOptions);
    });

    logInfo('Email sent successfully', {
      messageId: result.messageId,
      to: options.to
    });

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logError('Failed to send email', {
      to: options.to,
      error: errorMessage
    });
    
    return false;
  }
}

export async function sendUserConfirmationEmail(inquiry: CreateInquiryInput & { id: string }): Promise<EmailResult> {
  if (!isValidEmail(inquiry.email)) {
    logError('Invalid user email address for confirmation', { 
      inquiryId: inquiry.id, 
      email: inquiry.email 
    });
    return { success: false, error: 'Invalid user email address' };
  }

  logInfo('Sending user confirmation email', {
    inquiryId: inquiry.id,
    to: inquiry.email,
    from: FROM_EMAIL
  });

  try {
    const transporter = createTransporter();
    
    const result = await retryEmailSend(async () => {
      const mailOptions = {
        from: FROM_EMAIL,
        to: inquiry.email,
        subject: 'Thank you for your inquiry',
        html: `
          <h2>Thank you for contacting us!</h2>
          <p>Hi ${inquiry.name},</p>
          <p>We've received your inquiry and will get back to you soon.</p>
          <p><strong>Your message:</strong> ${inquiry.messageTitle}</p>
          <p>We typically respond within 24-48 hours during business days.</p>
          <p>Best regards,<br>Your Team</p>
          <p><small>Reference ID: ${inquiry.id}</small></p>
        `
      };

      return await transporter.sendMail(mailOptions);
    });

    logInfo('User confirmation email sent successfully', { 
      inquiryId: inquiry.id,
      messageId: result.messageId,
      to: inquiry.email 
    });

    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logError('Failed to send user confirmation email', { 
      inquiryId: inquiry.id, 
      to: inquiry.email,
      error: errorMessage 
    });
    
    return {
      success: false,
      error: errorMessage
    };
  }
}
