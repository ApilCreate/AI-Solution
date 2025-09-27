import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local if not already loaded
if (!process.env.DATABASE_URL) {
  config({ path: join(process.cwd(), '.env.local') });
}

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Lazy initialization of database connection
let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required. Please configure it in your Vercel environment variables.');
  }
  
  if (!_db) {
    const sql = neon(process.env.DATABASE_URL);
    _db = drizzle(sql, { schema });
  }
  
  return _db;
}

// Export a function that returns the db instance
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  }
});

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
