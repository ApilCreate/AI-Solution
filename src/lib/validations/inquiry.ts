import { z } from 'zod';

export const reasonOptions = [
  "General Inquiry",
  "Technical Support", 
  "Book a Demo",
  "Careers",
  "Partnerships",
  "Events Inquiry"
] as const;

export const hearOptions = [
  "Google",
  "LinkedIn", 
  "Social Media",
  "Email Marketing",
  "Referral",
  "Event",
  "Other"
] as const;

export const createInquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 characters"),
  company: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  occupation: z.string().min(1, "Occupation is required"),
  reason: z.enum(reasonOptions, {
    message: "Please select a valid reason"
  }),
  howDidYouHear: z.enum(hearOptions, {
    message: "Please select how you heard about us"
  }).optional(),
  messageTitle: z.string().min(3, "Message title must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
