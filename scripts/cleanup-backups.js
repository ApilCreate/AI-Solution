#!/usr/bin/env node

/**
 * Backup Cleanup Script
 * 
 * This script cleans up expired backups from the database.
 * It should be run daily via cron job or scheduled task.
 * 
 * Usage:
 * - Manual: node scripts/cleanup-backups.js
 * - Cron: 0 2 * * * /path/to/your/app/scripts/cleanup-backups.js
 */

const { cleanupExpiredBackups } = require('../app/lib/backup-cleanup');

async function main() {
  try {
    console.log('🧹 Starting backup cleanup...');
    const deletedCount = await cleanupExpiredBackups();
    console.log(`✅ Cleanup completed successfully! Deleted ${deletedCount} expired backups.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

main();

