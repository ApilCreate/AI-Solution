import { NextRequest, NextResponse } from 'next/server';
import { enhancedBackupService } from '@/app/lib/enhanced-backup-service';
import { verifyAdminSession } from '@/app/lib/simple-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const backups = await enhancedBackupService.listBackups(limit, offset);
    const stats = await enhancedBackupService.getBackupStats();

    return NextResponse.json({
      backups,
      stats,
      pagination: {
        limit,
        offset,
        hasMore: backups.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching backups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Backup creation API called');
    console.log('📡 Request URL:', request.url);
    console.log('📡 Request method:', request.method);
    console.log('📡 Request headers:', Object.fromEntries(request.headers.entries()));
    
    const session = await verifyAdminSession(request);
    if (!session) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('Session verified for user:', session.adminId);
    
    // Ensure we have a valid UUID for the admin user
    if (!session.adminId || typeof session.adminId !== 'string') {
      console.log('Invalid admin ID:', session.adminId);
      return NextResponse.json({ error: 'Invalid admin session' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
      console.log('📦 Request body parsed successfully:', body);
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }, { status: 400 });
    }
    
    const { tables, fromDate, toDate, name, description, backupType, recoveryPoint } = body;

    if (!tables || !Array.isArray(tables) || tables.length === 0) {
      console.log('Invalid tables array:', tables);
      return NextResponse.json(
        { error: 'Tables array is required' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string') {
      console.log('Invalid name:', name);
      return NextResponse.json(
        { error: 'Backup name is required' },
        { status: 400 }
      );
    }

    const backupOptions = {
      tables,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      name,
      description,
      createdBy: session.adminId,
      backupType: backupType || 'manual',
      recoveryPoint: recoveryPoint || false
    };

    console.log('📋 Backup options:', backupOptions);
    console.log('🔄 Calling enhancedBackupService.createBackup...');

    let backupId;
    try {
      backupId = await enhancedBackupService.createBackup(backupOptions);
      console.log('✅ Backup created with ID:', backupId);
    } catch (serviceError) {
      console.error('❌ Enhanced backup service error:', serviceError);
      console.error('❌ Service error stack:', serviceError instanceof Error ? serviceError.stack : 'No stack trace');
      throw serviceError; // Re-throw to be caught by outer try-catch
    }

    return NextResponse.json({
      success: true,
      backupId,
      message: 'Backup created successfully'
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: `Failed to create backup: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

