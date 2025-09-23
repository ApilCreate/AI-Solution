#!/usr/bin/env tsx

// Quick login performance test
async function testLogin() {
  try {
    console.log('🔍 Testing login performance...');
    
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    const endTime = Date.now();
    const loginTime = endTime - startTime;
    
    const data = await response.json();
    
    console.log(`⏱️  Login API Response Time: ${loginTime}ms`);
    console.log(`✅ Login Status: ${response.status}`);
    console.log(`📝 Response:`, data);
    
    if (data.success) {
      console.log('✅ Login successful! Testing session check...');
      
      const sessionStart = Date.now();
      const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
        method: 'GET',
        headers: {
          'Cookie': response.headers.get('set-cookie') || ''
        }
      });
      const sessionEnd = Date.now();
      const sessionTime = sessionEnd - sessionStart;
      
      const sessionData = await sessionResponse.json();
      console.log(`⏱️  Session API Response Time: ${sessionTime}ms`);
      console.log(`✅ Session Status: ${sessionResponse.status}`);
      console.log(`📝 Session Data:`, sessionData);
      
      if (loginTime < 1000 && sessionTime < 500) {
        console.log('🚀 PERFORMANCE: EXCELLENT! Login is fast');
      } else if (loginTime < 3000 && sessionTime < 1000) {
        console.log('⚡ PERFORMANCE: GOOD');
      } else {
        console.log('⚠️  PERFORMANCE: Could be improved');
      }
    }
    
  } catch (error) {
    console.error('❌ Login test failed:', error);
  }
}

testLogin();