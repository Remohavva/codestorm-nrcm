'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, PasswordInput } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const handleDemoLogin = async (role) => {
    const demoCredentials = {
      student: { email: 'student@university.edu', password: 'password123' },
      coordinator: { email: 'coordinator@university.edu', password: 'password123' },
      admin: { email: 'admin@university.edu', password: 'password123' },
    };

    const credentials = demoCredentials[role];
    if (!credentials) return;

    setFormData(credentials);
    
    try {
      await login(credentials.email, credentials.password);
      toast.success(`Logged in as ${role}!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              className="font-plus-jakarta text-3xl font-bold text-gradient mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Welcome Back
            </motion.h1>
            <motion.p 
              className="text-chrome-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Sign in to your account to continue
            </motion.p>
          </div>

          {/* Login Form */}
          <Card variant="luxury" className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={formErrors.email}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />

                <PasswordInput
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={formErrors.password}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-accent-error/10 border border-accent-error/20"
                  >
                    <p className="text-sm text-accent-error">{error}</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full"
                  loading={isLoading}
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Login Options */}
          <Card variant="glass" className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <p className="text-sm text-chrome-300">Quick Demo Access</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDemoLogin('student')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Student
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDemoLogin('coordinator')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Coordinator
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Admin
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="text-center space-y-4">
            <p className="text-sm text-chrome-300">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="text-accent-primary hover:text-accent-secondary transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
            
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-chrome-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}