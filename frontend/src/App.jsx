import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3002';

// Home page with portal selection
function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ paddingTop: '4rem', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CampusHub
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#9ca3af', marginBottom: '3rem' }}>
            Your gateway to campus clubs and events
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* Student Portal */}
          <div style={{ 
            backgroundColor: '#1f2937', 
            padding: '2rem', 
            borderRadius: '12px',
            border: '1px solid #374151',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => window.location.href = '/student/login'}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
            <h2 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Student Portal</h2>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
              Discover clubs, register for events, and manage your campus activities
            </p>
            <div style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              borderRadius: '6px',
              display: 'inline-block'
            }}>
              Enter as Student
            </div>
          </div>

          {/* Coordinator Portal */}
          <div style={{ 
            backgroundColor: '#1f2937', 
            padding: '2rem', 
            borderRadius: '12px',
            border: '1px solid #374151',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => window.location.href = '/coordinator/login'}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>Coordinator Portal</h2>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
              Manage your club, create events, and track registrations
            </p>
            <div style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#10b981', 
              color: 'white', 
              borderRadius: '6px',
              display: 'inline-block'
            }}>
              Enter as Coordinator
            </div>
          </div>

          {/* Admin Portal */}
          <div style={{ 
            backgroundColor: '#1f2937', 
            padding: '2rem', 
            borderRadius: '12px',
            border: '1px solid #374151',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => window.location.href = '/admin/login'}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
            <h2 style={{ color: '#f59e0b', marginBottom: '1rem' }}>Admin Portal</h2>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
              Approve events, manage users, and oversee platform operations
            </p>
            <div style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#f59e0b', 
              color: 'white', 
              borderRadius: '6px',
              display: 'inline-block'
            }}>
              Enter as Admin
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '2rem', 
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Demo Credentials</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
            <div>
              <strong style={{ color: '#60a5fa' }}>Student:</strong><br />
              student@university.edu<br />
              password123
            </div>
            <div>
              <strong style={{ color: '#10b981' }}>Coordinator:</strong><br />
              coordinator@university.edu<br />
              password123
            </div>
            <div>
              <strong style={{ color: '#f59e0b' }}>Admin:</strong><br />
              admin@university.edu<br />
              password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Student login page
function StudentLoginPage() {
  const [email, setEmail] = useState('student@university.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        const { user, session } = data.data;
        
        // Store auth data
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', session.access_token);
        
        // Redirect to student dashboard
        window.location.href = '/student/dashboard';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#9ca3af', 
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            ← Back to Home
          </button>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Student Portal</h1>
          <p style={{ color: '#9ca3af' }}>Access your campus activities</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '2rem', 
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <form onSubmit={handleLogin}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                Email:
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  backgroundColor: '#374151', 
                  border: '1px solid #6b7280', 
                  borderRadius: '6px', 
                  color: 'white',
                  fontSize: '14px'
                }} 
                required
                disabled={loading}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                Password:
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  backgroundColor: '#374151', 
                  border: '1px solid #6b7280', 
                  borderRadius: '6px', 
                  color: 'white',
                  fontSize: '14px'
                }} 
                required
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                backgroundColor: loading ? '#6b7280' : '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in as Student'}
            </button>
          </form>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#93c5fd'
          }}>
            <strong>Demo Credentials:</strong><br />
            Email: student@university.edu<br />
            Password: password123
          </div>
        </div>
      </div>
    </div>
  );
}
// Coordinator login page
function CoordinatorLoginPage() {
  const [email, setEmail] = useState('coordinator@university.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        const { user, session } = data.data;
        
        // Check if user is a coordinator
        if (user.role !== 'club_lead' && user.role !== 'admin') {
          setError('Access denied. Only club coordinators can access this portal.');
          return;
        }

        // Store auth data
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', session.access_token);
        
        // Redirect to dashboard
        window.location.href = '/coordinator/dashboard';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#9ca3af', 
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            ← Back to Home
          </button>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Coordinator Portal</h1>
          <p style={{ color: '#9ca3af' }}>Manage your club and events</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '2rem', 
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <form onSubmit={handleLogin}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                Email:
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  backgroundColor: '#374151', 
                  border: '1px solid #6b7280', 
                  borderRadius: '6px', 
                  color: 'white',
                  fontSize: '14px'
                }} 
                required
                disabled={loading}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                Password:
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  backgroundColor: '#374151', 
                  border: '1px solid #6b7280', 
                  borderRadius: '6px', 
                  color: 'white',
                  fontSize: '14px'
                }} 
                required
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                backgroundColor: loading ? '#6b7280' : '#10b981', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in as Coordinator'}
            </button>
          </form>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#6ee7b7'
          }}>
            <strong>Demo Credentials:</strong><br />
            Email: coordinator@university.edu<br />
            Password: password123
          </div>
        </div>
      </div>
    </div>
  );
}
  const [email, setEmail] = useState('coordinator@university.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        const { user, session } = data.data;
        
        // Check if user is a coordinator
        if (user.role !== 'club_lead' && user.role !== 'admin') {
          setError('Access denied. Only club coordinators can access this portal.');
          return;
        }

        // Store auth data
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', session.access_token);
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>CampusHub</h1>
          <p style={{ color: '#9ca3af' }}>Coordinator Portal</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#1f2937', 
          padding: '2rem', 
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <form onSubmit={handleLogin}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                Email:
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  backgroundColor: '#374151', 
                  border: '1px solid #6b7280', 
                  borderRadius: '6px', 
                  color: 'white',
                  fontSize: '14px'
                }} 
                required
                disabled={loading}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: '500' }}>
                Password:
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  backgroundColor: '#374151', 
                  border: '1px solid #6b7280', 
                  borderRadius: '6px', 
                  color: 'white',
                  fontSize: '14px'
                }} 
                required
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                backgroundColor: loading ? '#6b7280' : '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in as Coordinator'}
            </button>
          </form>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#93c5fd'
          }}>
            <strong>Demo Credentials:</strong><br />
            Email: coordinator@university.edu<br />
            Password: password123
          </div>
        </div>
      </div>
    </div>
  );
}

