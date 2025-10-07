
const { cleanupExpiredBackups } = require('../app/lib/backup-cleanup');

async function main() {
  try {
    console.log(' Starting backup cleanup...');
    const deletedCount = await cleanupExpiredBackups();
    console.log(` Cleanup completed successfully! Deleted ${deletedCount} expired backups.`);
    process.exit(0);
  } catch (error) {
    console.error(' Cleanup failed:', error);
    process.exit(1);
  }
}

main();

