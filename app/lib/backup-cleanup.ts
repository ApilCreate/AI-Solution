import { backupService } from './backup-service';

/**
 * Cleanup service that runs periodically to remove expired backups
 * This should be called from a cron job or scheduled task
 */
export async function cleanupExpiredBackups() {
  try {
    console.log('Starting backup cleanup...');
    const deletedCount = await backupService.cleanupExpiredBackups();
    console.log(`Cleanup completed. Deleted ${deletedCount} expired backups.`);
    return deletedCount;
  } catch (error) {
    console.error('Backup cleanup failed:', error);
    throw error;
  }
}

/**
 * Schedule cleanup to run daily
 * In production, you might want to use a proper cron job or scheduled task
 */
export function scheduleBackupCleanup() {
  // Run cleanup immediately
  cleanupExpiredBackups();
  
  // Schedule daily cleanup (24 hours)
  setInterval(() => {
    cleanupExpiredBackups();
  }, 24 * 60 * 60 * 1000);
  
  console.log('Backup cleanup scheduled to run daily');
}

