import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiMail, HiLockClosed, HiArrowRight, HiAcademicCap, HiUser } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role);
      
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
    <div className="signup-page">
      <div className="signup-left-panel">
        <div className="branding-content">
          <div className="logo-container">
            <div className="logo-circle">
              <HiAcademicCap size={24} />
            </div>
            <h1 className="brand-name">CampusHub</h1>
          </div>
          <div className="branding-text">
            <h2>Join CampusHub</h2>
            <p>Create your account to access campus events and clubs</p>
          </div>
        </div>
      </div>

      <div className="signup-right-panel">
        <div className="signup-form-wrapper">
          <div className="signup-header">
            <h1>Create account</h1>
            <p>Join the campus community</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
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

            {/* Name Input */}
            <div className="input-wrapper">
              <label htmlFor="name">Full Name</label>
              <div className="input-container">
                <HiUser className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="input-wrapper">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <HiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="input-wrapper">
              <label htmlFor="role">Role</label>
              <div className="input-container">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    width: '100%'
                  }}
                >
                  <option value="student">Student</option>
                  <option value="club_lead">Club Lead</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Password Input */}
            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <HiLockClosed className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="input-wrapper">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-container">
                <HiLockClosed className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="signup-submit-btn" disabled={loading}>
              <span>{loading ? 'Creating account...' : 'Create account'}</span>
              {!loading && <HiArrowRight size={20} />}
            </button>

            {/* Login Link */}
            <div className="signup-prompt">
              <span>Already have an account?</span>
              <Link to="/login/student" className="signup-link">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
