import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiMail, HiLockClosed, HiArrowRight, HiAcademicCap } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/GlassCard';
import './Login.css';

function StudentLogin() {
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
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'club_lead') {
        navigate('/coordinator/dashboard');
      } else {
        navigate('/student/dashboard');
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
              <HiAcademicCap size={24} />
            </div>
            <h1 className="brand-name">CampusHub</h1>
          </div>
          <div className="branding-text">
            <h2>Student Portal</h2>
            <p>Access events, clubs, and your academic community</p>
          </div>
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <HiAcademicCap size={16} />
              </div>
              <span>Discover campus events</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <HiAcademicCap size={16} />
              </div>
              <span>Join student clubs</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <HiAcademicCap size={16} />
              </div>
              <span>Track your participation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-right-panel">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h1>Sign in</h1>
            <p>Student account</p>
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
                  placeholder="name@university.edu"
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

            {/* Divider */}
            <div className="divider">
              <span>or</span>
            </div>

            {/* Signup Link */}
            <div className="signup-prompt">
              <span>Don't have an account?</span>
              <Link to="/signup" className="signup-link">
                Sign up
              </Link>
            </div>

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
              Demo: Use any email with password "password123"
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
