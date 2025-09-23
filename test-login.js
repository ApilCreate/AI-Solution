// Simple test for login API
async function testLogin() {
  try {
    console.log('Testing login API...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@aisolutions.com',
        password: 'admin123'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Raw response:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('Parsed JSON:', data);
    } catch (parseError) {
      console.log('Failed to parse as JSON:', parseError.message);
      console.log('First 200 characters of response:', text.substring(0, 200));
    }
    
  } catch (error) {
    console.error('Request failed:', error);
  }
}

testLogin();