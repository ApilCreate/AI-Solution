import { db } from '@/db';
import { 
  backupMetadata, 
  backupData, 
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
} from '@/db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { writeFile, mkdir, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

// Define all tables that can be backed up
export const BACKUPABLE_TABLES = {
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
} as const;

export type BackupableTableName = keyof typeof BACKUPABLE_TABLES;

export interface BackupOptions {
  tables: BackupableTableName[];
  fromDate?: Date;
  toDate?: Date;
  name: string;
  description?: string;
  createdBy: string;
}

export interface RestoreOptions {
  backupId: string;
  tables?: BackupableTableName[];
  restoreToDate?: Date;
}

export class BackupService {
  private backupDir = join(process.cwd(), 'backups');

  constructor() {
    this.ensureBackupDirectory();
  }

  private async ensureBackupDirectory() {
    try {
      await mkdir(this.backupDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create backup directory:', error);
    }
  }

  /**
   * Create a new backup
   */
  async createBackup(options: BackupOptions): Promise<string> {
    const backupId = randomUUID();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3); // 3 months from now

    // Create backup metadata
    const [backup] = await db.insert(backupMetadata).values({
      id: backupId,
      name: options.name,
      description: options.description,
      backupType: 'manual',
      status: 'in_progress',
      tablesIncluded: options.tables,
      recordCount: 0,
      fileSize: 0,
      createdAt: new Date(),
      expiresAt,
      createdBy: options.createdBy
    }).returning();

    try {
      let totalRecords = 0;
      const backupRecords: any[] = [];

      // Backup data from each selected table
      for (const tableName of options.tables) {
        const table = BACKUPABLE_TABLES[tableName];
        if (!table) continue;

        let query = db.select().from(table);
        
        // Apply date filters if provided
        if (options.fromDate || options.toDate) {
          const conditions = [];
          if (options.fromDate) {
            conditions.push(gte(table.createdAt, options.fromDate));
          }
          if (options.toDate) {
            conditions.push(lte(table.createdAt, options.toDate));
          }
          query = query.where(and(...conditions));
        }

        const records = await query;
        
        // Store each record in backup_data table
        for (const record of records) {
          const backupRecord = {
            id: randomUUID(),
            backupId,
            tableName,
            recordId: record.id,
            operation: 'INSERT',
            data: record,
            originalCreatedAt: record.createdAt,
            originalUpdatedAt: record.updatedAt || record.createdAt,
            backedUpAt: new Date()
          };
          
          backupRecords.push(backupRecord);
          totalRecords++;
        }
      }

      // Insert all backup records in batches
      if (backupRecords.length > 0) {
        const batchSize = 1000;
        for (let i = 0; i < backupRecords.length; i += batchSize) {
          const batch = backupRecords.slice(i, i + batchSize);
          await db.insert(backupData).values(batch);
        }
      }

      // Generate CSV file
      const csvContent = await this.generateCSV(backupRecords);
      const fileName = `backup_${backupId}_${Date.now()}.csv`;
      const filePath = join(this.backupDir, fileName);
      
      await writeFile(filePath, csvContent, 'utf-8');
      const fileSize = (await readFile(filePath)).length;

      // Update backup metadata
      await db.update(backupMetadata)
        .set({
          status: 'completed',
          recordCount: totalRecords,
          fileSize,
          filePath
        })
        .where(eq(backupMetadata.id, backupId));

      return backupId;
    } catch (error) {
      // Mark backup as failed
      await db.update(backupMetadata)
        .set({ status: 'failed' })
        .where(eq(backupMetadata.id, backupId));
      
      throw error;
    }
  }

  /**
   * List all backups
   */
  async listBackups(limit = 50, offset = 0) {
    return await db.select()
      .from(backupMetadata)
      .orderBy(desc(backupMetadata.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get backup details
   */
  async getBackup(backupId: string) {
    return await db.select()
      .from(backupMetadata)
      .where(eq(backupMetadata.id, backupId))
      .limit(1);
  }

  /**
   * Restore data from backup
   */
  async restoreBackup(options: RestoreOptions): Promise<void> {
    const backup = await this.getBackup(options.backupId);
    if (!backup.length) {
      throw new Error('Backup not found');
    }

    const backupInfo = backup[0];
    const tablesToRestore = options.tables || backupInfo.tablesIncluded;

    // Get backup data
    const backupRecords = await db.select()
      .from(backupData)
      .where(
        and(
          eq(backupData.backupId, options.backupId),
          options.restoreToDate ? lte(backupData.backedUpAt, options.restoreToDate) : undefined
        )
      );

    // Group records by table
    const recordsByTable = backupRecords.reduce((acc, record) => {
      if (!acc[record.tableName]) {
        acc[record.tableName] = [];
      }
      acc[record.tableName].push(record);
      return acc;
    }, {} as Record<string, any[]>);

    // Restore each table
    for (const [tableName, records] of Object.entries(recordsByTable)) {
      if (!tablesToRestore.includes(tableName as BackupableTableName)) continue;
      
      const table = BACKUPABLE_TABLES[tableName as BackupableTableName];
      if (!table) continue;

      // For now, we'll just log the restoration
      // In a real implementation, you'd want to be more careful about conflicts
      console.log(`Restoring ${records.length} records to ${tableName}`);
      
      // Note: Actual restoration would require careful handling of conflicts
      // This is a simplified version for demonstration
    }
  }

  /**
   * Delete backup
   */
  async deleteBackup(backupId: string): Promise<void> {
    const backup = await this.getBackup(backupId);
    if (!backup.length) {
      throw new Error('Backup not found');
    }

    const backupInfo = backup[0];
    
    // Delete backup file if it exists
    if (backupInfo.filePath) {
      try {
        await unlink(backupInfo.filePath);
      } catch (error) {
        console.error('Failed to delete backup file:', error);
      }
    }

    // Delete backup data and metadata
    await db.delete(backupData).where(eq(backupData.backupId, backupId));
    await db.delete(backupMetadata).where(eq(backupMetadata.id, backupId));
  }

  /**
   * Clean up expired backups
   */
  async cleanupExpiredBackups(): Promise<number> {
    const expiredBackups = await db.select()
      .from(backupMetadata)
      .where(lte(backupMetadata.expiresAt, new Date()));

    let deletedCount = 0;
    for (const backup of expiredBackups) {
      try {
        await this.deleteBackup(backup.id);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete expired backup ${backup.id}:`, error);
      }
    }

    return deletedCount;
  }

  /**
   * Generate CSV content from backup records
   */
  private async generateCSV(records: any[]): Promise<string> {
    if (records.length === 0) return '';

    // Group records by table
    const recordsByTable = records.reduce((acc, record) => {
      if (!acc[record.tableName]) {
        acc[record.tableName] = [];
      }
      acc[record.tableName].push(record);
      return acc;
    }, {} as Record<string, any[]>);

    let csvContent = '';

    for (const [tableName, tableRecords] of Object.entries(recordsByTable)) {
      csvContent += `\n=== ${tableName.toUpperCase()} ===\n`;
      
      if (tableRecords.length === 0) continue;

      // Get all unique keys from all records
      const allKeys = new Set<string>();
      tableRecords.forEach(record => {
        Object.keys(record.data).forEach(key => allKeys.add(key));
      });

      const headers = Array.from(allKeys);
      csvContent += headers.join(',') + '\n';

      // Add data rows
      tableRecords.forEach(record => {
        const row = headers.map(header => {
          const value = record.data[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value).replace(/,/g, ';'); // Escape commas
        });
        csvContent += row.join(',') + '\n';
      });
    }

    return csvContent;
  }

  /**
   * Get backup statistics
   */
  async getBackupStats() {
    const totalBackups = await db.select({ count: backupMetadata.id }).from(backupMetadata);
    const activeBackups = await db.select({ count: backupMetadata.id })
      .from(backupMetadata)
      .where(eq(backupMetadata.status, 'completed'));
    
    const expiredBackups = await db.select({ count: backupMetadata.id })
      .from(backupMetadata)
      .where(lte(backupMetadata.expiresAt, new Date()));

    return {
      total: totalBackups.length,
      active: activeBackups.length,
      expired: expiredBackups.length
    };
  }
}

export const backupService = new BackupService();

