import { NextRequest, NextResponse } from 'next/server';
import { enhancedBackupService } from '@/app/lib/enhanced-backup-service';
import { verifyAdminSession } from '@/app/lib/simple-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clean up expired backups
    const expiredBackupsDeleted = await enhancedBackupService.cleanupExpiredBackups();
    
    // Clean up expired deleted records (older than 3 months)
    const expiredDeletedRecordsDeleted = await enhancedBackupService.cleanupExpiredDeletedRecords();

    return NextResponse.json({
      success: true,
      message: `Cleanup completed successfully`,
      deletedCount: expiredBackupsDeleted + expiredDeletedRecordsDeleted,
      details: {
        expiredBackupsDeleted,
        expiredDeletedRecordsDeleted
      }
    });
  } catch (error) {
    console.error('Error during cleanup:', error);
    return NextResponse.json(
      { error: 'Failed to perform cleanup' },
      { status: 500 }
    );
  }
}