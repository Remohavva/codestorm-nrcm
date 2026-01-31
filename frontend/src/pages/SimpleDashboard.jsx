import { useAuth } from '../contexts/AuthContext';

function SimpleDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/simple-login';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      color: '#ffffff', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1>Dashboard</h1>
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{
          padding: '2rem',
          background: '#1a1a1a',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h2>Welcome!</h2>
          <p>You are successfully logged in.</p>
        </div>

        <div style={{
          padding: '2rem',
          background: '#1a1a1a',
          borderRadius: '8px'
        }}>
          <h3>User Information:</h3>
          <pre style={{ 
            background: '#0a0a0a', 
            padding: '1rem', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default SimpleDashboard;