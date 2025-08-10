import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

import { db } from '../db';
import { readFileSync } from 'fs';
import { join as pathJoin } from 'path';

async function runMigrations() {
  try {
    console.log('🚀 Running database migrations...');
    
    // Read the migration file
    const migrationPath = pathJoin(process.cwd(), 'db', 'migrations', '0000_new_giant_man.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    // Split into individual statements
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Found ${statements.length} migration statements`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}`);
      
      try {
        await db.execute(statement);
        console.log(`✅ Statement ${i + 1} completed`);
      } catch (error) {
        // Check if it's a "table already exists" error
        if (error instanceof Error && error.message.includes('already exists')) {
          console.log(`⚠️  Statement ${i + 1}: Table already exists, skipping`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('🎉 Migration completed successfully!');
    
    // Verify tables were created
    console.log('\n🔍 Verifying tables...');
    const result = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📊 Tables in database:');
    result.rows.forEach((table: any) => {
      console.log(`  ✅ ${table.table_name}`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations()
    .then((success) => {
      process.exit(success ? 0 : 1);
    });
}

export { runMigrations };
