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

// Data arrays for generating diverse sample data
const REASONS = ['General Inquiry', 'Technical Support', 'Book a Demo', 'Careers', 'Partnerships', 'Events Inquiry'];
const STATUSES = ['new', 'pending', 'responded', 'resolved', 'cancelled'];
const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands',
  'Sweden', 'Denmark', 'Norway', 'Finland', 'Australia', 'New Zealand', 'Japan', 'South Korea',
  'Singapore', 'Hong Kong', 'India', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'South Africa',
  'Israel', 'UAE', 'Saudi Arabia', 'Turkey', 'Poland', 'Czech Republic', 'Hungary', 'Romania',
  'Bulgaria', 'Croatia', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Ireland', 'Portugal',
  'Belgium', 'Austria', 'Switzerland', 'Luxembourg', 'Malta', 'Cyprus', 'Greece', 'Ukraine',
  'Thailand', 'Malaysia', 'Indonesia', 'Philippines'
];

const OCCUPATIONS = [
  'CEO', 'CTO', 'CFO', 'CMO', 'VP Engineering', 'VP Sales', 'VP Marketing', 'Product Manager',
  'Engineering Manager', 'Data Scientist', 'Software Engineer', 'DevOps Engineer', 'UX Designer',
  'Business Analyst', 'Sales Manager', 'Marketing Manager', 'HR Manager', 'Operations Manager',
  'Research Scientist', 'Professor', 'Student', 'Consultant', 'Entrepreneur', 'Founder',
  'Director', 'Principal Engineer', 'Senior Developer', 'Project Manager', 'Architect'
];

const HOW_DID_YOU_HEAR = [
  'Google Search', 'Social Media', 'Referral', 'LinkedIn', 'Conference', 'Blog Post', 'Newsletter',
  'Partner Recommendation', 'Press Release', 'YouTube', 'Podcast', 'Industry Report', 'Word of Mouth'
];

// Generate random data
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}



function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate 50 diverse sample inquiries
function generateSampleInquiries() {
  const inquiries = [];
  const names = [
    'Alex Johnson', 'Maria Rodriguez', 'David Chen', 'Sarah Kim', 'Michael Brown', 'Emma Wilson',
    'James Davis', 'Anna Garcia', 'Robert Miller', 'Lisa Anderson', 'John Taylor', 'Jennifer Moore',
    'William Jackson', 'Elizabeth Martin', 'Christopher Lee', 'Jessica White', 'Daniel Harris',
    'Ashley Clark', 'Matthew Lewis', 'Amanda Walker', 'Anthony Hall', 'Stephanie Young', 'Mark Allen',
    'Michelle King', 'Steven Wright', 'Laura Green', 'Kevin Baker', 'Rachel Adams', 'Brian Nelson',
    'Rebecca Hill', 'Jason Scott', 'Kimberly Turner', 'Eric Phillips', 'Donna Campbell', 'Ryan Parker',
    'Sharon Evans', 'Jacob Edwards', 'Helen Collins', 'Nicholas Stewart', 'Deborah Sanchez',
    'Samuel Morris', 'Cynthia Rogers', 'Patrick Reed', 'Kathleen Cook', 'Timothy Bailey', 'Amy Rivera',
    'Jonathan Cooper', 'Angela Richardson', 'Brandon Cox', 'Brenda Howard'
  ];

  const companies = [
    'TechCorp Solutions', 'InnovateLab', 'Global Dynamics', 'NextGen Systems', 'DataFlow Inc',
    'CloudFirst Technologies', 'SmartBridge Consulting', 'FutureTech Ventures', 'QuantumLeap Labs',
    'DigitalTransform Co', 'AI Innovations Group', 'CyberSecure Systems', 'DevOps Masters',
    'ScaleUp Solutions', 'Enterprise Edge', 'StartupHub', 'Research Institute', 'University Labs',
    'Healthcare Solutions', 'FinTech Pioneers', 'E-commerce Giants', 'Manufacturing Pro',
    'Education Platform', 'Non-Profit Alliance', 'Media Dynamics', 'Gaming Studio',
    'Automotive Tech', 'Aerospace Systems', 'Energy Solutions', 'Retail Innovation'
  ];

  const messageTitles = [
    'AI Integration Consultation', 'Technical Support Request', 'Partnership Opportunity',
    'Demo Scheduling Request', 'Career Opportunities Inquiry', 'Event Collaboration',
    'Product Information Request', 'Custom Solution Development', 'Enterprise Licensing',
    'Training and Education', 'API Documentation Request', 'Performance Optimization',
    'Security Assessment Needed', 'Scaling Solutions Inquiry', 'Industry-Specific Use Case',
    'Compliance Requirements', 'Migration Assistance', 'Feature Request Discussion',
    'Pricing Information', 'Implementation Timeline', 'Support Package Options',
    'Strategic Planning Session', 'Innovation Workshop', 'Proof of Concept Request',
    'System Architecture Review', 'Data Analytics Consultation', 'Cloud Migration Support'
  ];

  const messageTemplates = [
    'We are interested in implementing your AI solution for our business operations. Could you provide more information about features and pricing?',
    'Our team is evaluating different AI platforms and would like to schedule a demonstration to understand your capabilities better.',
    'We are experiencing technical difficulties with integration and need expert assistance to resolve the issues promptly.',
    'I am reaching out to explore potential partnership opportunities between our organizations in the AI space.',
    'Could you provide information about career opportunities and current openings in your engineering team?',
    'We are organizing an industry event and would like to discuss potential collaboration and speaking opportunities.',
    'Our enterprise needs a custom AI solution tailored to our specific industry requirements and compliance standards.',
    'We need technical documentation and support for implementing your API in our existing system architecture.',
    'Please provide information about your enterprise licensing options and volume pricing for large-scale deployments.',
    'We require training sessions for our development team to effectively utilize your platform and tools.'
  ];

  // Generate past 12 months date range
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, 1);

  for (let i = 0; i < 50; i++) {
    const inquiry = {
      name: names[i],
      email: `${names[i].toLowerCase().replace(' ', '.')}@${companies[i % companies.length].toLowerCase().replace(/[^a-z]/g, '')}.com`,
      company: companies[i % companies.length],
      phone: `+1-555-${String(i + 1).padStart(4, '0')}`,
      country: getRandomElement(COUNTRIES),
      occupation: getRandomElement(OCCUPATIONS),
      messageTitle: getRandomElement(messageTitles),
      message: getRandomElement(messageTemplates),
      reason: getRandomElement(REASONS),
      howDidYouHear: getRandomElement(HOW_DID_YOU_HEAR),
      status: getRandomElement(STATUSES),
      source: 'web-form',
      createdAt: getRandomDate(twelveMonthsAgo, now)
    };

    inquiries.push(inquiry);
  }

  return inquiries;
}

