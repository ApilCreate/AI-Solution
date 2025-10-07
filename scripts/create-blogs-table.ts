import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found in environment variables');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function createBlogsTable() {
  try {
    console.log('Creating blogs table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS "blogs" (
        "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
        "title" varchar(255) NOT NULL,
        "content" text NOT NULL,
        "excerpt" text,
        "author" varchar(255) NOT NULL,
        "image" varchar(500),
        "category" varchar(100),
        "tags" jsonb DEFAULT '[]'::jsonb,
        "read_time" varchar(50),
        "status" varchar(20) DEFAULT 'draft' NOT NULL,
        "published_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
    
    console.log('Blogs table created successfully!');
    
  } catch (error) {
    console.error('Error creating blogs table:', error);
    throw error;
  }
}

// Run the migration
createBlogsTable()
  .then(() => {
    console.log('\nMigration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });