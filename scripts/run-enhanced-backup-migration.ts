import { db } from '../db';
import { sql } from 'drizzle-orm';

async function runEnhancedBackupMigration() {
  try {
    console.log('Running enhanced backup system migration...');
    
    // Drop existing backup tables if they exist
    console.log('Dropping existing backup tables...');
    await db.execute(sql`DROP TABLE IF EXISTS "backup_data" CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS "backup_metadata" CASCADE`);
    
    // Create enhanced backup metadata table
    console.log('Creating enhanced backup_metadata table...');
    await db.execute(sql`
      CREATE TABLE "backup_metadata" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "backup_type" varchar(50) NOT NULL,
        "status" varchar(20) DEFAULT 'in_progress' NOT NULL,
        "tables_included" jsonb NOT NULL,
        "record_count" integer DEFAULT 0 NOT NULL,
        "file_size" integer DEFAULT 0 NOT NULL,
        "file_path" varchar(500),
        "date_from" timestamp with time zone,
        "date_to" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "created_by" uuid NOT NULL,
        "recovery_point" boolean DEFAULT false NOT NULL
      )
    `);
    
    // Create enhanced backup data table
    console.log('Creating enhanced backup_data table...');
    await db.execute(sql`
      CREATE TABLE "backup_data" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "backup_id" uuid NOT NULL,
        "table_name" varchar(100) NOT NULL,
        "record_id" varchar(255) NOT NULL,
        "operation" varchar(20) NOT NULL,
        "data" jsonb NOT NULL,
        "original_created_at" timestamp with time zone,
        "original_updated_at" timestamp with time zone,
        "backed_up_at" timestamp with time zone DEFAULT now() NOT NULL,
        "is_deleted" boolean DEFAULT false NOT NULL
      )
    `);
    
    // Create deleted records table
    console.log('Creating deleted_records table...');
    await db.execute(sql`
      CREATE TABLE "deleted_records" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "table_name" varchar(100) NOT NULL,
        "record_id" varchar(255) NOT NULL,
        "deleted_data" jsonb NOT NULL,
        "deleted_at" timestamp with time zone DEFAULT now() NOT NULL,
        "deleted_by" uuid,
        "reason" varchar(255),
        "original_created_at" timestamp with time zone,
        "original_updated_at" timestamp with time zone,
        "recovered" boolean DEFAULT false NOT NULL
      )
    `);
    
    // Create table metadata table
    console.log('Creating table_metadata table...');
    await db.execute(sql`
      CREATE TABLE "table_metadata" (
        "table_name" varchar(100) PRIMARY KEY NOT NULL,
        "first_record_date" timestamp with time zone,
        "last_record_date" timestamp with time zone,
        "total_records" integer DEFAULT 0 NOT NULL,
        "last_updated" timestamp with time zone DEFAULT now() NOT NULL
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
    } catch (error: any) {
      console.log('Foreign key constraint already exists or error:', error.message);
    }
    
    try {
      await db.execute(sql`
        ALTER TABLE "backup_data" 
        ADD CONSTRAINT "backup_data_backup_id_backup_metadata_id_fk" 
        FOREIGN KEY ("backup_id") REFERENCES "backup_metadata"("id") ON DELETE cascade
      `);
    } catch (error: any) {
      console.log('Foreign key constraint already exists or error:', error.message);
    }
    
    try {
      await db.execute(sql`
        ALTER TABLE "deleted_records" 
        ADD CONSTRAINT "deleted_records_deleted_by_admin_users_id_fk" 
        FOREIGN KEY ("deleted_by") REFERENCES "admin_users"("id") ON DELETE set null
      `);
    } catch (error: any) {
      console.log('Foreign key constraint already exists or error:', error.message);
    }
    
    // Create indexes for better performance
    console.log('Creating indexes...');
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_metadata_created_at_idx" ON "backup_metadata" ("created_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_metadata_status_idx" ON "backup_metadata" ("status")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_metadata_expires_at_idx" ON "backup_metadata" ("expires_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_metadata_backup_type_idx" ON "backup_metadata" ("backup_type")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_metadata_recovery_point_idx" ON "backup_metadata" ("recovery_point")`);

    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_data_backup_id_idx" ON "backup_data" ("backup_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_data_table_name_idx" ON "backup_data" ("table_name")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_data_record_id_idx" ON "backup_data" ("record_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_data_operation_idx" ON "backup_data" ("operation")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "backup_data_is_deleted_idx" ON "backup_data" ("is_deleted")`);

    await db.execute(sql`CREATE INDEX IF NOT EXISTS "deleted_records_table_name_idx" ON "deleted_records" ("table_name")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "deleted_records_deleted_at_idx" ON "deleted_records" ("deleted_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "deleted_records_recovered_idx" ON "deleted_records" ("recovered")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "deleted_records_record_id_idx" ON "deleted_records" ("record_id")`);
    
    // Insert initial table metadata for existing tables
    console.log('Inserting initial table metadata...');
    await db.execute(sql`
      INSERT INTO "table_metadata" ("table_name", "total_records") VALUES 
      ('inquiries', 0),
      ('events', 0),
      ('blogs', 0),
      ('ratings', 0),
      ('solutions', 0),
      ('demo_bookings', 0),
      ('testimonials', 0),
      ('event_rsvps', 0),
      ('admin_users', 0),
      ('activity_logs', 0)
      ON CONFLICT ("table_name") DO NOTHING
    `);
    
    console.log('Enhanced backup system migration completed successfully!');
    console.log('Created tables:');
    console.log('- backup_metadata (enhanced)');
    console.log('- backup_data (enhanced)');
    console.log('- deleted_records (new)');
    console.log('- table_metadata (new)');
    console.log('Created indexes for performance optimization');
    console.log('Features added:');
    console.log('- Deleted data tracking and recovery');
    console.log('- Dynamic date range selection');
    console.log('- 3-month retention for deleted data');
    console.log('- 6-month backup retention');
    console.log('- Recovery points for crash scenarios');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runEnhancedBackupMigration();
