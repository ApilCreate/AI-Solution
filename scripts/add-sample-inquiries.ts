import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { inquiries } from '../db/schema';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found in environment variables');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Sample inquiries for each missing approved reason
const sampleInquiries = [
  {
    name: 'Alex Johnson',
    email: 'alex.johnson@techhelp.com',
    company: 'TechHelp Solutions',
    phone: '+1-555-0101',
    messageTitle: 'System Integration Issue',
    message: 'We are experiencing difficulties integrating your AI solution with our existing CRM system. Could you provide technical assistance to resolve the compatibility issues? We need guidance on API configuration and data synchronization.',
    reason: 'Technical Support',
    status: 'new' as const
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@startup.io',
    company: 'InnovateCorp',
    phone: '+1-555-0202',
    messageTitle: 'Product Demonstration Request',
    message: 'Our team is interested in seeing a live demonstration of your AI platform capabilities. We would like to schedule a demo session to understand how your solution can address our business automation needs and improve our operational efficiency.',
    reason: 'Book a Demo',
    status: 'new' as const
  },
  {
    name: 'David Chen',
    email: 'david.chen@university.edu',
    company: 'Research University',
    phone: '+1-555-0303',
    messageTitle: 'Strategic Partnership Proposal',
    message: 'We are a leading research institution interested in establishing a strategic partnership for AI research and development. We would like to explore collaboration opportunities in machine learning projects and joint research initiatives.',
    reason: 'Partnerships',
    status: 'new' as const
  },
  {
    name: 'Sarah Kim',
    email: 'sarah.kim@eventscorp.com',
    company: 'EventsCorp',
    phone: '+1-555-0404',
    messageTitle: 'Conference Speaking Opportunity',
    message: 'We are organizing the AI Innovation Summit 2025 and would like to invite your team to participate as keynote speakers. The event focuses on cutting-edge AI applications and industry trends. We would also be interested in potential sponsorship opportunities.',
    reason: 'Events Inquiry',
    status: 'new' as const
  }
];

async function addSampleInquiries() {
  try {
    console.log(' Adding sample inquiries for missing approved reasons...');
    console.log('=========================================================');
    
    // Check current state
    const existingInquiries = await db.select().from(inquiries);
    const existingReasons = new Set(existingInquiries.map(inq => inq.reason));
    
    console.log('\n Current inquiry reasons:');
    const APPROVED_REASONS = ['General Inquiry', 'Technical Support', 'Book a Demo', 'Careers', 'Partnerships', 'Events Inquiry'];
    
    APPROVED_REASONS.forEach(reason => {
      const count = existingInquiries.filter(inq => inq.reason === reason).length;
      const status = count > 0 ? '' : '';
      console.log(`  $${reason}: $${count} inquiries $${status}`);
    });

    console.log('\n Adding sample inquiries...');
    
    for (const sampleInquiry of sampleInquiries) {
      if (!existingReasons.has(sampleInquiry.reason)) {
        console.log(`   Adding sample for: $${sampleInquiry.reason}`);
        await db.insert(inquiries).values(sampleInquiry);
      } else {
        console.log(`   Skipping $${sampleInquiry.reason} (already has data)`);
      }
    }
    
    console.log('\n Sample inquiries added successfully!');
    
    // Show final state
    console.log('\n Final inquiry distribution:');
    const finalInquiries = await db.select().from(inquiries);
    const finalReasonCounts: Record<string, number> = {};
    
    finalInquiries.forEach(inquiry => {
      const reason = inquiry.reason || 'No Reason';
      finalReasonCounts[reason] = (finalReasonCounts[reason] || 0) + 1;
    });
    
    APPROVED_REASONS.forEach(reason => {
      const count = finalReasonCounts[reason] || 0;
      console.log(`  $${reason}: $${count} inquiries `);
    });

    console.log(`\n All approved reasons now have sample data!`);
    console.log(`   Total inquiries: $${finalInquiries.length}`);
    
  } catch (error) {
    console.error(' Error adding sample inquiries:', error);
    throw error;
  }
}

// Run the script
addSampleInquiries()
  .then(() => {
    console.log('\n Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error(' Script failed:', error);
    process.exit(1);
  });
