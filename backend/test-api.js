// Comprehensive API testing script
require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Test data
let testUsers = {};
let testTokens = {};
let testClub = null;
let testEvent = null;

async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
}

async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  const result = await makeRequest('GET', '/health');
  
  if (result.success) {
    console.log('✅ Health check passed');
    return true;
  } else {
    console.log('❌ Health check failed:', result.error);
    return false;
  }
}

async function testUserRegistration() {
  console.log('\n👤 Testing User Registration...');
  
  const users = [
    { name: 'Student User', email: 'student@test.com', password: 'password123', role: 'student' },
    { name: 'Club Lead User', email: 'clublead@test.com', password: 'password123', role: 'club_lead' },
    { name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'admin' }
  ];

  for (const user of users) {
    const result = await makeRequest('POST', '/api/auth/register', user);
    
    if (result.success) {
      console.log(`✅ Registered ${user.role}: ${user.email}`);
      testUsers[user.role] = result.data.data.user;
    } else {
      console.log(`❌ Failed to register ${user.role}:`, result.error);
      return false;
    }
  }
  
  return true;
}

async function testUserLogin() {
  console.log('\n🔐 Testing User Login...');
  
  const logins = [
    { email: 'student@test.com', password: 'password123', role: 'student' },
    { email: 'clublead@test.com', password: 'password123', role: 'club_lead' },
    { email: 'admin@test.com', password: 'password123', role: 'admin' }
  ];

  for (const login of logins) {
    const loginData = { email: login.email, password: login.password }; // Remove role from login
    const result = await makeRequest('POST', '/api/auth/login', loginData);
    
    if (result.success) {
      console.log(`✅ Logged in ${login.role}: ${login.email}`);
      testTokens[login.role] = result.data.data.session.access_token;
    } else {
      console.log(`❌ Failed to login ${login.role}:`, result.error);
      return false;
    }
  }
  
  return true;
}

async function testClubCreation() {
  console.log('\n🏛️ Testing Club Creation...');
  
  const clubData = {
    name: 'Test Tech Club',
    description: 'A club for testing technology'
  };

  const result = await makeRequest('POST', '/api/clubs', clubData, testTokens.club_lead);
  
  if (result.success) {
    console.log('✅ Club created successfully');
    testClub = result.data.data.club;
    return true;
  } else {
    console.log('❌ Failed to create club:', result.error);
    return false;
  }
}

async function testEventCreation() {
  console.log('\n📅 Testing Event Creation...');
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const eventData = {
    title: 'Test Tech Meetup',
    description: 'A test event for our tech club',
    date: tomorrow.toISOString(),
    venue: 'Test Auditorium',
    capacity: 50,
    club_id: testClub.id
  };

  const result = await makeRequest('POST', '/api/events', eventData, testTokens.club_lead);
  
  if (result.success) {
    console.log('✅ Event created successfully');
    testEvent = result.data.data.event;
    return true;
  } else {
    console.log('❌ Failed to create event:', result.error);
    return false;
  }
}

async function testEventApproval() {
  console.log('\n✅ Testing Event Approval...');
  
  const result = await makeRequest('PUT', `/api/events/${testEvent.id}/approve`, {}, testTokens.admin);
  
  if (result.success) {
    console.log('✅ Event approved successfully');
    testEvent = result.data.data.event;
    return true;
  } else {
    console.log('❌ Failed to approve event:', result.error);
    return false;
  }
}

async function testEventRegistration() {
  console.log('\n📝 Testing Event Registration...');
  
  const result = await makeRequest('POST', `/api/events/${testEvent.id}/register`, {}, testTokens.student);
  
  if (result.success) {
    console.log('✅ Student registered for event successfully');
    return true;
  } else {
    console.log('❌ Failed to register for event:', result.error);
    return false;
  }
}

async function testGetUserRegistrations() {
  console.log('\n📋 Testing Get User Registrations...');
  
  const result = await makeRequest('GET', '/api/users/me/registrations', null, testTokens.student);
  
  if (result.success) {
    console.log(`✅ Retrieved ${result.data.data.registrations.length} registrations`);
    return true;
  } else {
    console.log('❌ Failed to get registrations:', result.error);
    return false;
  }
}

async function testEventCheckin() {
  console.log('\n✅ Testing Event Check-in...');
  
  const result = await makeRequest('POST', `/api/events/${testEvent.id}/checkin`, {}, testTokens.student);
  
  if (result.success) {
    console.log('✅ Student checked in successfully');
    return true;
  } else {
    console.log('❌ Failed to check in:', result.error);
    return false;
  }
}

async function testAdminAnalytics() {
  console.log('\n📊 Testing Admin Analytics...');
  
  const result = await makeRequest('GET', '/api/admin/analytics', null, testTokens.admin);
  
  if (result.success) {
    console.log('✅ Admin analytics retrieved successfully');
    console.log(`   - Total users: ${result.data.data.stats.overview.total_users}`);
    console.log(`   - Total clubs: ${result.data.data.stats.overview.total_clubs}`);
    console.log(`   - Total events: ${result.data.data.stats.overview.total_events}`);
    return true;
  } else {
    console.log('❌ Failed to get analytics:', result.error);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive API Tests...');
  console.log('=====================================');

  const tests = [
    testHealthCheck,
    testUserRegistration,
    testUserLogin,
    testClubCreation,
    testEventCreation,
    testEventApproval,
    testEventRegistration,
    testGetUserRegistrations,
    testEventCheckin,
    testAdminAnalytics
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n=====================================');
  console.log('🏁 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your API is working perfectly!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }
}

// Add axios to package.json if not already there
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };