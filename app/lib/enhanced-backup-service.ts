import { db } from '@/db';
import { 
  backupMetadata, 
  backupData, 
  deletedRecords,
  tableMetadata,
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
import { eq, and, gte, lte, desc, asc, sql, inArray } from 'drizzle-orm';
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
  backupType?: 'manual' | 'scheduled' | 'automatic' | 'recovery';
  recoveryPoint?: boolean;
}

export interface RestoreOptions {
  backupId: string;
  tables?: BackupableTableName[];
  restoreToDate?: Date;
}

export interface DeletedDataExportOptions {
  tables: BackupableTableName[];
  fromDate?: Date;
  toDate?: Date;
  includeRecovered?: boolean;
}

export interface TableDateRange {
  tableName: string;
  firstRecordDate: Date | null;
  lastRecordDate: Date | null;
  totalRecords: number;
}

export class EnhancedBackupService {
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
   * Track deleted records when data is deleted
   */
  async trackDeletedRecord(
    tableName: BackupableTableName,
    recordId: string,
    deletedData: Record<string, any>,
    deletedBy?: string,
    reason?: string
  ): Promise<void> {
    try {
      await db.insert(deletedRecords).values({
        tableName,
        recordId,
        deletedData,
        deletedBy,
        reason,
        originalCreatedAt: deletedData.createdAt || deletedData.created_at,
        originalUpdatedAt: deletedData.updatedAt || deletedData.updated_at
      });
    } catch (error) {
      console.error(`Failed to track deleted record from ${tableName}:`, error);
    }
  }

  /**
   * Get table date ranges for dynamic date selection
   */
  async getTableDateRanges(): Promise<TableDateRange[]> {
    const results: TableDateRange[] = [];

    for (const [tableName, table] of Object.entries(BACKUPABLE_TABLES)) {
      try {
        // Get first and last record dates
        const firstRecord = await db
          .select({ createdAt: table.createdAt })
          .from(table)
          .orderBy(asc(table.createdAt))
          .limit(1);

        const lastRecord = await db
          .select({ createdAt: table.createdAt })
          .from(table)
          .orderBy(desc(table.createdAt))
          .limit(1);

        // Get total record count
        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(table);

        const totalRecords = countResult[0]?.count || 0;

        results.push({
          tableName,
          firstRecordDate: firstRecord[0]?.createdAt || null,
          lastRecordDate: lastRecord[0]?.createdAt || null,
          totalRecords
        });

        // Update table metadata
        await this.updateTableMetadata(tableName, {
          firstRecordDate: firstRecord[0]?.createdAt || null,
          lastRecordDate: lastRecord[0]?.createdAt || null,
          totalRecords
        });
      } catch (error) {
        console.error(`Failed to get date range for table ${tableName}:`, error);
        results.push({
          tableName,
          firstRecordDate: null,
          lastRecordDate: null,
          totalRecords: 0
        });
      }
    }

    return results;
  }

