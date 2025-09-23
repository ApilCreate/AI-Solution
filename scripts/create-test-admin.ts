#!/usr/bin/env tsx

import { db } from '../db/index';
import { adminUsers } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function createTestAdmin() {
  try {
    console.log('🔧 Creating test admin user...');
    
    const email = 'admin@example.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if admin already exists
    const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    
    if (existingAdmin.length > 0) {
      console.log('✅ Admin user already exists:', email);
      console.log('📧 Email:', email);
      console.log('🔑 Password:', password);
      return;
    }

    // Create new admin
    const result = await db.insert(adminUsers).values({
      email,
      passwordHash: hashedPassword,
      role: 'admin'
    }).returning();

    console.log('✅ Test admin created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Admin ID:', result[0].id);
    
  } catch (error) {
    console.error('❌ Error creating test admin:', error);
  }
}

createTestAdmin();