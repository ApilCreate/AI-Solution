import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

async function testApiEndpoints() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test inquiries list
    console.log('📋 Testing /api/inquiries/list');
    const inquiriesResponse = await fetch(`${baseUrl}/api/inquiries/list`);
    if (inquiriesResponse.ok) {
      const inquiriesData = await inquiriesResponse.json();
      console.log(`✅ Found ${inquiriesData.length} inquiries`);
    } else {
      console.log(`❌ Failed: ${inquiriesResponse.status}`);
    }

    // Test analytics overview
    console.log('\n📊 Testing /api/analytics/overview');
    const overviewResponse = await fetch(`${baseUrl}/api/analytics/overview`);
    if (overviewResponse.ok) {
      const overviewData = await overviewResponse.json();
      console.log('✅ Overview data:', overviewData);
    } else {
      console.log(`❌ Failed: ${overviewResponse.status}`);
    }

    // Test by-country analytics
    console.log('\n🌍 Testing /api/analytics/by-country');
    const countryResponse = await fetch(`${baseUrl}/api/analytics/by-country`);
    if (countryResponse.ok) {
      const countryData = await countryResponse.json();
      console.log(`✅ Found ${countryData.length} countries:`, countryData);
    } else {
      console.log(`❌ Failed: ${countryResponse.status}`);
    }

    // Test by-reason analytics
    console.log('\n🎯 Testing /api/analytics/by-reason');
    const reasonResponse = await fetch(`${baseUrl}/api/analytics/by-reason`);
    if (reasonResponse.ok) {
      const reasonData = await reasonResponse.json();
      console.log(`✅ Found ${reasonData.length} reasons:`, reasonData);
    } else {
      console.log(`❌ Failed: ${reasonResponse.status}`);
    }

    // Test over-time analytics
    console.log('\n📈 Testing /api/analytics/over-time');
    const timeResponse = await fetch(`${baseUrl}/api/analytics/over-time`);
    if (timeResponse.ok) {
      const timeData = await timeResponse.json();
      console.log(`✅ Found ${timeData.length} time periods:`, timeData);
    } else {
      console.log(`❌ Failed: ${timeResponse.status}`);
    }

    console.log('\n🎉 API testing completed!');

  } catch (error) {
    console.error('❌ API testing failed:', error);
  }
}

// Run the test
testApiEndpoints();
