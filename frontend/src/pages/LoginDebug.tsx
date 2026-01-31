import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginDebug: React.FC = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const testDirectAPI = async () => {
    setDebugInfo('Testing direct API call...');
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      setDebugInfo(`Direct API Response: ${JSON.stringify(data, null, 2)}`);
    } catch (err: any) {
      setDebugInfo(`Direct API Error: ${err.message}`);
    }
  };

  const testAxiosAPI = async () => {
    setDebugInfo('Testing Axios API call...');
    try {
      const axios = require('axios');
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      });
      
      setDebugInfo(`Axios Response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (err: any) {
      setDebugInfo(`Axios Error: ${err.response?.data || err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugInfo('Attempting login through AuthContext...');

    try {
      await login(email, password);
      setDebugInfo('Login successful! Redirecting...');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
      setDebugInfo(`AuthContext Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Debug Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Testing frontend-backend connection
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field mt-1"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field mt-1"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Login via AuthContext'
              )}
            </button>
            
            <button
              type="button"
              onClick={testDirectAPI}
              className="w-full py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              Test Direct API
            </button>
            
            <button
              type="button"
              onClick={testAxiosAPI}
              className="w-full py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              Test Axios API
            </button>
          </div>

          {debugInfo && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Back to normal login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginDebug;