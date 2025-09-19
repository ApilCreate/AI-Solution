import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { inquiries } from '../db/schema';
import { eq, notInArray } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found in environment variables');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Approved inquiry reasons only
const APPROVED_REASONS = [
  'General Inquiry',
  'Technical Support', 
  'Book a Demo',
  'Careers',
  'Partnerships',
  'Events Inquiry'
];

async function cleanupInquiries() {
  try {
    console.log('🧹 Starting inquiry database cleanup...');
    console.log('=============================================');
    
    // First, let's see what reasons exist currently
    console.log('\n📊 Current inquiry reasons analysis:');
    const allInquiries = await db.select().from(inquiries);
    
    const reasonCounts: Record<string, number> = {};
    const inquiriesToDelete: string[] = [];
    const inquiriesToKeep: string[] = [];
    
    allInquiries.forEach(inquiry => {
      const reason = inquiry.reason || 'No Reason';
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      
      if (APPROVED_REASONS.includes(inquiry.reason || '')) {
        inquiriesToKeep.push(inquiry.id);
      } else {
        inquiriesToDelete.push(inquiry.id);
      }
    });
    
    console.log('\nReason distribution:');
    Object.entries(reasonCounts).forEach(([reason, count]) => {
      const status = APPROVED_REASONS.includes(reason) ? '✅ KEEP' : '❌ DELETE';
      console.log(`  ${reason}: ${count} inquiries - ${status}`);
    });
    
    console.log(`\n📈 Summary:`);
    console.log(`  Total inquiries: ${allInquiries.length}`);
    console.log(`  Inquiries to keep: ${inquiriesToKeep.length}`);
    console.log(`  Inquiries to delete: ${inquiriesToDelete.length}`);
    
    if (inquiriesToDelete.length === 0) {
      console.log('\n✅ No cleanup needed! All inquiries already have approved reasons.');
      return;
    }
    
    // Confirm deletion
    console.log('\n⚠️  WARNING: This will permanently delete the following inquiries:');
    const toDelete = allInquiries.filter(inq => inquiriesToDelete.includes(inq.id));
    toDelete.forEach(inquiry => {
      console.log(`  - ID ${inquiry.id}: ${inquiry.name} (${inquiry.email}) - Reason: "${inquiry.reason}"`);
    });
    
    console.log('\n🗑️  Proceeding with deletion...');
    
    // Delete inquiries with non-approved reasons
    const result = await db
      .delete(inquiries)
      .where(notInArray(inquiries.reason, APPROVED_REASONS));
    
    console.log(`\n✅ Cleanup completed!`);
    console.log(`   Deleted ${inquiriesToDelete.length} inquiries with non-approved reasons`);
    console.log(`   Kept ${inquiriesToKeep.length} inquiries with approved reasons`);
    
    // Show final state
    console.log('\n📊 Final inquiry reasons:');
    const finalInquiries = await db.select().from(inquiries);
    const finalReasonCounts: Record<string, number> = {};
    
    finalInquiries.forEach(inquiry => {
      const reason = inquiry.reason || 'No Reason';
      finalReasonCounts[reason] = (finalReasonCounts[reason] || 0) + 1;
    });
    
    APPROVED_REASONS.forEach(reason => {
      const count = finalReasonCounts[reason] || 0;
      console.log(`  ${reason}: ${count} inquiries`);
    });
    
    console.log(`\n🎉 Database cleanup completed successfully!`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

// Run the cleanup
cleanupInquiries()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });