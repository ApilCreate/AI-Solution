# Database Setup Completion Guide

## Step 1: Get Your Neon Database URL

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Navigate to "Connection Details" or "Database"
4. Copy the connection string (format: `postgresql://user:password@host/database?sslmode=require`)

## Step 2: Update Environment Variables

Replace the placeholder in `.env.local` with your actual Neon connection string:

```bash
DATABASE_URL="postgresql://your-user:your-password@your-host/your-database?sslmode=require"
```

## Step 3: Test Database Connection

```bash
npm run db:test
```

This will verify your DATABASE_URL is correct and the database is accessible.

## Step 4: Run Database Migration

```bash
npm run db:migrate
```

This will create all the required tables:
- `inquiries`
- `admin_users` 
- `events`
- `event_rsvps`

## Step 5: Seed Initial Data

```bash
npm run db:seed
```

This will create:
- 1 admin user (admin@aisolutions.com / Admin@123)
- 3 sample inquiries for testing

## Step 6: Verify Setup

```bash
npm run db:studio
```

Open Drizzle Studio to view your database tables and data.

## Expected Results

After successful completion, you should see:

### Admin User Created:
- Email: admin@aisolutions.com
- Password: Admin@123 (bcrypt hashed)
- Role: admin

### Sample Inquiries:
1. John Smith (TechCorp Solutions) - AI Implementation
2. Sarah Johnson (StartupInc) - AI Strategy Consultation  
3. Michael Chen (Innovate University) - Research Partnership

## Troubleshooting

### Connection Issues:
- Verify DATABASE_URL format includes `?sslmode=require`
- Ensure Neon database is active
- Check network connectivity

### Migration Failures:
- Confirm DATABASE_URL is correct
- Ensure database user has proper permissions
- Check if tables already exist

### Seeding Errors:
- Run migration first: `npm run db:migrate`
- Verify bcrypt dependency is installed
- Check database connection

## Next Steps

Once setup is complete, you can:
1. Build API routes for CRUD operations
2. Create admin dashboard components
3. Implement authentication flows
4. Set up analytics queries
