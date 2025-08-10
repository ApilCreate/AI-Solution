import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

async function checkSetup() {
  console.log('🔍 Checking database setup...\n');
  
  // Check if DATABASE_URL exists
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found in environment variables');
    console.log('\n📋 Setup Instructions:');
    console.log('1. Go to your Neon Console: https://console.neon.tech/');
    console.log('2. Select your project → Connection Details');
    console.log('3. Copy the "Pooled connection string (PostgreSQL)"');
    console.log('4. Update .env.local with:');
    console.log('   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"');
    return false;
  }
  
  // Check if it's still the placeholder
  if (databaseUrl.includes('user:password@HOST')) {
    console.log('❌ DATABASE_URL appears to be a placeholder');
    console.log('Current value:', databaseUrl);
    console.log('\n📋 Please update .env.local with your actual Neon connection string');
    return false;
  }
  
  // Basic format validation
  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    console.log('❌ DATABASE_URL should start with postgresql://');
    console.log('Current value:', databaseUrl);
    return false;
  }
  
  if (!databaseUrl.includes('sslmode=require')) {
    console.log('⚠️  Warning: DATABASE_URL should include ?sslmode=require for Neon');
    console.log('Current value:', databaseUrl);
  }
  
  console.log('✅ DATABASE_URL appears to be configured correctly');
  console.log('🔗 Ready to test connection!\n');
  
  return true;
}

// Run if called directly
if (require.main === module) {
  checkSetup()
    .then((isReady) => {
      if (isReady) {
        console.log('🚀 Run: npm run db:test');
      }
      process.exit(isReady ? 0 : 1);
    });
}

export { checkSetup };
