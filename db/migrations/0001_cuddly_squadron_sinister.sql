CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"author" varchar(255) NOT NULL,
	"image" varchar(500),
	"category" varchar(100),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"read_time" varchar(50),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "time" varchar(50);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "status" varchar(20) DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;