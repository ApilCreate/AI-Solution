import { NextRequest, NextResponse } from 'next/server';
import { enhancedBackupService } from '@/app/lib/enhanced-backup-service';
import { verifyAdminSession } from '@/app/lib/simple-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dateRanges = await enhancedBackupService.getTableDateRanges();

    return NextResponse.json({
      success: true,
      dateRanges
    });
  } catch (error) {
    console.error('Error fetching table date ranges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch table date ranges' },
      { status: 500 }
    );
  }
}
