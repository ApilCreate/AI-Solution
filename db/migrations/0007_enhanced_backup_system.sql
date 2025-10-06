-- Enhanced backup and recovery system migration
-- This migration adds support for deleted data recovery and enhanced backup features

-- Drop existing backup tables if they exist (we'll recreate them with enhanced features)
DROP TABLE IF EXISTS "backup_data" CASCADE;
DROP TABLE IF EXISTS "backup_metadata" CASCADE;

-- Create enhanced backup metadata table
CREATE TABLE "backup_metadata" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar(255) NOT NULL,
    "description" text,
    "backup_type" varchar(50) NOT NULL, -- 'manual', 'scheduled', 'automatic', 'recovery'
    "status" varchar(20) DEFAULT 'in_progress' NOT NULL, -- 'in_progress', 'completed', 'failed'
    "tables_included" jsonb NOT NULL, -- Array of table names
    "record_count" integer DEFAULT 0 NOT NULL,
    "file_size" integer DEFAULT 0 NOT NULL, -- Size in bytes
    "file_path" varchar(500), -- Path to backup file
    "date_from" timestamp with time zone, -- Start date for backup
    "date_to" timestamp with time zone, -- End date for backup
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "expires_at" timestamp with time zone NOT NULL, -- 3-6 months from creation
    "created_by" uuid NOT NULL,
    "recovery_point" boolean DEFAULT false NOT NULL -- Whether this is a recovery backup
);

-- Create backup data table for storing historical data
CREATE TABLE "backup_data" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "backup_id" uuid NOT NULL,
    "table_name" varchar(100) NOT NULL,
    "record_id" varchar(255) NOT NULL, -- Original record ID
    "operation" varchar(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    "data" jsonb NOT NULL, -- The actual record data
    "original_created_at" timestamp with time zone,
    "original_updated_at" timestamp with time zone,
    "backed_up_at" timestamp with time zone DEFAULT now() NOT NULL,
    "is_deleted" boolean DEFAULT false NOT NULL -- Whether this record was deleted
);

-- Create deleted records table for tracking deleted data
CREATE TABLE "deleted_records" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "table_name" varchar(100) NOT NULL,
    "record_id" varchar(255) NOT NULL, -- Original record ID
    "deleted_data" jsonb NOT NULL, -- The data that was deleted
    "deleted_at" timestamp with time zone DEFAULT now() NOT NULL,
    "deleted_by" uuid, -- Who deleted the record (if available)
    "reason" varchar(255), -- Reason for deletion (if provided)
    "original_created_at" timestamp with time zone,
    "original_updated_at" timestamp with time zone,
    "recovered" boolean DEFAULT false NOT NULL -- Whether this record has been recovered
);

-- Create table metadata for tracking data ranges
CREATE TABLE "table_metadata" (
    "table_name" varchar(100) PRIMARY KEY NOT NULL,
    "first_record_date" timestamp with time zone,
    "last_record_date" timestamp with time zone,
    "total_records" integer DEFAULT 0 NOT NULL,
    "last_updated" timestamp with time zone DEFAULT now() NOT NULL
);

-- Add foreign key constraints
ALTER TABLE "backup_metadata" 
ADD CONSTRAINT "backup_metadata_created_by_admin_users_id_fk" 
FOREIGN KEY ("created_by") REFERENCES "admin_users"("id") ON DELETE cascade;

ALTER TABLE "backup_data" 
ADD CONSTRAINT "backup_data_backup_id_backup_metadata_id_fk" 
FOREIGN KEY ("backup_id") REFERENCES "backup_metadata"("id") ON DELETE cascade;

ALTER TABLE "deleted_records" 
ADD CONSTRAINT "deleted_records_deleted_by_admin_users_id_fk" 
FOREIGN KEY ("deleted_by") REFERENCES "admin_users"("id") ON DELETE set null;

-- Create indexes for better performance
CREATE INDEX "backup_metadata_created_at_idx" ON "backup_metadata" ("created_at");
CREATE INDEX "backup_metadata_status_idx" ON "backup_metadata" ("status");
CREATE INDEX "backup_metadata_expires_at_idx" ON "backup_metadata" ("expires_at");
CREATE INDEX "backup_metadata_backup_type_idx" ON "backup_metadata" ("backup_type");
CREATE INDEX "backup_metadata_recovery_point_idx" ON "backup_metadata" ("recovery_point");

CREATE INDEX "backup_data_backup_id_idx" ON "backup_data" ("backup_id");
CREATE INDEX "backup_data_table_name_idx" ON "backup_data" ("table_name");
CREATE INDEX "backup_data_record_id_idx" ON "backup_data" ("record_id");
CREATE INDEX "backup_data_operation_idx" ON "backup_data" ("operation");
CREATE INDEX "backup_data_is_deleted_idx" ON "backup_data" ("is_deleted");

CREATE INDEX "deleted_records_table_name_idx" ON "deleted_records" ("table_name");
CREATE INDEX "deleted_records_deleted_at_idx" ON "deleted_records" ("deleted_at");
CREATE INDEX "deleted_records_recovered_idx" ON "deleted_records" ("recovered");
CREATE INDEX "deleted_records_record_id_idx" ON "deleted_records" ("record_id");

-- Insert initial table metadata for existing tables
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
ON CONFLICT ("table_name") DO NOTHING;
