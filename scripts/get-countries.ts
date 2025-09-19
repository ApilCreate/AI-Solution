import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { inquiries } from '../db/schema';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sqlConnection = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConnection);

async function getCountries() {
  try {
    const countries = await db
      .select({ 
        country: inquiries.country,
        count: sql<number>`count(*)::int`
      })
      .from(inquiries)
      .where(sql`country IS NOT NULL`)
      .groupBy(inquiries.country)
      .orderBy(sql`count(*) DESC`);
    
    console.log('Countries in database with counts:');
    countries.forEach(c => console.log(`${c.country}: ${c.count}`));
  } catch (error) {
    console.error('Error:', error);
  }
}

getCountries();