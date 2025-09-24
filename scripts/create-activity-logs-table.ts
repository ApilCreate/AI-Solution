import { db } from '@/db';
import { sql } from 'drizzle-orm';

async function createActivityLogsTable() {
  console.log('🔄 Creating activity_logs table...');

  try {
    // Create the activity_logs table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "activity_logs" (
        "id" uuid PRIMARY KEY NOT NULL,
        "admin_id" uuid NOT NULL REFERENCES "admin_users"("id") ON DELETE CASCADE,
        "action" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "target_type" varchar(100),
        "target_id" uuid,
        "metadata" jsonb DEFAULT '{}'::jsonb,
        "ip_address" varchar(45),
        "user_agent" text,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `);

    // Create indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "activity_logs_admin_id_idx" ON "activity_logs" ("admin_id");
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "activity_logs_action_idx" ON "activity_logs" ("action");
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "activity_logs_created_at_idx" ON "activity_logs" ("created_at");
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "activity_logs_target_type_id_idx" ON "activity_logs" ("target_type", "target_id");
    `);

    console.log('✅ Activity logs table created successfully');
  } catch (error) {
    console.error('❌ Error creating activity logs table:', error);
    throw error;
  }
}

async function main() {
  try {
    await createActivityLogsTable();
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  main();
}

export { createActivityLogsTable };