#!/usr/bin/env tsx

async function testLoginPerformance() {
  console.log('🧪 Testing login performance...');
  
  const startTime = Date.now();
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
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
    const duration = endTime - startTime;
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log(`⚡ Response time: ${duration}ms`);
      console.log('👤 User:', data.user?.email);
      
      if (duration > 2000) {
        console.log('⚠️  Warning: Login took longer than 2 seconds');
      } else if (duration > 1000) {
        console.log('🟡 Login response time is acceptable but could be improved');
      } else {
        console.log('🟢 Login response time is excellent!');
      }
    } else {
      console.log('❌ Login failed:', response.status);
      const errorData = await response.text();
      console.log('Error details:', errorData);
    }
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log('❌ Login test failed after', duration + 'ms');
    console.log('Error:', error);
  }
}

testLoginPerformance();