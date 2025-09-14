import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

import { db } from '../db';
import { inquiries } from '../db/schema';
import { randomUUID } from 'crypto';

async function addSampleInquiries() {
  try {
    console.log('📝 Adding sample inquiries...');
    
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
      },
      {
        id: randomUUID(),
        name: 'Emily Rodriguez',
        email: 'e.rodriguez@healthtech.com',
        phone: '+1-555-0321',
        company: 'HealthTech Innovation',
        country: 'Spain',
        occupation: 'CEO',
        reason: 'ai-development',
        howDidYouHear: 'conference',
        messageTitle: 'Healthcare AI Solutions',
        message: 'Looking to develop AI-powered diagnostic tools for our healthcare platform. Need expertise in medical AI applications.',
        status: 'completed',
        tags: ['healthcare', 'ai-development', 'diagnostic'],
        source: 'web-form'
      },
      {
        id: randomUUID(),
        name: 'David Kim',
        email: 'dkim@retailcorp.kr',
        phone: '+82-10-1234-5678',
        company: 'RetailCorp Korea',
        country: 'South Korea',
        occupation: 'VP Technology',
        reason: 'consultation',
        howDidYouHear: 'linkedin',
        messageTitle: 'E-commerce AI Integration',
        message: 'We want to integrate AI recommendation systems and chatbots into our e-commerce platform to enhance customer experience.',
        status: 'pending',
        tags: ['e-commerce', 'recommendations', 'chatbot'],
        source: 'web-form'
      },
      {
        id: randomUUID(),
        name: 'Anna Petrov',
        email: 'a.petrov@financeai.ru',
        phone: '+7-495-123-4567',
        company: 'FinanceAI Solutions',
        country: 'Russia',
        occupation: 'CTO',
        reason: 'ai-implementation',
        howDidYouHear: 'google-search',
        messageTitle: 'Financial Risk Assessment AI',
        message: 'Need to implement AI models for real-time financial risk assessment and fraud detection in our banking platform.',
        status: 'new',
        tags: ['finance', 'risk-assessment', 'fraud-detection'],
        source: 'web-form'
      },
      {
        id: randomUUID(),
        name: 'Carlos Silva',
        email: 'carlos@agrotech.br',
        phone: '+55-11-9876-5432',
        company: 'AgroTech Brazil',
        country: 'Brazil',
        occupation: 'Innovation Director',
        reason: 'partnership',
        howDidYouHear: 'referral',
        messageTitle: 'Agricultural AI Solutions',
        message: 'Interested in developing AI solutions for precision agriculture, crop monitoring, and yield prediction for Brazilian farmers.',
        status: 'in-progress',
        tags: ['agriculture', 'precision-farming', 'monitoring'],
        source: 'web-form'
      },
      {
        id: randomUUID(),
        name: 'Priya Sharma',
        email: 'priya.sharma@edtech.in',
        phone: '+91-98765-43210',
        company: 'EduTech India',
        country: 'India',
        occupation: 'Product Lead',
        reason: 'ai-development',
        howDidYouHear: 'social-media',
        messageTitle: 'Educational AI Platform',
        message: 'We are building an AI-powered personalized learning platform and need expertise in natural language processing and adaptive learning algorithms.',
        status: 'new',
        tags: ['education', 'personalized-learning', 'nlp'],
        source: 'web-form'
      }
    ];

    const insertedInquiries = await db.insert(inquiries).values(sampleInquiries).returning();
    
    console.log('✅ Sample inquiries created:', insertedInquiries.length);
    console.log('\n🎉 Sample data added successfully!');
    
    return insertedInquiries;

  } catch (error) {
    console.error('❌ Adding sample data failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  addSampleInquiries()
    .then(() => {
      console.log('\n✅ Sample data complete. Check your dashboard!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Adding sample data failed:', error);
      process.exit(1);
    });
}

export { addSampleInquiries };
