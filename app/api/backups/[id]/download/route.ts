import { NextRequest, NextResponse } from 'next/server';
import { backupService } from '@/app/lib/backup-service';
import { verifyAdminSession } from '@/app/lib/simple-auth';
import { readFile } from 'fs/promises';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const backup = await backupService.getBackup(id);
    if (!backup.length) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }

    const backupInfo = backup[0];
    if (!backupInfo.filePath) {
      return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });
    }

    try {
      const fileContent = await readFile(backupInfo.filePath, 'utf-8');
      
      return new NextResponse(fileContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="backup_${backupInfo.name}_${backupInfo.createdAt.toISOString().split('T')[0]}.csv"`
        }
      });
    } catch (fileError) {
      console.error('Error reading backup file:', fileError);
      return NextResponse.json({ error: 'Failed to read backup file' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error downloading backup:', error);
    return NextResponse.json(
      { error: 'Failed to download backup' },
      { status: 500 }
    );
  }
}