// Student dashboard with event browsing and registration
function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      window.location.href = '/student/login';
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Fetch data
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      // Fetch events
      const eventsResponse = await fetch(`${API_BASE_URL}/api/events?status=approved`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Fetch clubs
      const clubsResponse = await fetch(`${API_BASE_URL}/api/clubs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Fetch user registrations
      const registrationsResponse = await fetch(`${API_BASE_URL}/api/users/me/registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const [eventsData, clubsData, registrationsData] = await Promise.all([
        eventsResponse.json(),
        clubsResponse.json(),
        registrationsResponse.json()
      ]);

      if (eventsData.success) setEvents(eventsData.data.events || []);
      if (clubsData.success) setClubs(clubsData.data.clubs || []);
      if (registrationsData.success) setRegistrations(registrationsData.data.registrations || []);

    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        alert('Successfully registered for event!');
        // Refresh data
        fetchData(token);
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      alert(err.message || 'Network error');
    }
  };

  const handleUnregister = async (eventId) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        alert('Successfully unregistered from event!');
        // Refresh data
        fetchData(token);
      } else {
        alert(data.message || 'Unregistration failed');
      }
    } catch (err) {
      alert(err.message || 'Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const isRegistered = (eventId) => {
    return registrations.some(reg => reg.event_id === eventId && reg.status === 'registered');
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#111827', 
        color: 'white', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#111827', 
        color: 'white', 
        padding: '2rem',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '4rem' }}>
          <h1>Error Loading Dashboard</h1>
          <p style={{ color: '#f87171', marginBottom: '2rem' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Retry
          </button>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#6b7280', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white', 
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1f2937', borderBottom: '1px solid #374151', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#60a5fa' }}>CampusHub</h1>
            <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem' }}>Welcome, {user?.name}</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#6b7280', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid #374151' }}>
          {[
            { id: 'events', label: 'Browse Events', icon: '📅' },
            { id: 'clubs', label: 'Explore Clubs', icon: '👥' },
            { id: 'registrations', label: 'My Registrations', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 1.5rem',
                backgroundColor: 'transparent',
                color: activeTab === tab.id ? '#60a5fa' : '#9ca3af',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #60a5fa' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Upcoming Events</h2>
            {events.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {events.map(event => (
                  <div key={event.id} style={{ 
                    backgroundColor: '#1f2937', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    border: '1px solid #374151' 
                  }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#60a5fa' }}>{event.title}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      {event.description}
                    </p>
                    <div style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                      <div style={{ marginBottom: '0.25rem' }}>
                        📅 {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                      </div>
                      <div style={{ marginBottom: '0.25rem' }}>
                        📍 {event.venue}
                      </div>
                      <div style={{ marginBottom: '0.25rem' }}>
                        👥 {event.capacity} capacity
                      </div>
                      <div>
                        🏛️ {event.club?.name || 'Unknown Club'}
                      </div>
                    </div>
                    {isRegistered(event.id) ? (
                      <button
                        onClick={() => handleUnregister(event.id)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Unregister
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(event.id)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Register
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                <p>No events available at the moment.</p>
              </div>
            )}
          </div>
        )}

        {/* Clubs Tab */}
        {activeTab === 'clubs' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Campus Clubs</h2>
            {clubs.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {clubs.map(club => (
                  <div key={club.id} style={{ 
                    backgroundColor: '#1f2937', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    border: '1px solid #374151' 
                  }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#10b981' }}>{club.name}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      {club.description || 'No description available.'}
                    </p>
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                      Lead: {club.lead?.name || 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                <p>No clubs available at the moment.</p>
              </div>
            )}
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>My Event Registrations</h2>
            {registrations.filter(reg => reg.status === 'registered').length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {registrations
                  .filter(reg => reg.status === 'registered')
                  .map(registration => (
                    <div key={registration.id} style={{ 
                      backgroundColor: '#1f2937', 
                      padding: '1.5rem', 
                      borderRadius: '8px', 
                      border: '1px solid #374151',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#60a5fa' }}>
                          {registration.event?.title || 'Unknown Event'}
                        </h3>
                        <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                          📅 {registration.event?.date ? new Date(registration.event.date).toLocaleDateString() : 'Unknown Date'} • 
                          📍 {registration.event?.venue || 'Unknown Venue'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleUnregister(registration.event_id)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <p>You haven't registered for any events yet.</p>
                <button
                  onClick={() => setActiveTab('events')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '1rem'
                  }}
                >
                  Browse Events
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
function CoordinatorDashboard() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      window.location.href = '/login';
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Fetch dashboard data
    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/coordinator/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }

      if (data.success) {
        setDashboardData(data.data);
      } else {
        setError(data.message || 'Failed to load dashboard');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleCreateEvent = async (eventData) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/coordinator/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
      }

      if (data.success) {
        alert('Event created successfully and is pending approval!');
        setShowCreateEvent(false);
        // Refresh dashboard data
        fetchDashboardData(token);
      } else {
        alert(data.message || 'Failed to create event');
      }
    } catch (err) {
      alert(err.message || 'Network error');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#111827', 
        color: 'white', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#111827', 
        color: 'white', 
        padding: '2rem',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '4rem' }}>
          <h1>Error Loading Dashboard</h1>
          <p style={{ color: '#f87171', marginBottom: '2rem' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Retry
          </button>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#6b7280', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Coordinator Dashboard</h1>
            <p style={{ color: '#9ca3af' }}>Welcome, {user?.name || 'Coordinator'}</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#6b7280', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#60a5fa' }}>My Clubs</h3>
            <p style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
              {dashboardData?.stats?.total_clubs || 0}
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
              {dashboardData?.clubs?.length > 0 ? dashboardData.clubs[0].name : 'No clubs assigned'}
            </p>
          </div>

          <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#10b981' }}>Total Events</h3>
            <p style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
              {dashboardData?.stats?.total_events || 0}
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
              {dashboardData?.stats?.approved_events || 0} approved, {dashboardData?.stats?.pending_events || 0} pending
            </p>
          </div>

          <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b' }}>Registrations</h3>
            <p style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
              {dashboardData?.stats?.total_registrations || 0}
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
              Total across all events
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #374151' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowCreateEvent(true)}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Create Event
            </button>
            <button 
              onClick={() => alert('View all events (Coming soon)')}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: '#10b981', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              View All Events
            </button>
            <button 
              onClick={() => alert('Manage registrations (Coming soon)')}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: '#8b5cf6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Manage Registrations
            </button>
          </div>
        </div>

        {/* Recent Events */}
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Recent Events</h3>
          {dashboardData?.events?.length > 0 ? (
            <div>
              {dashboardData.events.slice(0, 5).map((event, index) => (
                <div key={index} style={{ 
                  padding: '1rem', 
                  backgroundColor: '#374151', 
                  borderRadius: '6px', 
                  marginBottom: '0.5rem',
                  border: '1px solid #4b5563'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{event.title}</h4>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                    Status: <span style={{ 
                      color: event.status === 'approved' ? '#10b981' : 
                            event.status === 'pending' ? '#f59e0b' : '#f87171'
                    }}>
                      {event.status}
                    </span> • 
                    Date: {new Date(event.date).toLocaleDateString()} • 
                    Capacity: {event.capacity} • 
                    Registered: {event.registration_count || 0}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#9ca3af' }}>No events created yet. Create your first event!</p>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <CreateEventModal 
          onClose={() => setShowCreateEvent(false)}
          onSubmit={handleCreateEvent}
          clubs={dashboardData?.clubs || []}
        />
      )}
    </div>
  );
}

// Create Event Modal Component
function CreateEventModal({ onClose, onSubmit, clubs }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    capacity: '',
    club_id: clubs[0]?.id || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      alert('Error creating event: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1f2937',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #374151',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: 'white' }}>Create New Event</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '14px' }}>
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#374151',
                border: '1px solid #6b7280',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px'
              }}
              placeholder="Enter event title"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '14px' }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#374151',
                border: '1px solid #6b7280',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px',
                resize: 'vertical'
              }}
              placeholder="Describe your event"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '14px' }}>
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  border: '1px solid #6b7280',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '14px' }}>
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  border: '1px solid #6b7280',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="Max attendees"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '14px' }}>
              Venue *
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#374151',
                border: '1px solid #6b7280',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px'
              }}
              placeholder="Event location"
            />
          </div>

          {clubs.length > 1 && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white', fontSize: '14px' }}>
                Club *
              </label>
              <select
                name="club_id"
                value={formData.club_id}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  border: '1px solid #6b7280',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#6b7280' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const path = window.location.pathname;
  const user = localStorage.getItem('user');

  // Simple routing
  if (path === '/login' || path === '/coordinator') {
    return <SimpleLoginPage />;
  }
  
  if (path === '/dashboard') {
    if (!user) {
      window.location.href = '/login';
      return null;
    }
    return <CoordinatorDashboard />;
  }

  // Default home page
  return <TestPage />;
}

export default App;
