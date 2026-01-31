'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, PasswordInput, Select } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    studentId: '',
    department: '',
    year: '',
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
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
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
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      errors.role = 'Please select a role';
    }
    
    // Student-specific validation
    if (formData.role === 'student') {
      if (!formData.studentId) {
        errors.studentId = 'Student ID is required';
      }
      if (!formData.department) {
        errors.department = 'Department is required';
      }
      if (!formData.year) {
        errors.year = 'Year is required';
      }
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
      const userData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'student' && {
          student_id: formData.studentId,
          department: formData.department,
          year: parseInt(formData.year),
        }),
      };

      await register(userData);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'coordinator', label: 'Club Coordinator' },
  ];

  const departmentOptions = [
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business' },
    { value: 'arts', label: 'Arts & Humanities' },
    { value: 'science', label: 'Natural Sciences' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'other', label: 'Other' },
  ];

  const yearOptions = [
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' },
    { value: '5', label: '5th Year' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
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
              Join the Platform
            </motion.h1>
            <motion.p 
              className="text-chrome-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Create your account to get started
            </motion.p>
          </div>

          {/* Registration Form */}
          <Card variant="luxury" className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Create Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="name"
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={formErrors.name}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />

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

                <Select
                  name="role"
                  label="Role"
                  placeholder="Select your role"
                  value={formData.role}
                  onChange={handleInputChange}
                  error={formErrors.role}
                  options={roleOptions}
                />

                {/* Student-specific fields */}
                {formData.role === 'student' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <Input
                      name="studentId"
                      type="text"
                      label="Student ID"
                      placeholder="Enter your student ID"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      error={formErrors.studentId}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      }
                    />

                    <Select
                      name="department"
                      label="Department"
                      placeholder="Select your department"
                      value={formData.department}
                      onChange={handleInputChange}
                      error={formErrors.department}
                      options={departmentOptions}
                    />

                    <Select
                      name="year"
                      label="Year of Study"
                      placeholder="Select your year"
                      value={formData.year}
                      onChange={handleInputChange}
                      error={formErrors.year}
                      options={yearOptions}
                    />
                  </motion.div>
                )}

                <PasswordInput
                  name="password"
                  label="Password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={formErrors.password}
                  helperText="Must be at least 6 characters"
                />

                <PasswordInput
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={formErrors.confirmPassword}
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
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="text-center space-y-4">
            <p className="text-sm text-chrome-300">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-accent-primary hover:text-accent-secondary transition-colors font-medium"
              >
                Sign in
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