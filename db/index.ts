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

// Create the connection with improved settings
const sql = neon(process.env.DATABASE_URL);

// Create the db instance with schema
export const db = drizzle(sql, { schema });

// Database retry utility function
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Log the attempt
      console.warn(`Database operation attempt ${attempt} failed:`, lastError.message);
      
      if (attempt === maxRetries) {
        console.error(`Database operation failed after ${maxRetries} attempts:`, lastError);
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

// Export the schema for use in other files
export * from './schema';