async function addSampleInquiries() {
  try {
    console.log('🚀 Adding 50 diverse sample inquiries...');
    console.log('=========================================');
    
    // Check current state
    const existingInquiries = await db.select().from(inquiries);
    console.log(`📊 Current inquiries in database: ${existingInquiries.length}`);
    
    // Generate 50 new sample inquiries
    const sampleInquiries = generateSampleInquiries();
    console.log(`📝 Generated ${sampleInquiries.length} new sample inquiries`);
    
    console.log('\n🔄 Adding inquiries to database...');
    
    // Insert all inquiries
    let addedCount = 0;
    for (const inquiry of sampleInquiries) {
      try {
        await db.insert(inquiries).values(inquiry);
        addedCount++;
        if (addedCount % 10 === 0) {
          console.log(`   ✅ Added ${addedCount}/${sampleInquiries.length} inquiries...`);
        }
      } catch (error) {
        console.error(`   ❌ Failed to add inquiry for ${inquiry.name}:`, error);
      }
    }
    
    console.log('\n✅ Sample inquiries added successfully!');
    
    // Show final statistics
    const finalInquiries = await db.select().from(inquiries);
    console.log('\n📈 Final Database Statistics:');
    console.log(`   Total inquiries: ${finalInquiries.length}`);
    console.log(`   New inquiries added: ${addedCount}`);
    
    // Show distribution by reason
    const reasonCounts: Record<string, number> = {};
    finalInquiries.forEach(inquiry => {
      const reason = inquiry.reason || 'No Reason';
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });
    
    console.log('\n📊 Distribution by Reason:');
    Object.entries(reasonCounts).forEach(([reason, count]) => {
      console.log(`   ${reason}: ${count} inquiries`);
    });
    
    // Show distribution by status
    const statusCounts: Record<string, number> = {};
    finalInquiries.forEach(inquiry => {
      const status = inquiry.status || 'No Status';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    console.log('\n🏷️ Distribution by Status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} inquiries`);
    });
    
    // Show distribution by country (top 10)
    const countryCounts: Record<string, number> = {};
    finalInquiries.forEach(inquiry => {
      const country = inquiry.country || 'No Country';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    
    const topCountries = Object.entries(countryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    console.log('\n🌍 Top 10 Countries:');
    topCountries.forEach(([country, count]) => {
      console.log(`   ${country}: ${count} inquiries`);
    });
    
    // Show month distribution
    const monthCounts: Record<string, number> = {};
    finalInquiries.forEach(inquiry => {
      if (inquiry.createdAt) {
        const month = inquiry.createdAt.toISOString().slice(0, 7); // YYYY-MM format
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });
    
    console.log('\n📅 Distribution by Month:');
    Object.entries(monthCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([month, count]) => {
        console.log(`   ${month}: ${count} inquiries`);
      });
    
  } catch (error) {
    console.error('❌ Error adding sample inquiries:', error);
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
