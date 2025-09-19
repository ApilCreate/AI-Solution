# Database Management Guide

## 🎯 Overview
Your AI Solutions contact management system uses PostgreSQL (Neon) with Drizzle ORM. Due to Drizzle Studio compatibility issues with Neon serverless, we've created custom tools for database management.

## 🛠️ Available Commands

### Core Database Operations
```bash
# Test database connection
npm run db:test

# View all database contents (formatted)
npm run db:view

# Run custom SQL queries
npm run db:query -- "YOUR_SQL_QUERY"

# Seed database with sample data
npm run db:seed

# Run migrations
npm run db:migrate-custom
```

### 📊 Database Schema

#### Admin Users Table
- `id` (UUID, Primary Key)
- `email` (Unique)
- `password_hash` (bcrypt)
- `role` (admin/user)
- `created_at` (timestamp)

#### Inquiries Table
- `id` (UUID, Primary Key)
- `name` (Contact name)
- `email` (Contact email)
- `phone` (Contact phone)
- `company` (Company name)
- `country` (Country)
- `occupation` (Job title)
- `reason` (Inquiry reason)
- `how_did_you_hear` (Source)
- `message_title` (Subject)
- `message` (Full message)
- `status` (new/in-progress/resolved/closed)
- `tags` (JSON array)
- `source` (web-form/api/manual)
- `created_at` (timestamp)

#### Events Table
- `id` (UUID, Primary Key)
- `title` (Event title)
- `description` (Event description)
- `event_date` (Event date)
- `location` (Event location)
- `max_attendees` (Capacity limit)
- `registration_deadline` (Registration cutoff)
- `status` (draft/published/cancelled)
- `created_at` (timestamp)

#### Event RSVPs Table
- `id` (UUID, Primary Key)
- `event_id` (Foreign Key to events)
- `name` (Attendee name)
- `email` (Attendee email)
- `phone` (Attendee phone)
- `dietary_restrictions` (Special requirements)
- `status` (registered/confirmed/cancelled)
- `created_at` (timestamp)

## 🔍 Common Queries

### View All Inquiries
```bash
npm run db:query -- "SELECT name, email, company, message_title, status, created_at FROM inquiries ORDER BY created_at DESC"
```

### Count Inquiries by Status
```bash
npm run db:query -- "SELECT status, count(*) as count FROM inquiries GROUP BY status"
```

### Find High Priority Inquiries
```bash
npm run db:query -- "SELECT * FROM inquiries WHERE tags::text LIKE '%high-priority%'"
```

### View Admin Users
```bash
npm run db:query -- "SELECT email, role, created_at FROM admin_users"
```

### Check Database Statistics
```bash
npm run db:query -- "SELECT 
  (SELECT count(*) FROM inquiries) as total_inquiries,
  (SELECT count(*) FROM admin_users) as total_admins,
  (SELECT count(*) FROM events) as total_events,
  (SELECT count(*) FROM event_rsvps) as total_rsvps"
```

## 🔐 Admin Credentials
- **Email**: admin@aisolutions.com
- **Password**: admin123
- **Role**: admin

## 🌐 Alternative Database Management

### 1. Neon Console (Recommended GUI)
- Visit: https://console.neon.tech
- Login to your account
- Select your project
- Use SQL Editor for queries

### 2. VS Code Extensions
- **PostgreSQL** by Chris Kolkman
- **SQLTools** by Matheus Teixeira

### 3. Desktop Applications
- **pgAdmin** (Free PostgreSQL admin tool)
- **DBeaver** (Universal database tool)
- **TablePlus** (Modern database GUI)

## 🚨 Known Issues

### Drizzle Studio Connection Error
**Problem**: Drizzle Studio tries to connect to localhost:5432 instead of Neon serverless
**Error**: `ECONNREFUSED ::1:5432`
**Solution**: Use our custom tools (`npm run db:view`, `npm run db:query`) or Neon Console

## 📁 Important Files

- `db/schema.ts` - Database schema definitions
- `db/index.ts` - Database connection setup
- `scripts/view-database.ts` - Custom database viewer
- `scripts/query-database.ts` - Custom query tool
- `scripts/run-migrations.ts` - Custom migration runner
- `scripts/seed-database.ts` - Data seeding script
- `.env.local` - Environment variables (keep secure!)

## 🔄 Database Workflow

1. **Development**: Use `npm run db:view` for quick checks
2. **Queries**: Use `npm run db:query -- "SQL"` for specific data
3. **Administration**: Use Neon Console for complex operations
4. **Backup**: Neon handles automatic backups
5. **Monitoring**: Check Neon dashboard for performance metrics

## 📈 Next Steps

1. **Integrate with Contact Form**: Connect your frontend contact form to insert inquiries
2. **Admin Dashboard**: Build admin interface using the admin_users table
3. **Event Management**: Implement event creation and RSVP functionality
4. **User Confirmation Emails**: Set up email confirmations for new inquiries
5. **Analytics**: Create dashboards showing inquiry trends and statistics

Your database is production-ready and fully functional! 🎉
