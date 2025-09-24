import { db } from './db/index';
import { adminUsers } from './db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function setupAdminUser() {
  try {
    console.log('Setting up admin user...');
    
    const email = 'admin@aisolutions.com';
    const password = 'admin123';
    
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);
    
    if (existingUser) {
      console.log('Admin user already exists. Updating password...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update the existing user
      await db
        .update(adminUsers)
        .set({ passwordHash: hashedPassword })
        .where(eq(adminUsers.email, email));
        
      console.log('✅ Admin user password updated successfully!');
    } else {
      console.log('Creating new admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new admin user
      await db.insert(adminUsers).values({
        email: email,
        passwordHash: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Admin user created successfully!');
    }
    
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
  }
}

setupAdminUser();