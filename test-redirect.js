#!/usr/bin/env node

/**
 * 🔒 QUICK REDIRECT TEST
 * Test that accessing admin dashboard without auth redirects properly
 */

async function testRedirect() {
    console.log('🔒 Testing Direct URL Access...\n');
    
    try {
        const response = await fetch('http://localhost:3001/admin/dashboard', {
            method: 'GET',
            redirect: 'manual' // Don't follow redirects
        });
        
        console.log('Response Status:', response.status);
        console.log('Response Headers:', [...response.headers.entries()]);
        
        if (response.status === 307 || response.status === 302) {
            const location = response.headers.get('location');
            console.log('✅ REDIRECT WORKING: Redirects to', location);
            
            if (location && location.includes('/admin/login')) {
                console.log('✅ CORRECT: Redirects to login page');
            } else {
                console.log('❌ INCORRECT: Does not redirect to login page');
            }
        } else {
            console.log('❌ NO REDIRECT: Dashboard accessible without authentication');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testRedirect();