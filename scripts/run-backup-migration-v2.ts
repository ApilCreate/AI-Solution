import { db } from '../db';
import { sql } from 'drizzle-orm';

async function runBackupMigration() {
  try {
    console.log('Running backup system migration...');
    
    // Create backup metadata table
    console.log('Creating backup_metadata table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "backup_metadata" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "backup_type" varchar(50) NOT NULL,
        "status" varchar(20) DEFAULT 'in_progress' NOT NULL,
        "tables_included" jsonb NOT NULL,
        "record_count" integer DEFAULT 0 NOT NULL,
        "file_size" integer DEFAULT 0 NOT NULL,
        "file_path" varchar(500),
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "created_by" uuid NOT NULL
      )
    `);
    
    // Create backup data table
    console.log('Creating backup_data table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "backup_data" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "backup_id" uuid NOT NULL,
        "table_name" varchar(100) NOT NULL,
        "record_id" varchar(255) NOT NULL,
        "operation" varchar(20) NOT NULL,
        "data" jsonb NOT NULL,
        "original_created_at" timestamp with time zone,
        "original_updated_at" timestamp with time zone,
        "backed_up_at" timestamp with time zone DEFAULT now() NOT NULL
      )
    `);
    
    // Add foreign key constraints
    console.log('Adding foreign key constraints...');
    try {
      await db.execute(sql`
        ALTER TABLE "backup_metadata" 
        ADD CONSTRAINT "backup_metadata_created_by_admin_users_id_fk" 
        FOREIGN KEY ("created_by") REFERENCES "admin_users"("id") ON DELETE cascade
      `);
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.log('Foreign key constraint already exists or error:', error.message);
      }
    }
    
    try {
      await db.execute(sql`
        ALTER TABLE "backup_data" 
        ADD CONSTRAINT "backup_data_backup_id_backup_metadata_id_fk" 
        FOREIGN KEY ("backup_id") REFERENCES "backup_metadata"("id") ON DELETE cascade
      `);
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.log('Foreign key constraint already exists or error:', error.message);
      }
    }
    
    // Create indexes for better performance
    console.log('Creating indexes...');
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_metadata_created_at_idx" ON "backup_metadata" ("created_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_metadata_status_idx" ON "backup_metadata" ("status")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_metadata_expires_at_idx" ON "backup_metadata" ("expires_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_data_backup_id_idx" ON "backup_data" ("backup_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_data_table_name_idx" ON "backup_data" ("table_name")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_data_record_id_idx" ON "backup_data" ("record_id")`);
    
    console.log('✅ Backup system migration completed successfully!');
    console.log('Created tables:');
    console.log('- backup_metadata');
    console.log('- backup_data');
    console.log('Created indexes for performance optimization');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runBackupMigration();