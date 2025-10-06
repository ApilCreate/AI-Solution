import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  timestamp, 
  jsonb,
  integer,
  date,
  boolean
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
  adminResponse: text('admin_response'), // Admin's response to the inquiry
  respondedAt: timestamp('responded_at', { withTimezone: true }), // When admin responded
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
  description: text('description'),
  date: date('date').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  bannerUrl: varchar('banner_url', { length: 500 }),
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

// Blogs table for managing blogs
export const blogs = pgTable('blogs', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  author: varchar('author', { length: 255 }).notNull(),
  image: varchar('image', { length: 500 }),
  category: varchar('category', { length: 100 }),
  tags: jsonb('tags').$type<string[]>().default([]),
  readTime: varchar('read_time', { length: 50 }),
  status: varchar('status', { length: 20 }).default('draft').notNull(), // 'draft' or 'published'
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Activity Log table for tracking admin actions
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  adminId: uuid('admin_id').references(() => adminUsers.id, { onDelete: 'cascade' }).notNull(),
  action: varchar('action', { length: 255 }).notNull(), // e.g., 'password_changed', 'logged_in', 'inquiry_responded', etc.
  description: text('description').notNull(), // Detailed description of the action
  targetType: varchar('target_type', { length: 100 }), // e.g., 'inquiry', 'event', 'blog', 'admin_account'
  targetId: uuid('target_id'), // ID of the affected resource
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}), // Additional data about the action
  ipAddress: varchar('ip_address', { length: 45 }), // User's IP address
  userAgent: text('user_agent'), // User's browser/device info
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Ratings and Feedback table
export const ratings = pgTable('ratings', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  comment: text('comment').notNull(),
  isPublished: boolean('is_published').default(false).notNull(), // For testimonials page
  adminReply: text('admin_reply'), // Admin's reply to the feedback
  repliedAt: timestamp('replied_at', { withTimezone: true }), // When admin replied
  status: varchar('status', { length: 50 }).default('new').notNull(), // 'new', 'replied', 'published'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Solutions table for managing AI solutions
export const solutions = pgTable('solutions', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  shortDescription: text('short_description'), // Brief summary for cards
  category: varchar('category', { length: 100 }).notNull(), // e.g., 'Analytics', 'Data Processing', 'AI Agents'
  features: jsonb('features').$type<string[]>().default([]), // Array of features
  benefits: jsonb('benefits').$type<string[]>().default([]), // Array of benefits
  useCases: jsonb('use_cases').$type<string[]>().default([]), // Array of use cases
  pricing: varchar('pricing', { length: 100 }), // e.g., 'Starting at $99/month', 'Custom pricing'
  imageUrl: varchar('image_url', { length: 500 }),
  iconName: varchar('icon_name', { length: 100 }), // Lucide icon name
  status: varchar('status', { length: 20 }).default('draft').notNull(), // 'draft' or 'published'
  featured: boolean('featured').default(false).notNull(), // Featured solution
  sortOrder: integer('sort_order').default(0).notNull(), // For ordering solutions
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Demo Bookings table for managing demo requests
export const demoBookings = pgTable('demo_bookings', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  solutionId: uuid('solution_id').references(() => solutions.id, { onDelete: 'cascade' }).notNull(),
  solutionName: varchar('solution_name', { length: 255 }).notNull(), // Store solution name for reference
  message: text('message'), // Optional message from user
  preferredDate: varchar('preferred_date', { length: 50 }), // e.g., "ASAP", "Next week", "Specific date"
  preferredTime: varchar('preferred_time', { length: 50 }), // e.g., "Morning", "Afternoon", "Evening"
  status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'confirmed', 'completed', 'cancelled'
  adminNotes: text('admin_notes'), // Admin notes about the booking
  adminReply: text('admin_reply'), // Admin's reply to the user
  repliedAt: timestamp('replied_at', { withTimezone: true }), // When admin replied
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }), // When demo is scheduled
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Testimonials table for published feedback
export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  ratingId: uuid('rating_id').references(() => ratings.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }),
  company: varchar('company', { length: 255 }),
  testimonial: text('testimonial').notNull(),
  rating: integer('rating').notNull(),
  status: varchar('status', { length: 20 }).default('published').notNull(), // 'draft' or 'published'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Enhanced backup metadata table for tracking backups
