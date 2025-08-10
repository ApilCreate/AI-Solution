import { Resend } from 'resend';
import { logInfo, logError } from './logger';
import type { CreateInquiryInput } from './validations/inquiry';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendAdminNewInquiryEmail(inquiry: CreateInquiryInput & { id: string }) {
  if (!resend) {
    logInfo('Resend not configured - skipping admin notification email', { inquiryId: inquiry.id });
    return;
  }

  try {
    await resend.emails.send({
      from: 'no-reply@yourdomain.com', // Update with your domain
      to: 'admin@yourdomain.com', // Update with admin email
      subject: `New Inquiry: ${inquiry.messageTitle}`,
      html: `
        <h2>New Inquiry Received</h2>
        <p><strong>From:</strong> ${inquiry.name} (${inquiry.email})</p>
        <p><strong>Company:</strong> ${inquiry.company || 'N/A'}</p>
        <p><strong>Country:</strong> ${inquiry.country}</p>
        <p><strong>Occupation:</strong> ${inquiry.occupation}</p>
        <p><strong>Reason:</strong> ${inquiry.reason}</p>
        <p><strong>How they heard about us:</strong> ${inquiry.howDidYouHear || 'N/A'}</p>
        <p><strong>Phone:</strong> ${inquiry.phone}</p>
        <p><strong>Message Title:</strong> ${inquiry.messageTitle}</p>
        <p><strong>Message:</strong></p>
        <p>${inquiry.message}</p>
        <p><strong>Inquiry ID:</strong> ${inquiry.id}</p>
      `
    });

    logInfo('Admin notification email sent', { inquiryId: inquiry.id });
  } catch (error) {
    logError('Failed to send admin notification email', { 
      inquiryId: inquiry.id, 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}

export async function sendUserConfirmationEmail(inquiry: CreateInquiryInput & { id: string }) {
  if (!resend) {
    logInfo('Resend not configured - skipping user confirmation email', { inquiryId: inquiry.id });
    return;
  }

  try {
    await resend.emails.send({
      from: 'no-reply@yourdomain.com', // Update with your domain
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
    });

    logInfo('User confirmation email sent', { inquiryId: inquiry.id });
  } catch (error) {
    logError('Failed to send user confirmation email', { 
      inquiryId: inquiry.id, 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}
