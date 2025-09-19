import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSimple } from '@/app/lib/simple-auth';
import { db, inquiries, withRetry } from '@/db';
import { sendAdminResponseEmail } from '@/app/lib/mail';
import { logInfo, logError } from '@/app/lib/logger';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    await requireAdminSimple();
    
    const results = {
      timestamp: new Date().toISOString(),
      tests: {} as Record<string, any>
    };

    // Test 1: Database Connection
    try {
      const startTime = Date.now();
      const testQuery = await withRetry(async () => {
        return await db
          .select()
          .from(inquiries)
          .orderBy(desc(inquiries.createdAt))
          .limit(1);
      });
      const endTime = Date.now();
      
      results.tests.database = {
        status: 'success',
        responseTime: `${endTime - startTime}ms`,
        recordCount: testQuery.length,
        latestInquiry: testQuery[0] ? {
          id: testQuery[0].id,
          email: testQuery[0].email,
          createdAt: testQuery[0].createdAt
        } : null
      };
    } catch (error) {
      results.tests.database = {
        status: 'error',
        error: error instanceof Error ? error.message : String(error)
      };
    }

    // Test 2: Email Configuration
    results.tests.emailConfig = {
      resendConfigured: !!process.env.RESEND_API_KEY,
      adminEmail: process.env.ADMIN_EMAIL || 'Not configured',
      fromEmail: process.env.FROM_EMAIL || 'Not configured',
      apiKeyLength: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0
    };

    // Test 3: Database Retry Logic
    try {
      const retryStartTime = Date.now();
      let attempts = 0;
      
      const testRetry = await withRetry(async () => {
        attempts++;
        const result = await db
          .select()
          .from(inquiries)
          .limit(5);
        return result;
      });
      
      const retryEndTime = Date.now();
      
      results.tests.retryLogic = {
        status: 'success',
        attempts: attempts,
        responseTime: `${retryEndTime - retryStartTime}ms`,
        recordsReturned: testRetry.length
      };
    } catch (error) {
      results.tests.retryLogic = {
        status: 'error',
        error: error instanceof Error ? error.message : String(error)
      };
    }

    return NextResponse.json(results);

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSimple();
    
    const { testType, email } = await request.json();
    
    if (!testType) {
      return NextResponse.json(
        { error: 'testType is required' },
        { status: 400 }
      );
    }

    const results = {
      timestamp: new Date().toISOString(),
      testType,
      result: {} as any
    };

    switch (testType) {
      case 'email':
        if (!email) {
          return NextResponse.json(
            { error: 'email is required for email test' },
            { status: 400 }
          );
        }

        try {
          const startTime = Date.now();
          await sendAdminResponseEmail(
            {
              id: 'diagnostic-test-' + Date.now(),
              name: 'Diagnostic Test',
              email: email,
              messageTitle: 'Email Delivery Test'
            },
            'This is a diagnostic test email. If you receive this, the email delivery system is working correctly.\n\nTest details:\n- Timestamp: ' + new Date().toISOString() + '\n- From: ' + (process.env.FROM_EMAIL || 'not configured') + '\n- API Key configured: ' + (!!process.env.RESEND_API_KEY)
          );
          const endTime = Date.now();

          results.result = {
            status: 'success',
            message: 'Email sent successfully',
            responseTime: `${endTime - startTime}ms`,
            recipientEmail: email,
            fromEmail: process.env.FROM_EMAIL
          };

        } catch (error) {
          results.result = {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
            recipientEmail: email
          };
        }
        break;

      case 'database-stress':
        try {
          const queries = [];
          const startTime = Date.now();
          
          // Run 5 concurrent database queries
          for (let i = 0; i < 5; i++) {
            queries.push(
              withRetry(async () => {
                return await db
                  .select()
                  .from(inquiries)
                  .limit(10)
                  .offset(i * 10);
              })
            );
          }
          
          const queryResults = await Promise.all(queries);
          const endTime = Date.now();
          
          results.result = {
            status: 'success',
            message: 'Database stress test completed',
            responseTime: `${endTime - startTime}ms`,
            queriesExecuted: queries.length,
            totalRecords: queryResults.reduce((sum, result) => sum + result.length, 0)
          };

        } catch (error) {
          results.result = {
            status: 'error',
            error: error instanceof Error ? error.message : String(error)
          };
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid testType. Supported: email, database-stress' },
          { status: 400 }
        );
    }

    return NextResponse.json(results);

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}