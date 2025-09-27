CREATE TABLE "ratings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"admin_reply" text,
	"replied_at" timestamp with time zone,
	"status" varchar(50) DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solutions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"short_description" text,
	"category" varchar(100) NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb,
	"benefits" jsonb DEFAULT '[]'::jsonb,
	"use_cases" jsonb DEFAULT '[]'::jsonb,
	"pricing" varchar(100),
	"image_url" varchar(500),
	"icon_name" varchar(100),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY NOT NULL,
	"rating_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255),
	"company" varchar(255),
	"testimonial" text NOT NULL,
	"rating" integer NOT NULL,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_rating_id_ratings_id_fk" FOREIGN KEY ("rating_id") REFERENCES "public"."ratings"("id") ON DELETE cascade ON UPDATE no action;