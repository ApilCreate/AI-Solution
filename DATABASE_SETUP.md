# Database Setup Guide

## Prerequisites

1. **Neon Account**: Sign up at [https://neon.tech](https://neon.tech)
2. **Create a New Project**: Create a new project in your Neon dashboard

## Setup Instructions

### 1. Get your Database URL from Neon

1. Go to your [Neon Dashboard](https://console.neon.tech/)
2. Select your project
3. Go to the "Connection Details" or "Database" section
4. Copy the connection string (it should look like this):
   ```
   postgresql://username:password@hostname/database?sslmode=require
   ```

### 2. Update Environment Variables

Update your `.env.local` file with your actual Neon database URL:

```bash
DATABASE_URL="your-actual-neon-database-url-here"
```

### 3. Run Database Setup

Once you have the correct DATABASE_URL:

```bash
# Generate migration files (already done)
npm run db:generate

# Apply migrations to create tables
npm run db:migrate

# Open Drizzle Studio to view your database
npm run db:studio
```

## Database Schema

### Tables Created:

1. **inquiries**: Contact form submissions with analytics data
   - id, createdAt, name, email, phone, company, country, occupation
   - reason, howDidYouHear, messageTitle, message, status, tags, source

2. **admin_users**: Admin authentication
   - id, email, passwordHash, role, createdAt

3. **events**: Event management
   - id, title, date, location, bannerUrl, description, createdAt

4. **event_rsvps**: Event attendance tracking
   - id, eventId (FK), name, email, company, attendees, createdAt

## Usage Examples

### Import the database connection:
```typescript
import { db } from './db';
import { inquiries, adminUsers, events, eventRsvps } from './db/schema';
```

### Insert a new inquiry:
```typescript
const newInquiry = await db.insert(inquiries).values({
  name: 'John Doe',
  email: 'john@example.com',
  messageTitle: 'Business Inquiry',
  message: 'I would like to know more about your services.',
  reason: 'general-inquiry'
}).returning();
```

### Query inquiries:
```typescript
const allInquiries = await db.select().from(inquiries);
const newInquiries = await db.select().from(inquiries).where(eq(inquiries.status, 'new'));
```

## Troubleshooting

1. **Connection Error**: Make sure your DATABASE_URL is correct and your Neon database is active
2. **Migration Errors**: Ensure the database exists and you have proper permissions
3. **TypeScript Errors**: Make sure all dependencies are installed: `npm install`

## Next Steps

After successful setup, you can:
1. Create API routes for CRUD operations
2. Build admin dashboard components
3. Implement authentication with admin_users table
4. Create analytics views for inquiries data
