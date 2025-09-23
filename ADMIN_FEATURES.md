# Admin Dashboard Features

## New Features Added

### 1. Change Password Feature
- **Location**: `/admin/settings` - "Change Password" tab
- **Features**:
  - Secure password validation
  - Current password verification
  - Real-time form validation
  - Password strength requirements (min 6 characters)
  - Success/error feedback
  - Activity logging for password changes

### 2. Activity Log System
- **Location**: `/admin/settings` - "Activity Log" tab
- **Features**:
  - Real-time activity tracking
  - Comprehensive logging of admin actions
  - Filterable by action type and time period
  - Pagination support
  - IP address and browser tracking
  - Detailed metadata for each action

## Activity Types Tracked

### Authentication
- `logged_in`: Admin login events
- `password_changed`: Password change events

### Inquiry Management
- `inquiry_responded`: When admin responds to an inquiry
- `inquiry_updated`: General inquiry updates
- `inquiry_status_changed`: Status changes (new, pending, resolved, etc.)

### Event Management
- `event_created`: New event creation
- `event_updated`: Event modifications
- `event_deleted`: Event removal

### Blog Management
- `blog_created`: New blog post creation
- `blog_updated`: Blog post modifications
- `blog_deleted`: Blog post removal
- `blog_published`: Blog publishing

### System Access
- `admin_accessed_analytics`: Analytics page access
- `admin_exported_data`: Data export actions

## Database Schema

### Activity Logs Table
```sql
CREATE TABLE "activity_logs" (
  "id" uuid PRIMARY KEY NOT NULL,
  "admin_id" uuid NOT NULL REFERENCES "admin_users"("id") ON DELETE CASCADE,
  "action" varchar(255) NOT NULL,
  "description" text NOT NULL,
  "target_type" varchar(100),
  "target_id" uuid,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "ip_address" varchar(45),
  "user_agent" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
```

## API Endpoints

### Change Password
- **POST** `/api/auth/change-password`
- **Body**:
  ```json
  {
    "email": "admin@aisolutions.com",
    "currentPassword": "current_password",
    "newPassword": "new_password"
  }
  ```

### Activity Logs
- **GET** `/api/activity-logs`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `adminId`: Filter by admin user ID
  - `action`: Filter by action type
  - `days`: Filter by last N days (default: 30)

## Usage Guide

### Accessing Admin Settings
1. Login to the admin dashboard
2. Click "Settings" in the sidebar navigation
3. Choose between "Change Password" and "Activity Log" tabs

### Changing Password
1. Go to Settings → Change Password tab
2. Enter your current password
3. Enter your new password (min 6 characters)
4. Confirm your new password
5. Click "Change Password"
6. The system will log this activity automatically

### Viewing Activity Logs
1. Go to Settings → Activity Log tab
2. Use filters to narrow down results:
   - Action Type: Filter by specific actions
   - Time Period: Show activities from last 7/30/90 days or year
3. View detailed information including:
   - Action description
   - Timestamp
   - IP address and browser info
   - Metadata details

## Security Features

### Password Security
- Current password verification required
- Minimum 6 character requirement
- Password cannot be the same as current password
- Secure bcrypt hashing (12 rounds)

### Activity Tracking
- IP address logging
- User agent tracking
- Comprehensive metadata storage
- Audit trail for all admin actions

## Development

### Adding New Activity Types
1. Add new constant to `ACTIVITY_TYPES` in `/app/lib/activity-logger.ts`
2. Use `logActivity()` function in your API routes:
   ```typescript
   import { logActivity, ACTIVITY_TYPES } from '@/app/lib/activity-logger';
   
   await logActivity({
     action: ACTIVITY_TYPES.YOUR_ACTION,
     description: 'Description of what happened',
     targetType: 'resource_type', // optional
     targetId: 'resource_id', // optional
     metadata: { key: 'value' }, // optional
     request // NextRequest object for IP/UA tracking
   });
   ```

### Activity Log Icons
Icons are automatically assigned based on action type in the `ActivityLog` component. Add new mappings in the `getActionIcon()` function.

## Files Modified/Created

### New Components
- `/app/components/ChangePassword.tsx`
- `/app/components/ActivityLog.tsx`
- `/app/admin/settings/page.tsx`

### New API Routes
- `/app/api/auth/change-password/route.ts`
- `/app/api/activity-logs/route.ts`

### New Utilities
- `/app/lib/activity-logger.ts`

### Database
- `/scripts/create-activity-logs-table.ts`
- `/scripts/add-sample-activity-logs.ts`

### Modified Files
- `/db/schema.ts` - Added activity logs table
- `/app/components/DashboardLayout.tsx` - Added settings link
- `/app/admin/dashboard/page.tsx` - Added quick actions card
- `/app/api/auth/login/route.ts` - Added login activity logging
- `/app/api/inquiries/[id]/route.ts` - Added inquiry update logging
- `/app/api/events/route.ts` - Added event creation logging

## Testing

Run the test script to verify setup:
```bash
npx tsx scripts/test-admin-features.ts
```

Add sample activity logs for testing:
```bash
npx tsx scripts/add-sample-activity-logs.ts
```

## Security Considerations

1. **Activity logs contain sensitive information** - ensure proper access controls
2. **Regular cleanup** - consider implementing log retention policies
3. **Rate limiting** - password change attempts should be rate limited
4. **Audit access** - monitor who accesses activity logs
5. **Data privacy** - be mindful of what metadata is stored