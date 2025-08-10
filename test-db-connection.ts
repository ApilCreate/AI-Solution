import { db } from './db';
import { adminUsers, inquiries, events, eventRsvps } from './db/schema';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    console.log('Test query result:', result);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    return false;
  }
}

export { testConnection };
