import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  timestamp, 
  jsonb,
  integer,
  date
} from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';

// Inquiries table for contact form submissions
export const inquiries = pgTable('inquiries', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 255 }),
  country: varchar('country', { length: 100 }),
  occupation: varchar('occupation', { length: 255 }),
  reason: varchar('reason', { length: 100 }).notNull(), // Dropdown value
  howDidYouHear: varchar('how_did_you_hear', { length: 100 }), // Dropdown value
  messageTitle: varchar('message_title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('new').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]), // Array of strings stored as JSONB
  source: varchar('source', { length: 50 }).default('web-form').notNull(),
});

// Admin Users table for authentication
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('admin').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Events table for managing events
export const events = pgTable('events', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  date: date('date').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  bannerUrl: varchar('banner_url', { length: 500 }),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Event RSVPs table for tracking event attendees
export const eventRsvps = pgTable('event_rsvps', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  attendees: integer('attendees').default(1).notNull(), // Number of people attending
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports for TypeScript
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type EventRsvp = typeof eventRsvps.$inferSelect;
export type NewEventRsvp = typeof eventRsvps.$inferInsert;
