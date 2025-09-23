#!/usr/bin/env node

/**
 * 🔍 DEBUG LOGIN SCRIPT
 * Detailed debugging of login process
 */

async function debugLogin() {
    console.log('🔍 Debugging Login Process...\n');
    
    // Test 1: Check if server is running
    console.log('1. Checking if server is running...');
    try {
        const pingResponse = await fetch('http://localhost:3001/api/auth/session');
        console.log('✅ Server is running on port 3001');
    } catch (error) {
        console.log('❌ Server connection failed:', error.message);
        console.log('🔄 Trying port 3000...');
        try {
            const pingResponse = await fetch('http://localhost:3000/api/auth/session');
            console.log('✅ Server is running on port 3000');
        } catch (error2) {
            console.log('❌ Server not accessible on either port');
            return;
        }
    }
    
    console.log('\n📋 MANUAL TEST INSTRUCTIONS:');
    console.log('1. Open browser to: http://localhost:3001/admin/login (or 3000 if that failed)');
    console.log('2. Enter email: admin@example.com');
    console.log('3. Enter password: admin123');
    console.log('4. Click Login button');
    console.log('5. Check browser console for any errors');
    console.log('6. Should redirect to /admin/dashboard');
    
    console.log('\n🛠️  TROUBLESHOOTING:');
    console.log('- If login button does nothing: Check browser console for errors');
    console.log('- If "Invalid credentials": Check if admin user exists in database');
    console.log('- If page won\'t load: Ensure development server is running');
    console.log('- If redirect fails: Check AdminGuard authentication logic');
    
    console.log('\n🚀 LOGIN CREDENTIALS:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
}

debugLogin();