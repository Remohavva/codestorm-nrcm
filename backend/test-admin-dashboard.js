const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAdminDashboard() {
  try {
    console.log('🧪 Testing Admin Dashboard API...\n');

    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@university.edu',
      password: 'password123'
    });

    const token = loginResponse.data.data.session.access_token;
    console.log('✅ Login successful');

    // Set up headers for authenticated requests
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Step 2: Test admin dashboard endpoint
    console.log('\n2. Testing admin dashboard endpoint...');
    const dashboardResponse = await axios.get(`${API_BASE}/admin/dashboard`, { headers });
    
    console.log('✅ Dashboard data retrieved successfully');
    console.log('📊 Dashboard Stats:');
    console.log(`   Total Users: ${dashboardResponse.data.data.stats.overview.total_users}`);
    console.log(`   Total Clubs: ${dashboardResponse.data.data.stats.overview.total_clubs}`);
    console.log(`   Total Events: ${dashboardResponse.data.data.stats.overview.total_events}`);
    console.log(`   Pending Events: ${dashboardResponse.data.data.stats.event_status.pending}`);

    // Step 3: Test admin alerts
    console.log('\n3. Testing admin alerts endpoint...');
    const alertsResponse = await axios.get(`${API_BASE}/admin/alerts`, { headers });
    
    console.log('✅ Alerts retrieved successfully');
    console.log(`📢 Active Alerts: ${alertsResponse.data.data.alerts.length}`);
    
    if (alertsResponse.data.data.alerts.length > 0) {
      alertsResponse.data.data.alerts.forEach((alert, index) => {
        console.log(`   ${index + 1}. ${alert.title}: ${alert.message}`);
      });
    }

    // Step 4: Test analytics endpoint (legacy)
    console.log('\n4. Testing legacy analytics endpoint...');
    const analyticsResponse = await axios.get(`${API_BASE}/admin/analytics`, { headers });
    
    console.log('✅ Analytics data retrieved successfully');

    // Step 5: Test user management
    console.log('\n5. Testing user management endpoint...');
    const usersResponse = await axios.get(`${API_BASE}/admin/users?limit=5`, { headers });
    
    console.log('✅ Users data retrieved successfully');
    console.log(`👥 Total Users Retrieved: ${usersResponse.data.data.users.length}`);

    // Step 6: Test event management
    console.log('\n6. Testing event management endpoint...');
    const eventsResponse = await axios.get(`${API_BASE}/admin/events?limit=5`, { headers });
    
    console.log('✅ Events data retrieved successfully');
    console.log(`📅 Total Events Retrieved: ${eventsResponse.data.data.events.length}`);

    console.log('\n🎉 All admin dashboard tests passed successfully!');
    console.log('\n📋 API Endpoints tested:');
    console.log('   ✅ POST /api/auth/login');
    console.log('   ✅ GET /api/admin/dashboard');
    console.log('   ✅ GET /api/admin/alerts');
    console.log('   ✅ GET /api/admin/analytics');
    console.log('   ✅ GET /api/admin/users');
    console.log('   ✅ GET /api/admin/events');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Tip: Make sure you have an admin user created. Run: node setup-admin.js');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tip: Make sure your backend server is running on port 3000');
    }
  }
}

// Run the test
testAdminDashboard();