  /**
   * Update table metadata
   */
  private async updateTableMetadata(
    tableName: string,
    data: {
      firstRecordDate: Date | null;
      lastRecordDate: Date | null;
      totalRecords: number;
    }
  ): Promise<void> {
    try {
      await db.insert(tableMetadata).values({
        tableName,
        firstRecordDate: data.firstRecordDate,
        lastRecordDate: data.lastRecordDate,
        totalRecords: data.totalRecords
      }).onConflictDoUpdate({
        target: tableMetadata.tableName,
        set: {
          firstRecordDate: data.firstRecordDate,
          lastRecordDate: data.lastRecordDate,
          totalRecords: data.totalRecords,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      console.error(`Failed to update table metadata for ${tableName}:`, error);
    }
  }

  /**
   * Create a new backup
   */
  async createBackup(options: BackupOptions): Promise<string> {
    const backupId = randomUUID();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 6); // 6 months from now

    // Create backup metadata
    const [backup] = await db.insert(backupMetadata).values({
      id: backupId,
      name: options.name,
      description: options.description,
      backupType: options.backupType || 'manual',
      status: 'in_progress',
      tablesIncluded: options.tables,
      recordCount: 0,
      fileSize: 0,
      dateFrom: options.fromDate,
      dateTo: options.toDate,
      createdAt: new Date(),
      expiresAt,
      createdBy: options.createdBy,
      recoveryPoint: options.recoveryPoint || false
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
          if (conditions.length > 0) {
            query = query.where(and(...conditions));
          }
        }

        const records = await query;
        
        // Store each record in backup_data table
        for (const record of records) {
          const backupRecord = {
            id: randomUUID(),
            backupId,
            tableName,
            recordId: record.id,
            operation: 'INSERT' as const,
            data: record,
            originalCreatedAt: record.createdAt,
            originalUpdatedAt: record.updatedAt || record.createdAt,
            backedUpAt: new Date(),
            isDeleted: false
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
   * Check if there are any deleted records matching the criteria
   */
  async hasDeletedRecords(options: DeletedDataExportOptions): Promise<boolean> {
    try {
      console.log('hasDeletedRecords called with options:', options);
      
      let query = db.select({ count: sql<number>`count(*)` }).from(deletedRecords);

      // Apply filters (same as exportDeletedData)
      const conditions = [];
      
      if (options.tables && options.tables.length > 0) {
        conditions.push(inArray(deletedRecords.tableName, options.tables));
        console.log('Added table filter:', options.tables);
      }

      if (options.fromDate) {
        conditions.push(gte(deletedRecords.deletedAt, options.fromDate));
        console.log('Added fromDate filter:', options.fromDate);
      }

      if (options.toDate) {
        conditions.push(lte(deletedRecords.deletedAt, options.toDate));
        console.log('Added toDate filter:', options.toDate);
      }

      if (!options.includeRecovered) {
        conditions.push(eq(deletedRecords.recovered, false));
        console.log('Added recovered filter: false');
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
        console.log('Applied', conditions.length, 'conditions');
      }

      console.log('Executing count query...');
      const result = await query;
      console.log('Count query result:', result);
      
      const count = result[0]?.count || 0;
      console.log('Record count:', count);
      
      return count > 0;
    } catch (error) {
      console.error('Error checking deleted records:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error; // Re-throw to let the API handle it
    }
  }

  /**
   * Export deleted data as CSV
   */
  async exportDeletedData(options: DeletedDataExportOptions): Promise<{ csvContent: string; fileName: string }> {
    try {
      console.log('Exporting deleted data with options:', options);
      
      let query = db.select().from(deletedRecords);

      // Apply filters
      const conditions = [];
      
    if (options.tables && options.tables.length > 0) {
      conditions.push(inArray(deletedRecords.tableName, options.tables));
      console.log('Filtering by tables:', options.tables);
    }

      if (options.fromDate) {
        conditions.push(gte(deletedRecords.deletedAt, options.fromDate));
        console.log('Filtering from date:', options.fromDate);
      }

      if (options.toDate) {
        conditions.push(lte(deletedRecords.deletedAt, options.toDate));
        console.log('Filtering to date:', options.toDate);
      }

      if (!options.includeRecovered) {
        conditions.push(eq(deletedRecords.recovered, false));
        console.log('Excluding recovered records');
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      console.log('Executing query with conditions:', conditions.length);
      const deletedRecordsData = await query.orderBy(desc(deletedRecords.deletedAt));
      console.log('Found deleted records:', deletedRecordsData.length);

      // Generate CSV content
      const csvContent = await this.generateDeletedDataCSV(deletedRecordsData);
      const fileName = `deleted_data_${Date.now()}.csv`;

      console.log('Generated CSV content length:', csvContent.length);
      console.log('Generated file name:', fileName);

      return { csvContent, fileName };
    } catch (error) {
      console.error('Error in exportDeletedData:', error);
      throw new Error(`Failed to export deleted data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Recover deleted data
   */
  async recoverDeletedData(
    deletedRecordIds: string[],
    recoveredBy: string,
    reason?: string,
    context?: string
  ): Promise<{ recovered: number; failed: number }> {
    let recovered = 0;
    let failed = 0;

    console.log(`Attempting to recover ${deletedRecordIds.length} records`);

    for (const deletedRecordId of deletedRecordIds) {
      try {
        console.log(`Processing recovery for record ID: ${deletedRecordId}`);
        
        const [deletedRecord] = await db
          .select()
          .from(deletedRecords)
          .where(eq(deletedRecords.id, deletedRecordId))
          .limit(1);

        console.log('Found deleted record:', deletedRecord);

        if (!deletedRecord) {
          console.log(`Deleted record ${deletedRecordId} not found`);
          failed++;
          continue;
        }

        if (deletedRecord.recovered) {
          console.log(`Deleted record ${deletedRecordId} already recovered`);
          failed++;
          continue;
        }

        // Get the correct table based on table name
        const tableName = deletedRecord.tableName as BackupableTableName;
        const table = BACKUPABLE_TABLES[tableName];
        
        console.log(`Table name: ${tableName}, Table found: ${!!table}`);

        if (!table) {
          console.log(`Table ${tableName} not found in BACKUPABLE_TABLES`);
          failed++;
          continue;
        }

        console.log('Inserting data back into original table...');
        
        // Clean and prepare the data for insertion
        const cleanData = { ...deletedRecord.deletedData };
        
        // Remove the original ID to let the database generate a new one
        delete cleanData.id;
        
        // Ensure required fields have values and map field names for inquiries table
        if (deletedRecord.tableName === 'inquiries') {
          // Map database field names to schema field names
          if (cleanData.message_title && !cleanData.messageTitle) {
            cleanData.messageTitle = cleanData.message_title;
            delete cleanData.message_title;
          }
          if (cleanData.how_did_you_hear && !cleanData.howDidYouHear) {
            cleanData.howDidYouHear = cleanData.how_did_you_hear;
            delete cleanData.how_did_you_hear;
          }
          if (cleanData.admin_response && !cleanData.adminResponse) {
            cleanData.adminResponse = cleanData.admin_response;
            delete cleanData.admin_response;
          }
          if (cleanData.responded_at && !cleanData.respondedAt) {
            cleanData.respondedAt = cleanData.responded_at;
            delete cleanData.responded_at;
          }
          
          // Ensure required fields have values
          cleanData.reason = cleanData.reason || 'General Inquiry';
          cleanData.messageTitle = cleanData.messageTitle || 'Recovered Message';
          cleanData.status = cleanData.status || 'new';
          cleanData.source = cleanData.source || 'recovered';
          cleanData.tags = cleanData.tags || [];
        }
        
        // Convert date strings back to Date objects
        if (cleanData.createdAt && typeof cleanData.createdAt === 'string') {
          cleanData.createdAt = new Date(cleanData.createdAt);
        }
        if (cleanData.updatedAt && typeof cleanData.updatedAt === 'string') {
          cleanData.updatedAt = new Date(cleanData.updatedAt);
        }
        if (cleanData.created_at && typeof cleanData.created_at === 'string') {
          cleanData.created_at = new Date(cleanData.created_at);
        }
        if (cleanData.updated_at && typeof cleanData.updated_at === 'string') {
          cleanData.updated_at = new Date(cleanData.updated_at);
        }
        if (cleanData.respondedAt && typeof cleanData.respondedAt === 'string') {
          cleanData.respondedAt = new Date(cleanData.respondedAt);
        }
        if (cleanData.responded_at && typeof cleanData.responded_at === 'string') {
          cleanData.responded_at = new Date(cleanData.responded_at);
        }
        
        // Handle event-specific date field
        if (cleanData.date && typeof cleanData.date === 'string') {
          cleanData.date = new Date(cleanData.date);
        }
        
        console.log('Clean data prepared:', JSON.stringify(cleanData, null, 2));
        
        // Insert the deleted data back into the original table
        await db.insert(table).values(cleanData);
        console.log('Data inserted successfully');

        // Generate enhanced recovery reason with more context
        const enhancedReason = this.generateEnhancedRecoveryReason(
          reason || 'Manual recovery',
          deletedRecord,
          context,
          recoveredBy
        );

        // Mark as recovered with enhanced reason
        await db.update(deletedRecords)
          .set({ 
            recovered: true,
            reason: enhancedReason
          })
          .where(eq(deletedRecords.id, deletedRecordId));

        console.log(`Successfully recovered record ${deletedRecordId} with reason: ${enhancedReason}`);
        recovered++;
      } catch (error) {
        console.error(`Failed to recover deleted record ${deletedRecordId}:`, error);
        failed++;
      }
    }

    console.log(`Recovery completed: ${recovered} recovered, ${failed} failed`);
    return { recovered, failed };
  }

  /**
   * Generate enhanced recovery reason with detailed context
   */
  private generateEnhancedRecoveryReason(
    baseReason: string,
    deletedRecord: any,
    context?: string,
    recoveredBy?: string
  ): string {
    const timestamp = new Date().toLocaleString();
    const recordType = deletedRecord.tableName;
    const recordName = this.getRecordDisplayName(deletedRecord);
    
    let enhancedReason = `${baseReason} - `;
    
    // Add context information
    if (context === 'details') {
      enhancedReason += `from details modal, `;
    } else if (context === 'list') {
      enhancedReason += `from records list, `;
    } else if (context === 'bulk') {
      enhancedReason += `bulk operation, `;
    }
    
    // Add record information
    if (recordName) {
      enhancedReason += `recovered ${recordType}: "${recordName}", `;
    } else {
      enhancedReason += `recovered ${recordType} record, `;
    }
    
    // Add timestamp and user info
    enhancedReason += `at ${timestamp}`;
    if (recoveredBy) {
      enhancedReason += ` by admin user`;
    }
    
    return enhancedReason;
  }

  /**
   * Get display name for a record
   */
  private getRecordDisplayName(deletedRecord: any): string | null {
    const data = deletedRecord.deletedData;
    
    switch (deletedRecord.tableName) {
      case 'inquiries':
        return data.name || data.messageTitle || null;
      case 'events':
        return data.title || null;
      case 'blogs':
        return data.title || null;
      case 'testimonials':
        return data.name || null;
      case 'event_rsvps':
        return data.name || data.email || null;
      case 'demo_bookings':
        return data.name || data.email || null;
      default:
        return null;
    }
  }

  /**
   * Permanently delete records from deleted_records table
   */
  async permanentlyDeleteRecords(
    deletedRecordIds: string[],
    deletedBy: string,
    reason?: string
  ): Promise<{ deleted: number; failed: number }> {
    let deleted = 0;
    let failed = 0;

    console.log(`Attempting to permanently delete ${deletedRecordIds.length} records`);

    for (const deletedRecordId of deletedRecordIds) {
      try {
        console.log(`Permanently deleting record ID: ${deletedRecordId}`);
        
        const [deletedRecord] = await db
          .select()
          .from(deletedRecords)
          .where(eq(deletedRecords.id, deletedRecordId))
          .limit(1);

        if (!deletedRecord) {
          console.log(`Deleted record ${deletedRecordId} not found`);
          failed++;
          continue;
        }

        // Permanently delete the record
        await db.delete(deletedRecords)
          .where(eq(deletedRecords.id, deletedRecordId));

        console.log(`Successfully permanently deleted record ${deletedRecordId}`);
        deleted++;
      } catch (error) {
        console.error(`Failed to permanently delete record ${deletedRecordId}:`, error);
        failed++;
      }
    }

    console.log(`Permanent deletion completed: ${deleted} deleted, ${failed} failed`);
    return { deleted, failed };
  }

  /**
   * Clean up expired deleted records (older than 3 months)
   */
  async cleanupExpiredDeletedRecords(): Promise<number> {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const expiredRecords = await db
      .select()
      .from(deletedRecords)
      .where(lte(deletedRecords.deletedAt, threeMonthsAgo));

    let deletedCount = 0;
    for (const record of expiredRecords) {
      try {
        await db.delete(deletedRecords).where(eq(deletedRecords.id, record.id));
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete expired deleted record ${record.id}:`, error);
      }
    }

    return deletedCount;
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
   * Get deleted records (only unrecovered by default)
   */
  async getDeletedRecords(
    tableName?: BackupableTableName,
    limit = 50,
    offset = 0,
    includeRecovered = false
  ) {
    let query = db.select().from(deletedRecords);

    const conditions = [];
    
    // Only show unrecovered records by default
    if (!includeRecovered) {
      conditions.push(eq(deletedRecords.recovered, false));
    }

    if (tableName) {
      conditions.push(eq(deletedRecords.tableName, tableName));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query
      .orderBy(desc(deletedRecords.deletedAt))
      .limit(limit)
      .offset(offset);
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
   * Get backup details
   */
  async getBackup(backupId: string) {
    return await db.select()
      .from(backupMetadata)
      .where(eq(backupMetadata.id, backupId))
      .limit(1);
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
   * Generate CSV content for deleted data
   */
  private async generateDeletedDataCSV(records: any[]): Promise<string> {
    if (records.length === 0) return '';

    const headers = [
      'deleted_record_id',
      'table_name',
      'original_record_id',
      'deleted_at',
      'deleted_by',
      'reason',
      'recovered',
      'original_created_at',
      'original_updated_at',
      'deleted_data'
    ];

    let csvContent = headers.join(',') + '\n';

    records.forEach(record => {
      const row = [
        record.id,
        record.tableName,
        record.recordId,
        record.deletedAt,
        record.deletedBy || '',
        record.reason || '',
        record.recovered,
        record.originalCreatedAt || '',
        record.originalUpdatedAt || '',
        JSON.stringify(record.deletedData).replace(/,/g, ';')
      ];
      csvContent += row.join(',') + '\n';
    });

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

    const totalDeletedRecords = await db.select({ count: deletedRecords.id }).from(deletedRecords);
    const unrecoveredDeletedRecords = await db.select({ count: deletedRecords.id })
      .from(deletedRecords)
      .where(eq(deletedRecords.recovered, false));

    return {
      total: totalBackups.length,
      active: activeBackups.length,
      expired: expiredBackups.length,
      deletedRecords: totalDeletedRecords.length,
      unrecoveredDeletedRecords: unrecoveredDeletedRecords.length
    };
  }
}

export const enhancedBackupService = new EnhancedBackupService();
