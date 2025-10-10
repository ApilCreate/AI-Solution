import { sql } from 'drizzle-orm';
import { db } from '../db';

async function createRatingsTables() {
  try {
    console.log('Creating ratings and testimonials tables...');

    // Create ratings table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ratings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        is_published BOOLEAN DEFAULT FALSE NOT NULL,
        admin_reply TEXT,
        replied_at TIMESTAMP WITH TIME ZONE,
        status VARCHAR(50) DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'replied', 'published')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // Create testimonials table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rating_id UUID NOT NULL REFERENCES ratings(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        company VARCHAR(255),
        testimonial TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        status VARCHAR(20) DEFAULT 'published' NOT NULL CHECK (status IN ('draft', 'published')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // Create indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_ratings_status ON ratings(status);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_ratings_rating ON ratings(rating);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_testimonials_rating_id ON testimonials(rating_id);
    `);

    console.log('Successfully created ratings and testimonials tables with indexes!');
    
  } catch (error) {
    console.error('Error creating ratings tables:', error);
    throw error;
  }
}

// Run the migration
createRatingsTables()
  .then(() => {
    console.log('Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
