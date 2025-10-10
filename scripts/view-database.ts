import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

import { db } from '../db';
import { adminUsers, inquiries, events, eventRsvps } from '../db/schema';

async function viewDatabase() {
  try {
    console.log(' Database Verification Report');
    console.log('================================\n');

    // Check admin users
    console.log(' Admin Users:');
    const admins = await db.select().from(adminUsers);
    console.log(`   Total: ${admins.length} users`);
    admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. Email: ${admin.email}`);
      console.log(`      Role: ${admin.role}`);
      console.log(`      Created: ${admin.createdAt}`);
      console.log('');
    });

    // Check inquiries
    console.log(' Inquiries:');
    const allInquiries = await db.select().from(inquiries);
    console.log(`   Total: ${allInquiries.length} inquiries`);
    allInquiries.forEach((inquiry, index) => {
      console.log(`   ${index + 1}. ${inquiry.name} (${inquiry.email})`);
      console.log(`      Company: ${inquiry.company || 'N/A'}`);
      console.log(`      Subject: ${inquiry.messageTitle}`);
      console.log(`      Status: ${inquiry.status}`);
      console.log(`      Reason: ${inquiry.reason}`);
      console.log(`      Tags: ${JSON.stringify(inquiry.tags)}`);
      console.log(`      Created: ${inquiry.createdAt}`);
      console.log('');
    });

    // Check events
    console.log(' Events:');
    const allEvents = await db.select().from(events);
    console.log(`   Total: ${allEvents.length} events`);
    if (allEvents.length > 0) {
      allEvents.forEach((event, index) => {
        console.log(`   ${index + 1}. ${event.title}`);
        console.log(`      Date: ${event.date}`);
        console.log(`      Location: ${event.location}`);
        console.log('');
      });
    } else {
      console.log('   No events found (ready for data)\n');
    }

    // Check event RSVPs
    console.log(' Event RSVPs:');
    const allRsvps = await db.select().from(eventRsvps);
    console.log(`   Total: ${allRsvps.length} RSVPs`);
    if (allRsvps.length > 0) {
      allRsvps.forEach((rsvp, index) => {
        console.log(`   ${index + 1}. ${rsvp.name} (${rsvp.email})`);
        console.log(`      Event ID: ${rsvp.eventId}`);
        console.log(`      Attendees: ${rsvp.attendees}`);
        console.log('');
      });
    } else {
      console.log('   No RSVPs found (ready for data)\n');
    }

    // Summary
    console.log('Summary:');
    console.log(` Tables: 4 (admin_users, inquiries, events, event_rsvps)`);
    console.log(` Admin Users: ${admins.length}`);
    console.log(` Inquiries: ${allInquiries.length}`);
    console.log(` Events: ${allEvents.length}`);
    console.log(` RSVPs: ${allRsvps.length}`);
    console.log('\nDatabase setup is complete and working correctly!');
    
    return true;

  } catch (error) {
    console.error('Error viewing database:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  viewDatabase()
    .then((success) => {
      process.exit(success ? 0 : 1);
    });
}

export { viewDatabase };
