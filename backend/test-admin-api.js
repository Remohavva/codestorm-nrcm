const axios = require('axios');
require('dotenv').config();

const API_BASE = 'http://localhost:3002/api';

async function testAdminAPI() {
  console.log('🧪 Testing Admin API endpoints...\n');

  try {
    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'prajith2773@gmail.com',
      password: 'password123'
    });

    const loginData = loginResponse.data;
    console.log('Login response:', loginData.success ? '✅ Success' : '❌ Failed');

    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.message);
      return;
    }

    const token = loginData.data.session?.access_token || loginData.data.token;
    const user = loginData.data.user;
    
    console.log('✅ Login successful, user:', user.name, 'role:', user.role);

    if (user.role !== 'admin') {
      console.error('❌ User is not an admin. Current role:', user.role);
      return;
    }

    // Step 2: Test admin analytics
    console.log('\n2. Testing admin analytics...');
    try {
      const analyticsResponse = await axios.get(`${API_BASE}/admin/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Analytics API working');
      console.log('Stats preview:', {
        total_users: analyticsResponse.data.data.stats.overview.total_users,
        total_events: analyticsResponse.data.data.stats.overview.total_events,
        total_clubs: analyticsResponse.data.data.stats.overview.total_clubs
      });
    } catch (error) {
      console.error('❌ Analytics API failed:', error.response?.status, error.response?.data?.message);
    }

    // Step 3: Test admin users
    console.log('\n3. Testing admin users...');
    try {
      const usersResponse = await axios.get(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Users API working');
      console.log('Users count:', usersResponse.data.data.users.length);
    } catch (error) {
      console.error('❌ Users API failed:', error.response?.status, error.response?.data?.message);
    }

    // Step 4: Test admin events
    console.log('\n4. Testing admin events...');
    try {
      const eventsResponse = await axios.get(`${API_BASE}/admin/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Events API working');
      console.log('Events count:', eventsResponse.data.data.events.length);
    } catch (error) {
      console.error('❌ Events API failed:', error.response?.status, error.response?.data?.message);
    }

    // Step 5: Test pending events
    console.log('\n5. Testing pending events...');
    try {
      const pendingResponse = await axios.get(`${API_BASE}/admin/events/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Pending events API working');
      console.log('Pending events count:', pendingResponse.data.data.events.length);
    } catch (error) {
      console.error('❌ Pending events API failed:', error.response?.status, error.response?.data?.message);
    }

    // Step 6: Test community analytics
    console.log('\n6. Testing community analytics...');
    try {
      const communityResponse = await axios.get(`${API_BASE}/admin/community/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Community analytics API working');
      console.log('Community stats preview:', {
        total_posts: communityResponse.data.data.analytics.overview.total_posts,
        total_comments: communityResponse.data.data.analytics.overview.total_comments
      });
    } catch (error) {
      console.error('❌ Community analytics API failed:', error.response?.status, error.response?.data?.message);
    }

    console.log('\n🎉 Admin API testing complete!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAdminAPI();