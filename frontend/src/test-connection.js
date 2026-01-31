// Simple test to check frontend-backend connection
const testConnection = async () => {
  try {
    console.log('Testing connection to backend...');
    
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();
    
    console.log('✅ Backend connection successful:', data);
    
    // Test registration
    const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Frontend Test User',
        email: 'frontend@test.com',
        password: 'password123',
        role: 'student'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('✅ Registration test:', registerData);
    
    // Test login
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'frontend@test.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login test:', loginData);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
};

// Run test when page loads
if (typeof window !== 'undefined') {
  window.testConnection = testConnection;
  console.log('Run testConnection() in console to test backend connection');
}

export default testConnection;