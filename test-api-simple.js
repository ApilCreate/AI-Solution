import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/inquiries/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📦 Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testAPI();