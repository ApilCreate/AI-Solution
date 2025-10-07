# Vercel Deployment Checklist

## Before Deployment

### 1. Environment Variables
Ensure these are set in Vercel dashboard:
- [ ] `DATABASE_URL` - Neon PostgreSQL connection string
- [ ] `JWT_SECRET` - Strong secret for JWT tokens
- [ ] `RESEND_API_KEY` - Email service API key
- [ ] `FROM_EMAIL` - Sender email address
- [ ] `ADMIN_EMAIL` - Admin email address

### 2. Database Setup
- [ ] Neon database is created and accessible
- [ ] Database migrations are ready
- [ ] Connection string format is correct

### 3. Code Preparation
- [ ] All TypeScript errors are resolved
- [ ] Build runs successfully locally (`npm run build`)
- [ ] No linting errors that would block deployment

## Common Issues & Solutions

### Build Timeout
- **Issue**: Build takes too long due to heavy dependencies
- **Solution**: Use the optimized `next.config.ts` with package optimization

### Memory Issues
- **Issue**: Out of memory during build
- **Solution**: Added `vercel.json` with memory optimizations

### Database Connection
- **Issue**: Cannot connect to database
- **Solution**: Verify `DATABASE_URL` format and Neon database accessibility

### TypeScript Errors
- **Issue**: TypeScript compilation errors
- **Solution**: Temporarily set `ignoreBuildErrors: true` in `next.config.ts`

### Missing Dependencies
- **Issue**: Build fails due to missing packages
- **Solution**: Ensure all dependencies are in `package.json`

## Post-Deployment

### 1. Test Core Functionality
- [ ] Home page loads correctly
- [ ] Contact form works
- [ ] Admin login works
- [ ] Database operations work

### 2. Monitor Performance
- [ ] Check Vercel Analytics
- [ ] Monitor build times
- [ ] Check for any runtime errors

### 3. Security
- [ ] Verify environment variables are not exposed
- [ ] Test admin authentication
- [ ] Check API endpoints are protected

## Rollback Plan
If deployment fails:
1. Check Vercel build logs for specific errors
2. Fix issues in local environment
3. Redeploy from the same commit
4. Consider rolling back to previous working version if critical issues

