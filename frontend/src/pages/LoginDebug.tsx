import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Mail, Lock, Bug } from 'lucide-react';
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
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-600 rounded-2xl shadow-lg">
              <Bug className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Debug Login
          </h2>
          <p className="text-gray-400">
            Testing frontend-backend connection
          </p>
        </div>
        
        {/* Form */}
        <div className="card animate-slide-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input-field pl-10"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="input-field pl-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-dark-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
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
                className="btn-secondary w-full"
              >
                Test Direct API
              </button>
              
              <button
                type="button"
                onClick={testAxiosAPI}
                className="btn-secondary w-full"
              >
                Test Axios API
              </button>
            </div>

            {debugInfo && (
              <div className="bg-blue-900/50 border border-blue-700 text-blue-200 px-4 py-3 rounded-lg backdrop-blur-sm">
                <pre className="text-xs whitespace-pre-wrap font-mono">{debugInfo}</pre>
              </div>
            )}

            <div className="text-center pt-4 border-t border-dark-700">
              <Link
                to="/login"
                className="font-medium text-primary-400 hover:text-primary-300 transition-colors duration-200"
              >
                Back to normal login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginDebug;