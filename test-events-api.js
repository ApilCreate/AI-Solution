async function testAPI() {
  try {
    console.log('🔍 Testing database connection...');
    const dbResponse = await fetch('http://localhost:3001/api/test-db');
    console.log('DB Response status:', dbResponse.status);
    
    if (dbResponse.ok) {
      const dbData = await dbResponse.json();
      console.log('✅ Database test:', dbData);
    } else {
      const dbText = await dbResponse.text();
      console.log('❌ Database test failed:', dbText);
    }

    console.log('\n🔍 Testing events API...');
    const eventsResponse = await fetch('http://localhost:3001/api/events/list');
    console.log('Events Response status:', eventsResponse.status);
    console.log('Events Response headers:', Object.fromEntries(eventsResponse.headers.entries()));
    
    if (eventsResponse.ok) {
      const eventsData = await eventsResponse.json();
      console.log('✅ Events API success:', eventsData);
    } else {
      const eventsText = await eventsResponse.text();
      console.log('❌ Events API failed:', eventsText);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAPI();