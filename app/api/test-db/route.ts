import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('✅ Database connection successful');
    
    // Test events table exists
    const tableCheck = await db.execute(sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_name = 'events'
    `);
    console.log('📋 Events table check:', tableCheck.rows);
    
    // Test events count
    const eventCount = await db.execute(sql`SELECT COUNT(*) FROM events`);
    console.log('📊 Events count:', eventCount.rows);
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      eventsTable: tableCheck.rows.length > 0 ? 'exists' : 'missing',
      eventsCount: eventCount.rows[0]?.count || 0,
      message: 'Diagnostic check completed successfully'
    });
  } catch (error) {
    console.error('❌ Diagnostic check failed:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}