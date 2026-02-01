// Test script to verify past events API endpoint
require('dotenv').config();

const API_BASE_URL = 'http://localhost:3002/api';

async function testPastEventsAPI() {
  console.log('🧪 Testing Past Events API...\n');

  try {
    // Test past events endpoint
    console.log('📡 Calling:', `${API_BASE_URL}/events?status=approved&past=true`);
    
    const response = await fetch(`${API_BASE_URL}/events?status=approved&past=true`);
    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`✅ API Success: Found ${data.data.events.length} past events`);
      
      if (data.data.events.length > 0) {
        console.log('\n📋 Past Events:');
        data.data.events.forEach((event, index) => {
          console.log(`${index + 1}. ${event.title}`);
          console.log(`   Date: ${event.date}`);
          console.log(`   Venue: ${event.venue}`);
          console.log(`   Registrations: ${event.registration_count}/${event.capacity}`);
          console.log('');
        });
      } else {
        console.log('ℹ️  No past events found in database');
        console.log('💡 Tip: Run the certificate demo SQL scripts to create past events');
      }
    } else {
      console.log('❌ API Error:', data.message);
    }

  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running (npm start)');
    console.log('2. Check if the server is running on port 3002');
    console.log('3. Verify the API endpoint exists');
  }
}

// Test upcoming events for comparison
async function testUpcomingEventsAPI() {
  console.log('\n🧪 Testing Upcoming Events API for comparison...\n');

  try {
    const response = await fetch(`${API_BASE_URL}/events?status=approved&upcoming=true`);
    const data = await response.json();
    
    console.log('📊 Upcoming Events Response:', response.status);
    
    if (data.success) {
      console.log(`✅ Found ${data.data.events.length} upcoming events`);
    } else {
      console.log('❌ Upcoming Events Error:', data.message);
    }

  } catch (error) {
    console.error('❌ Upcoming Events Network Error:', error.message);
  }
}

// Run tests
async function runTests() {
  await testPastEventsAPI();
  await testUpcomingEventsAPI();
  
  console.log('\n🎯 Next Steps:');
  console.log('1. If no past events found, run the certificate demo SQL scripts');
  console.log('2. Check the mobile app console logs for API calls');
  console.log('3. Verify the mobile app is calling the correct API endpoint');
}

runTests();