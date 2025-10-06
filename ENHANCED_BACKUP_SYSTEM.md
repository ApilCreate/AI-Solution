# Enhanced Backup & Recovery System

## Overview

The Enhanced Backup & Recovery System provides comprehensive data protection with two main features:

1. **Deleted Data Recovery**: Automatically tracks all deleted records and allows recovery within 3 months
2. **Advanced Backup System**: Creates backups with dynamic date ranges and dual storage (database + CSV)

## Features

### 🗑️ Deleted Data Recovery
- **Automatic Tracking**: All record deletions are automatically tracked
- **3-Month Retention**: Deleted records are kept for 3 months before permanent deletion
- **CSV Export**: Export deleted data for analysis or external recovery
- **Individual Recovery**: Recover specific deleted records
- **Bulk Recovery**: Recover multiple records at once
- **Recovery Tracking**: Track which records have been recovered

### 💾 Enhanced Backup System
- **Dynamic Date Ranges**: Date selection is limited to actual data ranges
- **Dual Storage**: Backups stored in both database and CSV files
- **Recovery Points**: Special backups for disaster recovery scenarios
- **6-Month Retention**: Regular backups kept for 6 months
- **Table Selection**: Choose specific tables or all tables
- **Metadata Tracking**: Comprehensive backup metadata and statistics

## Database Schema

### New Tables

#### `deleted_records`
Tracks all deleted data with recovery capabilities:
```sql
- id: UUID (Primary Key)
- table_name: VARCHAR(100) - Source table name
- record_id: VARCHAR(255) - Original record ID
- deleted_data: JSONB - Complete record data
- deleted_at: TIMESTAMP - When record was deleted
- deleted_by: UUID - Who deleted the record (optional)
- reason: VARCHAR(255) - Deletion reason (optional)
- original_created_at: TIMESTAMP - Original creation date
- original_updated_at: TIMESTAMP - Original update date
- recovered: BOOLEAN - Recovery status
```

#### `table_metadata`
Tracks data ranges for dynamic date selection:
```sql
- table_name: VARCHAR(100) (Primary Key)
- first_record_date: TIMESTAMP - Earliest record date
- last_record_date: TIMESTAMP - Latest record date
- total_records: INTEGER - Total record count
- last_updated: TIMESTAMP - Last metadata update
```

#### Enhanced `backup_metadata`
Extended backup information:
```sql
- id: UUID (Primary Key)
- name: VARCHAR(255) - Backup name
- description: TEXT - Backup description
- backup_type: VARCHAR(50) - manual/scheduled/automatic/recovery
- status: VARCHAR(20) - in_progress/completed/failed
- tables_included: JSONB - Array of table names
- record_count: INTEGER - Number of records backed up
- file_size: INTEGER - Backup file size in bytes
- file_path: VARCHAR(500) - Path to CSV file
- date_from: TIMESTAMP - Backup start date
- date_to: TIMESTAMP - Backup end date
- created_at: TIMESTAMP - Backup creation time
- expires_at: TIMESTAMP - Backup expiration time
- created_by: UUID - Who created the backup
- recovery_point: BOOLEAN - Whether this is a recovery point
```

#### Enhanced `backup_data`
Extended backup data storage:
```sql
- id: UUID (Primary Key)
- backup_id: UUID - Reference to backup metadata
- table_name: VARCHAR(100) - Source table name
- record_id: VARCHAR(255) - Original record ID
- operation: VARCHAR(20) - INSERT/UPDATE/DELETE
- data: JSONB - Complete record data
- original_created_at: TIMESTAMP - Original creation date
- original_updated_at: TIMESTAMP - Original update date
- backed_up_at: TIMESTAMP - When data was backed up
- is_deleted: BOOLEAN - Whether record was deleted
```

## API Endpoints

### Backup Management
- `GET /api/backups` - List all backups with statistics
- `POST /api/backups` - Create new backup
- `GET /api/backups/table-ranges` - Get dynamic date ranges for tables
- `DELETE /api/backups/{id}` - Delete specific backup
- `GET /api/backups/{id}/download` - Download backup CSV

### Deleted Data Management
- `GET /api/backups/deleted-data` - List deleted records
- `POST /api/backups/deleted-data` - Export deleted data as CSV
- `POST /api/backups/recover` - Recover deleted records

