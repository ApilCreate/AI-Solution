#!/usr/bin/env node

/**
 * 🔑 LOGIN TEST SCRIPT
 * Test the complete login flow to ensure it's working
 */

async function testLogin() {
    console.log('🔑 Testing Login Process...\n');
    
    try {
        console.log('1. Testing login API with correct credentials...');
        
        const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });
        
        console.log('Login Response Status:', loginResponse.status);
        
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log('✅ LOGIN SUCCESS:', loginData);
            
            // Check if cookie was set
            const cookies = loginResponse.headers.get('set-cookie');
            console.log('🍪 Cookies set:', cookies ? 'YES' : 'NO');
            
            if (cookies && cookies.includes('admin-session')) {
                console.log('✅ Session cookie set correctly');
                
                // Test session validation
                console.log('\n2. Testing session validation...');
                
                const sessionResponse = await fetch('http://localhost:3001/api/auth/session', {
                    method: 'GET',
                    headers: {
                        'Cookie': cookies
                    }
                });
                
                console.log('Session Response Status:', sessionResponse.status);
                
                if (sessionResponse.ok) {
                    const sessionData = await sessionResponse.json();
                    console.log('✅ SESSION VALID:', sessionData);
                    
                    if (sessionData.isAuthenticated) {
                        console.log('✅ AUTHENTICATION COMPLETE: Login flow working correctly');
                    } else {
                        console.log('❌ Session not marked as authenticated');
                    }
                } else {
                    console.log('❌ Session validation failed');
                    const errorData = await sessionResponse.text();
                    console.log('Error:', errorData);
                }
            } else {
                console.log('❌ Session cookie not set properly');
            }
        } else {
            console.log('❌ LOGIN FAILED');
            const errorData = await loginResponse.text();
            console.log('Error:', errorData);
        }
        
        console.log('\n📋 INSTRUCTIONS:');
        console.log('1. Go to: http://localhost:3001/admin/login');
        console.log('2. Enter email: admin@example.com');
        console.log('3. Enter password: admin123');
        console.log('4. Click Login');
        console.log('5. Should redirect to dashboard');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testLogin();