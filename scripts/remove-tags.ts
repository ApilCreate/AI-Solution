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

async function removeTags() {
  try {
    console.log('🗑️ Removing tags from all inquiries...');
    console.log('=====================================');
    
    // Update all inquiries to have empty tags array
    const result = await db
      .update(inquiries)
      .set({ tags: [] })
      .returning({ id: inquiries.id });
    
    console.log(`✅ Successfully removed tags from ${result.length} inquiries`);
    
  } catch (error) {
    console.error('❌ Error removing tags:', error);
    throw error;
  }
}

// Run the script
removeTags()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });