import { db } from '@/db';
import { backupData } from '@/db/schema';
import { randomUUID } from 'crypto';

export type BackupableTableName = 
  | 'inquiries' 
  | 'events' 
  | 'blogs' 
  | 'ratings' 
  | 'solutions' 
  | 'demoBookings' 
  | 'testimonials' 
  | 'eventRsvps' 
  | 'adminUsers' 
  | 'activityLogs';

/**
 * Trigger backup for a specific record change
 * This should be called whenever data is modified
 */
export async function triggerBackup(
  tableName: BackupableTableName,
  recordId: string,
  operation: 'INSERT' | 'UPDATE' | 'DELETE',
  data: Record<string, any>,
  backupId?: string
) {
  try {
    // Only backup if we have a backup session (backupId)
    if (!backupId) return;

    const backupRecord = {
      id: randomUUID(),
      backupId,
      tableName,
      recordId,
      operation,
      data,
      originalCreatedAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      originalUpdatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      backedUpAt: new Date()
    };

    await db.insert(backupData).values(backupRecord);
  } catch (error) {
    console.error(`Failed to backup ${tableName} record ${recordId}:`, error);
    // Don't throw error to avoid breaking the main operation
  }
}

/**
 * Create a backup session for tracking changes
 * This should be called at the start of operations that might need backup
 */
export function createBackupSession(): string {
  return randomUUID();
}

/**
 * Enhanced database operations with automatic backup
 * These functions wrap the original operations and add backup functionality
 */
export class BackupableDB {
  private backupId: string | null = null;

  startBackupSession() {
    this.backupId = createBackupSession();
    return this.backupId;
  }

  endBackupSession() {
    this.backupId = null;
  }

  async insertWithBackup(
    tableName: BackupableTableName,
    data: Record<string, any>
  ) {
    // Perform the actual insert operation
    // This is a simplified version - in practice, you'd call the actual table insert
    const recordId = data.id || randomUUID();
    
    // Trigger backup
    if (this.backupId) {
      await triggerBackup(tableName, recordId, 'INSERT', data, this.backupId);
    }
    
    return { id: recordId, ...data };
  }

  async updateWithBackup(
    tableName: BackupableTableName,
    recordId: string,
    data: Record<string, any>
  ) {
    // Perform the actual update operation
    // This is a simplified version - in practice, you'd call the actual table update
    
    // Trigger backup
    if (this.backupId) {
      await triggerBackup(tableName, recordId, 'UPDATE', data, this.backupId);
    }
    
    return { id: recordId, ...data };
  }

  async deleteWithBackup(
    tableName: BackupableTableName,
    recordId: string,
    originalData: Record<string, any>
  ) {
    // Perform the actual delete operation
    // This is a simplified version - in practice, you'd call the actual table delete
    
    // Trigger backup
    if (this.backupId) {
      await triggerBackup(tableName, recordId, 'DELETE', originalData, this.backupId);
    }
    
    return true;
  }
}

export const backupableDB = new BackupableDB();

