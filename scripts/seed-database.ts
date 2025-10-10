import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

import { db } from '../db';
import { adminUsers, inquiries } from '../db/schema';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Generate password hash for Admin@123
    const passwordHash = await bcrypt.hash('Admin@123', 12);

    // Insert admin user
    console.log('Creating admin user...');
    const adminUser = await db.insert(adminUsers).values({
      id: randomUUID(),
      email: 'admin@aisolutions.com',
      passwordHash: passwordHash,
      role: 'admin',
    }).returning();

    console.log('Admin user created:', adminUser[0]);

    // Insert sample inquiries for testing
    console.log('Creating sample inquiries...');
    
    const sampleInquiries = [
      {
        id: randomUUID(),
        name: 'John Smith',
        email: 'john.smith@techcorp.com',
        phone: '+1-555-0123',
        company: 'TechCorp Solutions',
        country: 'United States',
        occupation: 'CTO',
        reason: 'ai-implementation',
        howDidYouHear: 'google-search',
        messageTitle: 'AI Implementation for Enterprise',
        message: 'We are looking to implement AI solutions across our enterprise infrastructure. Would like to discuss custom AI models for our business processes.',
        status: 'new',
        tags: ['enterprise', 'custom-ai', 'high-priority'],
        source: 'web-form'
      },
      {
        id: randomUUID(),
        name: 'Sarah Johnson',
        email: 'sarah.j@startupinc.io',
        phone: '+1-555-0456',
        company: 'StartupInc',
        country: 'Canada',
        occupation: 'Product Manager',
        reason: 'consultation',
        howDidYouHear: 'social-media',
        messageTitle: 'AI Strategy Consultation',
        message: 'Our startup is in the fintech space and we need guidance on incorporating AI into our product roadmap. Looking for strategic consultation.',
        status: 'in-progress',
        tags: ['consultation', 'fintech', 'startup'],
        source: 'web-form'
      },
      {
        id: randomUUID(),
        name: 'Michael Chen',
        email: 'mchen@innovate.edu',
        phone: '+1-555-0789',
        company: 'Innovate University',
        country: 'United Kingdom',
        occupation: 'Research Director',
        reason: 'partnership',
        howDidYouHear: 'referral',
        messageTitle: 'Research Partnership Opportunity',
        message: 'We are interested in establishing a research partnership focused on machine learning applications in education technology.',
        status: 'new',
        tags: ['research', 'education', 'partnership'],
        source: 'web-form'
      }
    ];

    const insertedInquiries = await db.insert(inquiries).values(sampleInquiries).returning();
    
    console.log('Sample inquiries created:', insertedInquiries.length);

    console.log('\nDatabase seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- Admin users: 1`);
    console.log(`- Sample inquiries: ${insertedInquiries.length}`);
    
    return {
      adminUser: adminUser[0],
      inquiries: insertedInquiries
    };

  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\nSeeding complete. You can now run "npm run db:studio" to view your data.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nSeeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
