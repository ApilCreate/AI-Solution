import { db } from '../db';
import { sql } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runBackupMigration() {
  try {
    console.log('Running backup system migration...');
    
    // Read the migration file
    const migrationPath = join(__dirname, '../db/migrations/0006_backup_system.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    // Split the SQL into individual commands
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    // Execute each command separately
    for (const command of commands) {
      if (command.trim()) {
        console.log(`Executing: ${command.substring(0, 50)}...`);
        await db.execute(sql.raw(command));
      }
    }
    
    console.log('Backup system migration completed successfully!');
    console.log('Created tables:');
    console.log('- backup_metadata');
    console.log('- backup_data');
    console.log('Created indexes for performance optimization');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runBackupMigration();
