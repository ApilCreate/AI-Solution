import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';
import { db } from '../db/index.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function runQuery() {
  try {
    console.log('🔍 Custom Database Query Tool');
    console.log('============================');
    
    // Get command line arguments
    const args = process.argv.slice(2);
    const query = args.join(' ');
    
    if (!query) {
      console.log('Available queries:');
      console.log('  npm run db:query -- "SELECT * FROM inquiries"');
      console.log('  npm run db:query -- "SELECT * FROM admin_users"');
      console.log('  npm run db:query -- "SELECT count(*) FROM inquiries WHERE status = \'new\'"');
      console.log('  npm run db:query -- "SELECT * FROM inquiries WHERE reason = \'ai-implementation\'"');
      console.log('\nOr run any PostgreSQL query!');
      return;
    }
    
    console.log(`Executing: ${query}`);
    console.log('─'.repeat(50));
    
    const result = await db.execute(sql.raw(query));
    
    if (result.rows.length === 0) {
      console.log('No results found');
    } else {
      console.log(`Found ${result.rows.length} result(s):`);
      console.log('');
      
      // Pretty print results
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${JSON.stringify(row, null, 2)}`);
        console.log('');
      });
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Query failed:', errorMessage);
    if (errorMessage.includes('syntax error')) {
      console.log('Check your SQL syntax. Example: SELECT * FROM inquiries');
    }
  }
}

runQuery();
