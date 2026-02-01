const axios = require('axios');
require('dotenv').config();

// Test the exact same API calls that the mobile app makes
const API_BASE = 'http://10.10.10.143:3002/api'; // Mobile app URL

async function testMobileAdminConnection() {
  console.log('🧪 Testing mobile app admin connection...\n');
  console.log('Using mobile API URL:', API_BASE);

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    try {
      const healthResponse = await axios.get(API_BASE.replace('/api', '/health'));
      console.log('✅ Health check successful');
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      console.log('💡 Make sure your computer IP is 10.10.10.143 and backend is running');
      return;
    }

    // Test 2: Login
    console.log('\n2. Testing login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'prajith2773@gmail.com',
      password: 'password123'
    });

    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.data.session?.access_token || loginResponse.data.data.token;
    const user = loginResponse.data.data.user;
    
    console.log('✅ Login successful');
    console.log('User:', user.name, 'Role:', user.role);

    if (user.role !== 'admin') {
      console.error('❌ User is not admin. Role:', user.role);
      return;
    }

    // Test 3: Admin Analytics (same as mobile app)
    console.log('\n3. Testing admin analytics...');
    try {
      const analyticsResponse = await axios.get(`${API_BASE}/admin/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Admin analytics working');
      console.log('Data structure check:', {
        hasStats: !!analyticsResponse.data.data.stats,
        hasOverview: !!analyticsResponse.data.data.stats?.overview,
        hasUserBreakdown: !!analyticsResponse.data.data.stats?.user_breakdown,
        hasRecentActivity: !!analyticsResponse.data.data.stats?.recent_activity
      });
    } catch (error) {
      console.error('❌ Admin analytics failed:', error.response?.status, error.response?.data);
    }

    // Test 4: Admin Users
    console.log('\n4. Testing admin users...');
    try {
      const usersResponse = await axios.get(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Admin users working');
      console.log('Users count:', usersResponse.data.data.users.length);
    } catch (error) {
      console.error('❌ Admin users failed:', error.response?.status, error.response?.data);
    }

    // Test 5: Community Analytics
    console.log('\n5. Testing community analytics...');
    try {
      const communityResponse = await axios.get(`${API_BASE}/admin/community/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Community analytics working');
      console.log('Data structure check:', {
        hasAnalytics: !!communityResponse.data.data.analytics,
        hasOverview: !!communityResponse.data.data.analytics?.overview,
        hasModeration: !!communityResponse.data.data.analytics?.moderation
      });
    } catch (error) {
      console.error('❌ Community analytics failed:', error.response?.status, error.response?.data);
    }

    console.log('\n🎉 Mobile admin connection test complete!');
    console.log('\n📱 If mobile app still has errors:');
    console.log('1. Check mobile app console logs');
    console.log('2. Verify network connectivity');
    console.log('3. Make sure you\'re logged in as admin user');
    console.log('4. Try restarting the mobile app');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection refused. Check:');
      console.log('1. Backend server is running (npm start)');
      console.log('2. Your computer IP is 10.10.10.143');
      console.log('3. Firewall allows connections on port 3002');
    }
  }
}

testMobileAdminConnection();