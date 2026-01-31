'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, PasswordInput, Select } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/auth';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    department: '',
    year: '',
    bio: '',
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        year: user.year?.toString() || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfile = () => {
    const errors = {};
    
    if (!profileData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profileData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) {
      return;
    }

    try {
      setLoading(true);
      
      const updateData = {
        name: profileData.name.trim(),
        email: profileData.email.toLowerCase(),
        bio: profileData.bio.trim(),
        ...(user?.role === 'student' && {
          department: profileData.department,
          year: profileData.year ? parseInt(profileData.year) : null,
        }),
      };

      const response = await apiClient.put('/api/users/me', updateData);
      
      if (response.success) {
        updateUser(response.data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiClient.put('/api/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (response.success) {
        toast.success('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'user' },
    { id: 'security', label: 'Security', icon: 'lock' },
  ];

  const getTabIcon = (iconType) => {
    switch (iconType) {
      case 'user':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'lock':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        
        <main className="container-chrome py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="font-plus-jakarta text-3xl md:text-4xl font-bold text-gradient mb-2">
              Profile Settings
            </h1>
            <p className="text-chrome-300 text-lg">
              Manage your account settings and preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card variant="glass">
                <CardContent className="p-0">
                  <div className="p-6 border-b border-chrome-600/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{user?.name}</h3>
                        <p className="text-sm text-chrome-300 capitalize">{user?.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  <nav className="p-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                            : 'text-chrome-300 hover:text-white hover:bg-glass-light'
                        }`}
                      >
                        {getTabIcon(tab.icon)}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              {activeTab === 'profile' && (
                <Card variant="luxury">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          name="name"
                          label="Full Name"
                          placeholder="Enter your full name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          error={profileErrors.name}
                        />

                        <Input
                          name="email"
                          type="email"
                          label="Email"
                          placeholder="Enter your email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          error={profileErrors.email}
                        />
                      </div>

                      {user?.role === 'student' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Select
                            name="department"
                            label="Department"
                            placeholder="Select your department"
                            value={profileData.department}
                            onChange={handleProfileChange}
                            options={departmentOptions}
                          />

                          <Select
                            name="year"
                            label="Year of Study"
                            placeholder="Select your year"
                            value={profileData.year}
                            onChange={handleProfileChange}
                            options={yearOptions}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-chrome-200 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          rows={4}
                          className="input-chrome w-full resize-none"
                          placeholder="Tell us about yourself..."
                          value={profileData.bio}
                          onChange={handleProfileChange}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          variant="accent"
                          loading={loading}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card variant="luxury">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <PasswordInput
                        name="currentPassword"
                        label="Current Password"
                        placeholder="Enter your current password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        error={passwordErrors.currentPassword}
                      />

                      <PasswordInput
                        name="newPassword"
                        label="New Password"
                        placeholder="Enter your new password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        error={passwordErrors.newPassword}
                        helperText="Must be at least 6 characters"
                      />

                      <PasswordInput
                        name="confirmPassword"
                        label="Confirm New Password"
                        placeholder="Confirm your new password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        error={passwordErrors.confirmPassword}
                      />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          variant="accent"
                          loading={loading}
                        >
                          Update Password
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}