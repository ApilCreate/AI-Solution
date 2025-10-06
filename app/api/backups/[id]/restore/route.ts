import { NextRequest, NextResponse } from 'next/server';
import { backupService } from '@/app/lib/backup-service';
import { verifyAdminSession } from '@/app/lib/simple-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { tables, restoreToDate } = body;

    const restoreOptions = {
      backupId: id,
      tables,
      restoreToDate: restoreToDate ? new Date(restoreToDate) : undefined
    };

    await backupService.restoreBackup(restoreOptions);

    return NextResponse.json({
      success: true,
      message: 'Backup restored successfully'
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    return NextResponse.json(
      { error: 'Failed to restore backup' },
      { status: 500 }
    );
  }
}

