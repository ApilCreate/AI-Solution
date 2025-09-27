# Vercel Deployment Guide

## Required Environment Variables

To deploy this project to Vercel, you need to configure the following environment variables in your Vercel project settings:

### 1. Database Configuration
```
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```
- Get this from your Neon database dashboard
- Required for all database operations

### 2. Email Configuration (Optional)
```
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```
- Get your API key from https://resend.com/api-keys
- Required for contact forms and email notifications

### 3. Authentication (Optional)
```
JWT_SECRET=your_jwt_secret_key_here
```
- Generate a strong secret key for JWT tokens
- Required for admin panel authentication

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with its value
5. Make sure to set them for all environments (Production, Preview, Development)

## Database Setup

1. Create a Neon database at https://neon.tech
2. Copy your connection string and set it as `DATABASE_URL`
3. Run the database migrations (this will be done automatically on first API call)

## Build Configuration

The project is configured to:
- Skip linting during build (for faster deployments)
- Use optimized package imports for better performance
- Include proper caching headers
- Support image optimization

## Troubleshooting

If you encounter build failures:
1. Ensure all required environment variables are set
2. Check that your database is accessible from Vercel
3. Verify your Neon database connection string format

## Analytics

The project includes Vercel Analytics which will automatically start tracking page views once deployed.
