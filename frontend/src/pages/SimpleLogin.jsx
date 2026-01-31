import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function SimpleLogin() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('🔄 Starting login process...');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);

    try {
      console.log('📡 Calling login API...');
      const user = await login(email, password);
      console.log('✅ Login successful:', user);
      setSuccess('Login successful! Redirecting...');
      
      // Redirect based on user role
      setTimeout(() => {
        navigate('/simple-dashboard');
      }, 1000);
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    console.log('🧪 Testing direct API call...');
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      console.log('📊 Direct API response:', response.status, data);
      setSuccess(`Direct API test: ${response.status} - ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('❌ Direct API test failed:', error);
      setError(`Direct API test failed: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      color: '#ffffff', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h1>Simple Login Test</h1>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#1a1a1a',
                color: '#ffffff',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#1a1a1a',
                color: '#ffffff',
                border: '1px solid #333',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button 
          onClick={testDirectAPI}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          Test Direct API Call
        </button>

        {error && (
          <div style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '1rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {success}
          </div>
        )}

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#1a1a1a', 
          borderRadius: '4px',
          fontSize: '0.875rem'
        }}>
          <h3>Debug Info:</h3>
          <p>API Base URL: {import.meta.env.VITE_API_URL || 'http://localhost:3001'}</p>
          <p>Current Email: {email}</p>
          <p>Current Password: {password}</p>
        </div>
      </div>
    </div>
  );
}

export default SimpleLogin;