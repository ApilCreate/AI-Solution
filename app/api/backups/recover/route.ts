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
    const { deletedRecordIds, reason, context } = body;

    if (!deletedRecordIds || !Array.isArray(deletedRecordIds) || deletedRecordIds.length === 0) {
      return NextResponse.json(
        { error: 'Deleted record IDs array is required' },
        { status: 400 }
      );
    }

    const result = await enhancedBackupService.recoverDeletedData(
      deletedRecordIds,
      session.adminId,
      reason,
      context
    );

    return NextResponse.json({
      success: true,
      message: `Recovered ${result.recovered} records, ${result.failed} failed`,
      result
    });
  } catch (error) {
    console.error('Error recovering deleted data:', error);
    return NextResponse.json(
      { error: 'Failed to recover deleted data' },
      { status: 500 }
    );
  }
}
