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