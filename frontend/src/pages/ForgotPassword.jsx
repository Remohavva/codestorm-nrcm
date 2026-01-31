import { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock password reset
    alert('Password reset link sent to your email (mock)');
  };

  return (
    <div className="auth-container">
      <GlassCard className="auth-card">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your email to receive a password reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="primary auth-submit">
            Send Reset Link
          </button>

          {/* Back to Login Link */}
          <div className="auth-switch">
            <Link to="/login" className="auth-link">
              ← Back to Sign In
            </Link>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

export default ForgotPassword;
