import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'coordinator'
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication - just navigate based on role
    if (role === 'student') {
      navigate('/student/dashboard');
    } else {
      navigate('/coordinator/dashboard');
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel - Branding */}
      <div className="login-left-panel">
        <div className="branding-content">
          <div className="logo-container">
            <div className="logo-circle">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="currentColor"/>
                <path d="M10 16L14 20L22 12" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="brand-name">CampusHub</h1>
          </div>
          <div className="branding-text">
            <h2>Connect. Discover. Engage.</h2>
            <p>Your gateway to campus events and club communities</p>
          </div>
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Discover events tailored to your interests</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Join clubs and build your network</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Track your participation and achievements</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-right-panel">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h1>Welcome back</h1>
            <p>Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Role Selection - Tab Style */}
            <div className="role-tabs">
              <button
                type="button"
                className={`role-tab ${role === 'student' ? 'active' : ''}`}
                onClick={() => setRole('student')}
              >
                <span className="role-icon">🎓</span>
                <span>Student</span>
              </button>
              <button
                type="button"
                className={`role-tab ${role === 'coordinator' ? 'active' : ''}`}
                onClick={() => setRole('coordinator')}
              >
                <span className="role-icon">👥</span>
                <span>Coordinator</span>
              </button>
            </div>

            {/* Email Input */}
            <div className="input-wrapper">
              <label htmlFor="email">Email address</label>
              <div className="input-container">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 6.66667L10 11.6667L17.5 6.66667M3.33333 15H16.6667C17.5871 15 18.3333 14.2538 18.3333 13.3333V6.66667C18.3333 5.74619 17.5871 5 16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V13.3333C1.66667 14.2538 2.41286 15 3.33333 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  required
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
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.8333 9.16667H4.16667C3.24619 9.16667 2.5 9.91286 2.5 10.8333V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V10.8333C17.5 9.91286 16.7538 9.16667 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.83333 9.16667V5.83333C5.83333 4.72826 6.27232 3.66846 7.05372 2.88706C7.83512 2.10565 8.89493 1.66667 10 1.66667C11.1051 1.66667 12.1649 2.10565 12.9463 2.88706C13.7277 3.66846 14.1667 4.72826 14.1667 5.83333V9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-submit-btn">
              <span>Sign in</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Divider */}
            <div className="divider">
              <span>or</span>
            </div>

            {/* Signup Link */}
            <div className="signup-prompt">
              <span>Don't have an account?</span>
              <Link to="/signup" className="signup-link">
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
