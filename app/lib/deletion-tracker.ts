import { enhancedBackupService } from './enhanced-backup-service';

/**
 * Middleware function to track record deletions
 * This should be called before any DELETE operations in your API routes
 */
export async function trackRecordDeletion(
  tableName: string,
  recordId: string,
  deletedData: Record<string, any>,
  deletedBy?: string,
  reason?: string
): Promise<void> {
  try {
    await enhancedBackupService.trackDeletedRecord(
      tableName as any,
      recordId,
      deletedData,
      deletedBy,
      reason
    );
  } catch (error) {
    console.error(`Failed to track deletion of ${recordId} from ${tableName}:`, error);
    // Don't throw error to avoid breaking the main operation
  }
}

/**
 * Helper function to extract record data before deletion
 * This should be used to get the record data before calling the delete operation
 */
export async function prepareForDeletion<T>(
  tableName: string,
  recordId: string,
  deleteOperation: () => Promise<T>,
  deletedBy?: string,
  reason?: string
): Promise<T> {
  // Get the record data before deletion
  const deletedData = await getRecordData(tableName, recordId);
  
  // Perform the deletion
  const result = await deleteOperation();
  
  // Track the deletion
  if (deletedData) {
    await trackRecordDeletion(tableName, recordId, deletedData, deletedBy, reason);
  }
  
  return result;
}

/**
 * Get record data by table name and record ID
 * This is a generic function that should be extended for each table
 */
async function getRecordData(tableName: string, recordId: string): Promise<Record<string, any> | null> {
  // This is a placeholder implementation
  // In a real implementation, you would query the specific table
  // based on the tableName parameter
  
  try {
    // Import the database and schema
    const { db } = await import('@/db');
    const { 
      inquiries, 
      events, 
      blogs, 
      ratings, 
      solutions, 
      demoBookings, 
      testimonials,
      eventRsvps,
      adminUsers,
      activityLogs
    } = await import('@/db/schema');
    
    const { eq } = await import('drizzle-orm');
    
    // Map table names to actual table objects
    const tableMap: Record<string, any> = {
      'inquiries': inquiries,
      'events': events,
      'blogs': blogs,
      'ratings': ratings,
      'solutions': solutions,
      'demoBookings': demoBookings,
      'demo_bookings': demoBookings,
      'testimonials': testimonials,
      'eventRsvps': eventRsvps,
      'event_rsvps': eventRsvps,
      'adminUsers': adminUsers,
      'admin_users': adminUsers,
      'activityLogs': activityLogs,
      'activity_logs': activityLogs
    };
    
    const table = tableMap[tableName];
    if (!table) {
      console.error(`Unknown table: ${tableName}`);
      return null;
    }
    
    // Query the record
    const [record] = await db
      .select()
      .from(table)
      .where(eq(table.id, recordId))
      .limit(1);
    
    return record || null;
  } catch (error) {
    console.error(`Failed to get record data for ${tableName}:${recordId}:`, error);
    return null;
  }
}

/**
 * Cleanup expired deleted records (call this periodically)
 */
export async function cleanupExpiredDeletedRecords(): Promise<number> {
  try {
    return await enhancedBackupService.cleanupExpiredDeletedRecords();
  } catch (error) {
    console.error('Failed to cleanup expired deleted records:', error);
    return 0;
  }
}

/**
 * Get deleted records for a specific table
 */
export async function getDeletedRecords(
  tableName?: string,
  limit = 50,
  offset = 0
) {
  try {
    return await enhancedBackupService.getDeletedRecords(tableName as any, limit, offset);
  } catch (error) {
    console.error('Failed to get deleted records:', error);
    return [];
  }
}

/**
 * Recover deleted records
 */
export async function recoverDeletedRecords(
  deletedRecordIds: string[],
  recoveredBy: string,
  reason?: string
) {
  try {
    return await enhancedBackupService.recoverDeletedData(deletedRecordIds, recoveredBy, reason);
  } catch (error) {
    console.error('Failed to recover deleted records:', error);
    throw error;
  }
}
