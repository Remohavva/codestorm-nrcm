// Simple utility to test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();
    console.log('✅ Backend connection successful:', data);
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
};

// Test API endpoints
export const testAPIEndpoints = async () => {
  const endpoints = [
    { name: 'Health Check', url: '/health' },
    { name: 'Events', url: '/api/events' },
    { name: 'Clubs', url: '/api/clubs' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3001${endpoint.url}`);
      const data = await response.json();
      console.log(`✅ ${endpoint.name}:`, data);
    } catch (error) {
      console.error(`❌ ${endpoint.name} failed:`, error);
    }
  }
};

// Test login functionality
export const testLogin = async () => {
  try {
    console.log('🧪 Testing login...');
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    console.log('Login test result:', response.status, data);
    return data;
  } catch (error) {
    console.error('❌ Login test failed:', error);
    return null;
  }
};

// Test registration functionality
export const testRegistration = async () => {
  try {
    console.log('🧪 Testing registration...');
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        role: 'student'
      })
    });
    
    const data = await response.json();
    console.log('Registration test result:', response.status, data);
    return data;
  } catch (error) {
    console.error('❌ Registration test failed:', error);
    return null;
  }
};