### Cleanup Operations
- `POST /api/backups/cleanup` - Clean up expired backups and deleted records

## Usage Examples

### Creating a Backup
```javascript
const backupOptions = {
  tables: ['inquiries', 'events'],
  fromDate: '2024-01-01',
  toDate: '2024-01-31',
  name: 'January 2024 Backup',
  description: 'Monthly backup for January',
  backupType: 'manual',
  recoveryPoint: false
};

const response = await fetch('/api/backups', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(backupOptions)
});
```

### Exporting Deleted Data
```javascript
const exportOptions = {
  tables: ['inquiries', 'events'],
  fromDate: '2024-01-01',
  toDate: '2024-01-31',
  includeRecovered: false
};

const response = await fetch('/api/backups/deleted-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(exportOptions)
});
```

### Recovering Deleted Records
```javascript
const recoveryOptions = {
  deletedRecordIds: ['uuid1', 'uuid2', 'uuid3'],
  reason: 'Accidental deletion recovery'
};

const response = await fetch('/api/backups/recover', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(recoveryOptions)
});
```

## Integration Guide

### Tracking Deletions in Your Code

Use the deletion tracker before any delete operations:

```typescript
import { trackRecordDeletion } from '@/app/lib/deletion-tracker';

// Before deleting a record
await trackRecordDeletion(
  'inquiries',
  recordId,
  recordData,
  adminId,
  'User requested deletion'
);

// Then perform the actual deletion
await db.delete(inquiries).where(eq(inquiries.id, recordId));
```

### Automated Cleanup

Set up a cron job or scheduled task to clean up expired records:

```typescript
import { cleanupExpiredDeletedRecords } from '@/app/lib/deletion-tracker';

// Run daily
const deletedCount = await cleanupExpiredDeletedRecords();
console.log(`Cleaned up ${deletedCount} expired deleted records`);
```

## UI Components

### EnhancedBackupManagement
Main component with tabs for backups and deleted data management.

### EnhancedBackupModal
Modal for creating backups with:
- Dynamic date range selection
- Table selection with record counts
- Backup type selection (manual/recovery)
- Recovery point options

### DeletedDataModal
Modal for exporting deleted data with:
- Date range filtering
- Table selection
- Include recovered records option

## Security Considerations

- All operations require admin authentication
- Deleted data includes complete record information
- Recovery operations are logged for audit purposes
- Expired records are permanently deleted after retention period

## Performance Considerations

- Backup operations are performed in batches
- Indexes are created for optimal query performance
- Large backups may take several minutes
- CSV files are generated on-demand

## Disaster Recovery

### Recovery Points
- Mark critical backups as recovery points
- Recovery points are kept longer than regular backups
- Use recovery points for system restoration after crashes

### Backup Strategy
1. **Daily Backups**: Automated backups of critical tables
2. **Weekly Recovery Points**: Full system recovery points
3. **Monthly Archives**: Long-term storage of important data
4. **Deleted Data Tracking**: 3-month recovery window

## Monitoring

### Statistics Available
- Total backups created
- Active vs expired backups
- Deleted records count
- Unrecovered deleted records
- Backup success/failure rates

### Health Checks
- Monitor backup completion rates
- Track deleted record recovery success
- Alert on failed backup operations
- Monitor disk space usage

## Migration

The enhanced backup system migration:
1. Drops existing backup tables
2. Creates new enhanced tables
3. Adds indexes for performance
4. Initializes table metadata
5. Sets up foreign key constraints

Run the migration with:
```bash
npx tsx scripts/run-enhanced-backup-migration.ts
```

## Troubleshooting

### Common Issues

1. **Backup Creation Fails**
   - Check database connectivity
   - Verify table permissions
   - Ensure sufficient disk space

2. **Deleted Data Not Tracked**
   - Verify deletion tracker is called before delete operations
   - Check database schema is up to date
   - Review error logs for tracking failures

3. **Recovery Operations Fail**
   - Check if original table structure exists
   - Verify record IDs are valid
   - Ensure admin permissions are correct

### Logs
- All backup operations are logged
- Deletion tracking errors are logged
- Recovery operations are logged
- Cleanup operations are logged

## Future Enhancements

- Scheduled backup automation
- Cloud storage integration
- Backup compression
- Incremental backups
- Backup encryption
- Multi-site replication