export const backupMetadata = pgTable('backup_metadata', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  backupType: varchar('backup_type', { length: 50 }).notNull(), // 'manual', 'scheduled', 'automatic', 'recovery'
  status: varchar('status', { length: 20 }).default('in_progress').notNull(), // 'in_progress', 'completed', 'failed'
  tablesIncluded: jsonb('tables_included').$type<string[]>().notNull(), // Array of table names
  recordCount: integer('record_count').default(0).notNull(),
  fileSize: integer('file_size').default(0).notNull(), // Size in bytes
  filePath: varchar('file_path', { length: 500 }), // Path to backup file
  dateFrom: timestamp('date_from', { withTimezone: true }), // Start date for backup
  dateTo: timestamp('date_to', { withTimezone: true }), // End date for backup
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(), // 3-6 months from creation
  createdBy: uuid('created_by').references(() => adminUsers.id, { onDelete: 'cascade' }).notNull(),
  recoveryPoint: boolean('recovery_point').default(false).notNull(), // Whether this is a recovery backup
});

// Enhanced backup data table for storing historical data
export const backupData = pgTable('backup_data', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  backupId: uuid('backup_id').references(() => backupMetadata.id, { onDelete: 'cascade' }).notNull(),
  tableName: varchar('table_name', { length: 100 }).notNull(),
  recordId: varchar('record_id', { length: 255 }).notNull(), // Original record ID
  operation: varchar('operation', { length: 20 }).notNull(), // 'INSERT', 'UPDATE', 'DELETE'
  data: jsonb('data').$type<Record<string, any>>().notNull(), // The actual record data
  originalCreatedAt: timestamp('original_created_at', { withTimezone: true }),
  originalUpdatedAt: timestamp('original_updated_at', { withTimezone: true }),
  backedUpAt: timestamp('backed_up_at', { withTimezone: true }).defaultNow().notNull(),
  isDeleted: boolean('is_deleted').default(false).notNull(), // Whether this record was deleted
});

// Deleted records table for tracking deleted data
export const deletedRecords = pgTable('deleted_records', {
  id: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
  tableName: varchar('table_name', { length: 100 }).notNull(),
  recordId: varchar('record_id', { length: 255 }).notNull(), // Original record ID
  deletedData: jsonb('deleted_data').$type<Record<string, any>>().notNull(), // The data that was deleted
  deletedAt: timestamp('deleted_at', { withTimezone: true }).defaultNow().notNull(),
  deletedBy: uuid('deleted_by').references(() => adminUsers.id, { onDelete: 'set null' }), // Who deleted the record
  reason: varchar('reason', { length: 255 }), // Reason for deletion
  originalCreatedAt: timestamp('original_created_at', { withTimezone: true }),
  originalUpdatedAt: timestamp('original_updated_at', { withTimezone: true }),
  recovered: boolean('recovered').default(false).notNull(), // Whether this record has been recovered
});

// Table metadata for tracking data ranges
export const tableMetadata = pgTable('table_metadata', {
  tableName: varchar('table_name', { length: 100 }).primaryKey().notNull(),
  firstRecordDate: timestamp('first_record_date', { withTimezone: true }),
  lastRecordDate: timestamp('last_record_date', { withTimezone: true }),
  totalRecords: integer('total_records').default(0).notNull(),
  lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow().notNull(),
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

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

export type Rating = typeof ratings.$inferSelect;
export type NewRating = typeof ratings.$inferInsert;

export type Solution = typeof solutions.$inferSelect;
export type NewSolution = typeof solutions.$inferInsert;

export type DemoBooking = typeof demoBookings.$inferSelect;
export type NewDemoBooking = typeof demoBookings.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export type BackupMetadata = typeof backupMetadata.$inferSelect;
export type NewBackupMetadata = typeof backupMetadata.$inferInsert;

export type BackupData = typeof backupData.$inferSelect;
export type NewBackupData = typeof backupData.$inferInsert;

export type DeletedRecord = typeof deletedRecords.$inferSelect;
export type NewDeletedRecord = typeof deletedRecords.$inferInsert;

export type TableMetadata = typeof tableMetadata.$inferSelect;
export type NewTableMetadata = typeof tableMetadata.$inferInsert;
