import { db, adminUsers, activityLogs } from '@/db';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

async function addSampleActivityLogs() {
  console.log('🔄 Adding sample activity logs...');

  try {
    // Get the admin user
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, 'admin@aisolutions.com'))
      .limit(1);

    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    // Create sample activity logs
    const sampleLogs = [
      {
        id: randomUUID(),
        adminId: admin.id,
        action: 'logged_in',
        description: `Admin ${admin.email} logged in successfully`,
        targetType: 'admin_account',
        targetId: admin.id,
        metadata: {
          email: admin.email,
          loginTime: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: randomUUID(),
        adminId: admin.id,
        action: 'inquiry_responded',
        description: 'Responded to inquiry from John Doe (john@example.com)',
        targetType: 'inquiry',
        targetId: randomUUID(),
        metadata: {
          inquiryTitle: 'Question about AI Solutions',
          responseLength: 245,
          updatedFields: ['adminResponse', 'status', 'respondedAt']
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
      },
      {
        id: randomUUID(),
        adminId: admin.id,
        action: 'inquiry_status_changed',
        description: 'Changed inquiry status from pending to resolved for Jane Smith',
        targetType: 'inquiry',
        targetId: randomUUID(),
        metadata: {
          oldStatus: 'pending',
          newStatus: 'resolved',
          inquiryTitle: 'Support Request',
          updatedFields: ['status']
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
      },
      {
        id: randomUUID(),
        adminId: admin.id,
        action: 'event_created',
        description: 'Created new event: AI Workshop 2025',
        targetType: 'event',
        targetId: randomUUID(),
        metadata: {
          eventTitle: 'AI Workshop 2025',
          eventDate: '2025-02-15',
          location: 'Tech Center'
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
      },
      {
        id: randomUUID(),
        adminId: admin.id,
        action: 'admin_accessed_analytics',
        description: 'Viewed analytics dashboard',
        targetType: 'admin_account',
        targetId: admin.id,
        metadata: {
          section: 'analytics',
          timeSpent: '00:03:45'
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1000 * 60 * 2) // 2 minutes ago
      }
    ];

    // Insert sample logs
    await db.insert(activityLogs).values(sampleLogs);

    console.log(`✅ Added ${sampleLogs.length} sample activity logs`);
    console.log('🎉 Sample data created successfully!');

  } catch (error) {
    console.error('❌ Error adding sample activity logs:', error);
    throw error;
  }
}

async function main() {
  try {
    await addSampleActivityLogs();
    console.log('🎯 You can now view the activity logs in the admin settings page!');
  } catch (error) {
    console.error('💥 Failed to add sample data:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { addSampleActivityLogs };