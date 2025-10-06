import { NextRequest, NextResponse } from 'next/server';
import { enhancedBackupService } from '@/app/lib/enhanced-backup-service';
import { verifyAdminSession } from '@/app/lib/simple-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { deletedRecordIds, reason } = body;

    if (!deletedRecordIds || !Array.isArray(deletedRecordIds) || deletedRecordIds.length === 0) {
      return NextResponse.json(
        { error: 'Deleted record IDs array is required' },
        { status: 400 }
      );
    }

    // Confirm permanent deletion
    if (deletedRecordIds.length === 1) {
      const reasonText = reason || 'Manual permanent deletion';
      const confirmationMessage = `Are you sure you want to permanently delete this record? This action cannot be undone and the data will be lost forever.`;
    } else {
      const confirmationMessage = `Are you sure you want to permanently delete ${deletedRecordIds.length} records? This action cannot be undone and the data will be lost forever.`;
    }

    const result = await enhancedBackupService.permanentlyDeleteRecords(
      deletedRecordIds,
      session.adminId,
      reason || 'Manual permanent deletion'
    );

    return NextResponse.json({
      success: true,
      message: `Permanently deleted ${result.deleted} records, ${result.failed} failed`,
      result
    });
  } catch (error) {
    console.error('Error permanently deleting records:', error);
    return NextResponse.json(
      { error: 'Failed to permanently delete records' },
      { status: 500 }
    );
  }
}
