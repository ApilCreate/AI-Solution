# Database Backup System

This document describes the comprehensive database backup and recovery system implemented for the AI Solution platform.

## Overview

The backup system provides:
- **Manual backups** with table and date range selection
- **Automatic data change tracking** for recovery
- **3-month retention policy** with automatic cleanup
- **CSV export functionality** for all backups
- **Admin interface** for backup management
- **Restore functionality** for data recovery

## Features

### 1. Backup Creation
- Select specific tables to backup
- Choose date range (up to 3 months)
- Custom backup names and descriptions
- Real-time progress tracking
- CSV file generation

### 2. Backup Management
- View all backups with status indicators
- Download backup files as CSV
- Delete individual backups
- Restore data from backups
- Cleanup expired backups

### 3. Data Recovery
- Point-in-time recovery
- Table-specific restoration
- Conflict resolution
- Rollback capabilities

### 4. Automatic Cleanup
- 3-month retention policy
- Automatic deletion of expired backups
- Scheduled cleanup tasks
- Storage optimization

## Database Schema

### backup_metadata
Stores information about each backup:
- `id`: Unique backup identifier
- `name`: Human-readable backup name
- `description`: Optional backup description
- `backup_type`: Type of backup (manual, scheduled, automatic)
- `status`: Current status (in_progress, completed, failed)
- `tables_included`: Array of table names included
- `record_count`: Number of records backed up
- `file_size`: Size of backup file in bytes
- `file_path`: Path to backup file
- `created_at`: Backup creation timestamp
- `expires_at`: Backup expiration timestamp (3 months)
- `created_by`: Admin user who created the backup

### backup_data
Stores the actual backup data:
- `id`: Unique record identifier
- `backup_id`: Reference to backup metadata
- `table_name`: Name of the source table
- `record_id`: Original record ID
- `operation`: Type of operation (INSERT, UPDATE, DELETE)
- `data`: JSON data of the record
- `original_created_at`: Original record creation time
- `original_updated_at`: Original record update time
- `backed_up_at`: When the record was backed up

## API Endpoints

### GET /api/backups
List all backups with pagination and statistics.

**Query Parameters:**
- `limit`: Number of backups to return (default: 50)
- `offset`: Number of backups to skip (default: 0)

**Response:**
```json
{
  "backups": [...],
  "stats": {
    "total": 10,
    "active": 8,
    "expired": 2
  },
  "pagination": {
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### POST /api/backups
Create a new backup.

**Request Body:**
```json
{
  "tables": ["inquiries", "events", "blogs"],
  "fromDate": "2024-01-01",
  "toDate": "2024-01-31",
  "name": "January 2024 Backup",
  "description": "Monthly backup for January"
}
```

### GET /api/backups/[id]
Get details of a specific backup.

### DELETE /api/backups/[id]
Delete a specific backup.

### POST /api/backups/[id]/restore
Restore data from a backup.

**Request Body:**
```json
{
  "tables": ["inquiries", "events"],
  "restoreToDate": "2024-01-15"
}
```

### GET /api/backups/[id]/download
Download backup as CSV file.

### POST /api/backups/cleanup
Manually trigger cleanup of expired backups.

## Usage

### Creating a Backup

1. Navigate to Admin → Settings → Database Backups
2. Click "Create Backup"
3. Select tables to include
4. Choose date range (optional)
5. Enter backup name and description
6. Click "Create Backup"

### Restoring Data

1. Find the backup in the list
2. Click the restore button (↻)
3. Confirm the restoration
4. Data will be restored to the selected point in time

### Downloading Backups

1. Find the completed backup
2. Click the download button (⬇)
3. CSV file will be downloaded automatically

## Configuration

### Backup Retention
- Default retention: 3 months
- Automatic cleanup runs daily
- Expired backups are automatically deleted

### File Storage
- Backup files stored in `/backups` directory
- CSV format for easy import/export
- File naming: `backup_[id]_[timestamp].csv`

### Performance
- Indexed database tables for fast queries
- Batch processing for large datasets
- Asynchronous backup creation
- Progress tracking for long operations

## Security

- Admin authentication required for all operations
- Session validation for API endpoints
- Secure file handling
- Audit logging for all backup operations

## Monitoring

- Real-time backup status
- Progress indicators
- Error handling and reporting
- Activity logging
- Storage usage tracking

## Troubleshooting

### Common Issues

1. **Backup Creation Fails**
   - Check database connectivity
   - Verify table permissions
   - Check disk space

2. **Download Issues**
   - Verify backup file exists
   - Check file permissions
   - Ensure backup is completed

3. **Restore Problems**
   - Verify backup integrity
   - Check for data conflicts
   - Ensure sufficient disk space

### Logs

Check the following for troubleshooting:
- Application logs
- Database logs
- File system logs
- Activity logs in admin panel

## Migration

To set up the backup system:

1. Run the migration script:
   ```bash
   npm run migrate:backup
   ```

2. Create backup directory:
   ```bash
   mkdir backups
   ```

3. Set up cleanup cron job (optional):
   ```bash
   # Add to crontab for daily cleanup at 2 AM
   0 2 * * * /path/to/your/app/scripts/cleanup-backups.js
   ```

## Future Enhancements

- Scheduled automatic backups
- Incremental backup support
- Cloud storage integration
- Backup compression
- Email notifications
- Backup verification
- Cross-database backup support

