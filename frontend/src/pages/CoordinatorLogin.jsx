import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiMail, HiLockClosed, HiArrowRight, HiUserGroup } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/GlassCard';
import './Login.css';

function CoordinatorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      
      // Check if user is a club lead or admin
      if (user.role === 'club_lead' || user.role === 'admin') {
        navigate('/coordinator/dashboard');
      } else {
        setError('Access denied. Only club coordinators can access this portal.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel - Branding */}
      <div className="login-left-panel">
        <div className="branding-content">
          <div className="logo-container">
            <div className="logo-circle">
              <HiUserGroup size={24} />
            </div>
            <h1 className="brand-name">CampusHub</h1>
          </div>
          <div className="branding-text">
            <h2>Coordinator Portal</h2>
            <p>Manage your club events and members</p>
          </div>
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <HiUserGroup size={16} />
              </div>
              <span>Create and manage events</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <HiUserGroup size={16} />
              </div>
              <span>Track registrations</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <HiUserGroup size={16} />
              </div>
              <span>Manage club members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-right-panel">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h1>Sign in</h1>
            <p>Club coordinator account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message" style={{
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

            {/* Email Input */}
            <div className="input-wrapper">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <HiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coordinator@university.edu"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="input-wrapper">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot?
                </Link>
              </div>
              <div className="input-container">
                <HiLockClosed className="input-icon" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-submit-btn" disabled={loading}>
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              {!loading && <HiArrowRight size={20} />}
            </button>

            {/* Demo Info */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#93c5fd'
            }}>
              Demo: Use coordinator@university.edu with password "password123"
            </div>

            {/* Note about no signup */}
            <div className="coordinator-note">
              <p>Coordinator accounts are managed by administrators. Contact support for access.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CoordinatorLogin;
