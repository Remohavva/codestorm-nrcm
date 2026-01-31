import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiMail, HiLockClosed, HiArrowRight, HiUserGroup } from 'react-icons/hi';
import GlassCard from '../components/GlassCard';
import './Login.css';

function CoordinatorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication - navigate to coordinator dashboard
    navigate('/coordinator/dashboard');
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
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-submit-btn">
              <span>Sign in</span>
              <HiArrowRight size={20} />
            </button>

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
