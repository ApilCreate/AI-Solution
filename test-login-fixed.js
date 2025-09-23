#!/usr/bin/env node

/**
 * 🔧 FINAL LOGIN TEST
 * Test login after removing NextAuth conflicts
 */

async function testLoginFixed() {
    console.log('🔧 Testing Login After NextAuth Removal...\n');
    
    try {
        console.log('🎯 TESTING LOGIN WITH PORT 3000...');
        
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });
        
        if (loginResponse.ok) {
            const data = await loginResponse.json();
            console.log('✅ LOGIN API WORKING:', data);
            
            const cookies = loginResponse.headers.get('set-cookie');
            if (cookies) {
                console.log('✅ COOKIES SET CORRECTLY');
                
                // Test session
                const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
                    headers: { 'Cookie': cookies }
                });
                
                if (sessionResponse.ok) {
                    const sessionData = await sessionResponse.json();
                    console.log('✅ SESSION VALIDATION WORKING:', sessionData);
                } else {
                    console.log('❌ Session validation failed');
                }
            }
        } else {
            console.log('❌ Login failed:', await loginResponse.text());
        }
        
    } catch (error) {
        console.log('❌ Connection error - check if server is running');
    }
    
    console.log('\n🚀 MANUAL TEST:');
    console.log('1. Go to: http://localhost:3000/admin/login');
    console.log('2. Enter: admin@example.com / admin123');
    console.log('3. Click Login');
    console.log('4. Should redirect to dashboard without NextAuth errors!');
}

testLoginFixed();