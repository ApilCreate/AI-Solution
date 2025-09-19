import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { inquiries } from '../db/schema';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found in environment variables');
}

const sqlConnection = neon(process.env.DATABASE_URL);
const db = drizzle(sqlConnection);

async function testStatusCounts() {
  try {
    console.log('🧪 Testing status counts query...');
    console.log('====================================');
    
    // Test status counts query
    const statusCounts = await db
      .select({
        status: inquiries.status,
        count: sql<number>`count(*)::int`
      })
      .from(inquiries)
      .groupBy(inquiries.status);

    console.log('Raw status counts from database:', statusCounts);

    // Convert to object with default values for all statuses
    const counts = {
      new: 0,
      pending: 0,
      responded: 0,
      resolved: 0,
      cancelled: 0
    };

    statusCounts.forEach(({ status, count }) => {
      if (status && status in counts) {
        counts[status as keyof typeof counts] = count;
      }
    });

    console.log('Processed counts:', counts);

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(inquiries);
    
    const total = totalResult[0]?.count || 0;
    console.log('Total inquiries:', total);

    console.log('\n✅ Status counts test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing status counts:', error);
    throw error;
  }
}

// Run the test
testStatusCounts()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });