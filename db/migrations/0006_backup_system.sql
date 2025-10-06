-- Create backup metadata table
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
);

-- Create backup data table
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
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "backup_metadata" ADD CONSTRAINT "backup_metadata_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "admin_users"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "backup_data" ADD CONSTRAINT "backup_data_backup_id_backup_metadata_id_fk" FOREIGN KEY ("backup_id") REFERENCES "backup_metadata"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "backup_metadata_created_at_idx" ON "backup_metadata" ("created_at");
CREATE INDEX IF NOT EXISTS "backup_metadata_status_idx" ON "backup_metadata" ("status");
CREATE INDEX IF NOT EXISTS "backup_metadata_expires_at_idx" ON "backup_metadata" ("expires_at");
CREATE INDEX IF NOT EXISTS "backup_data_backup_id_idx" ON "backup_data" ("backup_id");
CREATE INDEX IF NOT EXISTS "backup_data_table_name_idx" ON "backup_data" ("table_name");
CREATE INDEX IF NOT EXISTS "backup_data_record_id_idx" ON "backup_data" ("record_id");

