import { db, inquiries } from '../db';

const sampleInquiries = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@techcorp.com',
    phone: '+1-555-0123',
    company: 'TechCorp Solutions',
    country: 'United States',
    occupation: 'IT Manager',
    reason: 'Technical Support',
    howDidYouHear: 'Google',
    messageTitle: 'API Integration Issues',
    message: 'We are experiencing difficulties integrating your API with our existing system.',
    status: 'new'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@startup.io',
    phone: '+1-555-0456',
    company: 'Startup Innovation',
    country: 'Canada',
    occupation: 'CEO',
    reason: 'Book a Demo',
    howDidYouHear: 'LinkedIn',
    messageTitle: 'Demo Request for AI Platform',
    message: 'I would like to schedule a demo of your AI platform.',
    status: 'new'
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.r@partners.com',
    phone: '+44-20-1234-5678',
    company: 'Global Partners Ltd',
    country: 'United Kingdom',
    occupation: 'Business Development',
    reason: 'Partnerships',
    howDidYouHear: 'Referral',
    messageTitle: 'Strategic Partnership Opportunity',
    message: 'We are interested in exploring a strategic partnership.',
    status: 'pending'
  },
  {
    name: 'David Kim',
    email: 'david.kim@events.org',
    phone: '+82-2-1234-5678',
    company: 'Events Organization',
    country: 'South Korea',
    occupation: 'Event Coordinator',
    reason: 'Events Inquiry',
    howDidYouHear: 'Social Media',
    messageTitle: 'Speaking Opportunity at Tech Conference',
    message: 'We would like to invite your team to speak at our AI conference.',
    status: 'in-progress'
  }
];

async function addSamples() {
  try {
    const result = await db.insert(inquiries).values(sampleInquiries);
    console.log('✅ Added', sampleInquiries.length, 'sample inquiries');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addSamples();