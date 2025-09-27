CREATE TABLE "demo_bookings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"solution_id" uuid NOT NULL,
	"solution_name" varchar(255) NOT NULL,
	"message" text,
	"preferred_date" varchar(50),
	"preferred_time" varchar(50),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"admin_reply" text,
	"replied_at" timestamp with time zone,
	"scheduled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "demo_bookings" ADD CONSTRAINT "demo_bookings_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;