import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

import { db } from '../db';

async function testDatabaseConnection() {
  try {
    console.log('🔗 Testing database connection...');
    
    // Test basic connection with a simple query
    const result = await db.execute('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    console.log('PostgreSQL version:', result.rows[0].pg_version);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Make sure your DATABASE_URL in .env.local is correct');
      console.log('2. Verify your Neon database is active');
      console.log('3. Check if your connection string includes ?sslmode=require');
    }
    
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  testDatabaseConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    });
}

export { testDatabaseConnection };
