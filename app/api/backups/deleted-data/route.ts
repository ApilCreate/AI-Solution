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
    const tableName = searchParams.get('tableName') as any;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeRecovered = searchParams.get('includeRecovered') === 'true';

    const deletedRecords = await enhancedBackupService.getDeletedRecords(
      tableName,
      limit,
      offset,
      includeRecovered
    );

    return NextResponse.json({
      success: true,
      deletedRecords
    });
  } catch (error) {
    console.error('Error fetching deleted data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deleted data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Export deleted data API called');
    
    // Verify session first
    console.log('Verifying admin session...');
    const session = await verifyAdminSession(request);
    if (!session) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('Session verified for user:', session.adminId);

    // Parse request body
    console.log('Parsing request body...');
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { tables, fromDate, toDate, includeRecovered = false } = body;

    // Validate input
    console.log('Validating input...');
    if (!tables || !Array.isArray(tables) || tables.length === 0) {
      console.log('Invalid tables array:', tables);
      return NextResponse.json(
        { error: 'Tables array is required' },
        { status: 400 }
      );
    }

    const exportOptions = {
      tables,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      includeRecovered
    };

    console.log('Export options:', exportOptions);

    // Check if there are any records to export
    console.log('Checking for deleted records...');
    const hasRecords = await enhancedBackupService.hasDeletedRecords(exportOptions);
    console.log('Has records:', hasRecords);
    
    if (!hasRecords) {
      console.log('No records found, returning 404');
      return NextResponse.json(
        { error: 'No deleted records found matching the selected criteria' },
        { status: 404 }
      );
    }

    // Export the data
    console.log('Exporting deleted data...');
    const { csvContent, fileName } = await enhancedBackupService.exportDeletedData(exportOptions);
    
    console.log('CSV content length:', csvContent.length);
    console.log('File name:', fileName);

    // Return CSV response
    console.log('Returning CSV response');
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });
  } catch (error) {
    console.error('Error exporting deleted data:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorResponse = {
      error: `Failed to export deleted data: ${errorMessage}`,
      details: error instanceof Error ? error.stack : undefined
    };
    
    console.log('Returning error response:', errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
