import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local if not already loaded
if (!process.env.DATABASE_URL) {
  config({ path: join(process.cwd(), '.env.local') });
}

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('💡 Please update your .env.local file with your Neon connection string:');
  console.log('DATABASE_URL="postgresql://user:password@host/database?sslmode=require"');
  throw new Error('DATABASE_URL environment variable is required');
}

// Create the connection
const sql = neon(process.env.DATABASE_URL);

// Create the db instance with schema
export const db = drizzle(sql, { schema });

// Export the schema for use in other files
export * from './schema';
