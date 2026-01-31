'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { AdminRoute } from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/auth';

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      const [statsResponse, usersResponse, eventsResponse, clubsResponse] = await Promise.all([
        apiClient.get('/api/admin/stats'),
        apiClient.get('/api/admin/users'),
        apiClient.get('/api/admin/events'),
        apiClient.get('/api/admin/clubs'),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (usersResponse.success) {
        setUsers(usersResponse.data.users || []);
      }

      if (eventsResponse.success) {
        setEvents(eventsResponse.data.events || []);
      }

      if (clubsResponse.success) {
        setClubs(clubsResponse.data.clubs || []);
      }
    } catch (error) {
      console.error('Admin data load error:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEvent = async (eventId) => {
    try {
      const response = await apiClient.put(`/api/admin/events/${eventId}/approve`);
      
      if (response.success) {
        toast.success('Event approved successfully');
        loadAdminData(); // Reload data
      }
    } catch (error) {
      toast.error(error.message || 'Failed to approve event');
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      const response = await apiClient.put(`/api/admin/events/${eventId}/reject`);
      
      if (response.success) {
        toast.success('Event rejected');
        loadAdminData(); // Reload data
      }
    } catch (error) {
      toast.error(error.message || 'Failed to reject event');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      const response = await apiClient.put(`/api/admin/users/${userId}/status`, {
        status: newStatus
      });
      
      if (response.success) {
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
        loadAdminData(); // Reload data
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update user status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-accent-warning/20 text-accent-warning border-accent-warning/30';
      case 'approved':
      case 'active':
        return 'bg-accent-success/20 text-accent-success border-accent-success/30';
      case 'rejected':
      case 'suspended':
        return 'bg-accent-error/20 text-accent-error border-accent-error/30';
      default:
        return 'bg-chrome-600/20 text-chrome-300 border-chrome-600/30';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'chart' },
    { id: 'users', label: 'Users', icon: 'users' },
    { id: 'events', label: 'Events', icon: 'calendar' },
    { id: 'clubs', label: 'Clubs', icon: 'building' },
  ];

  const getTabIcon = (iconType) => {
    switch (iconType) {
      case 'chart':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'building':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <AdminRoute>
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
              Admin Dashboard
            </h1>
            <p className="text-chrome-300 text-lg">
              Manage users, events, and platform settings
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card variant="glass">
              <CardContent className="p-2">
                <nav className="flex space-x-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-accent-primary text-white'
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

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="card-chrome animate-pulse">
                        <div className="h-24 bg-chrome-800 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                      title="Total Users"
                      value={stats?.totalUsers || 0}
                      change="+12 this month"
                      changeType="positive"
                      icon={
                        <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      }
                    />
                    <StatCard
                      title="Total Events"
                      value={stats?.totalEvents || 0}
                      change="+5 this week"
                      changeType="positive"
                      icon={
                        <svg className="w-6 h-6 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      }
                    />
                    <StatCard
                      title="Active Clubs"
                      value={stats?.totalClubs || 0}
                      icon={
                        <svg className="w-6 h-6 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      }
                    />
                    <StatCard
                      title="Pending Approvals"
                      value={stats?.pendingEvents || 0}
                      icon={
                        <svg className="w-6 h-6 text-accent-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    />
                  </div>
                )}

                {/* Recent Activity */}
                <Card variant="luxury">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading ? (
                        [1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse flex items-center space-x-3">
                            <div className="w-8 h-8 bg-chrome-800 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-chrome-800 rounded mb-1"></div>
                              <div className="h-3 bg-chrome-800 rounded w-2/3"></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-chrome-300">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'users' && (
              <Card variant="luxury">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse flex items-center justify-between p-4 rounded-lg bg-chrome-800">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-chrome-700 rounded-full"></div>
                            <div>
                              <div className="h-4 bg-chrome-700 rounded mb-1 w-32"></div>
                              <div className="h-3 bg-chrome-700 rounded w-24"></div>
                            </div>
                          </div>
                          <div className="h-8 bg-chrome-700 rounded w-20"></div>
                        </div>
                      ))}
                    </div>
                  ) : users.length > 0 ? (
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-glass-medium hover:bg-glass-light transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{user.name}</h4>
                              <p className="text-sm text-chrome-300">
                                {user.email} • <span className="capitalize">{user.role}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status || 'active')}`}>
                              {user.status || 'active'}
                            </span>
                            <Button
                              variant={user.status === 'suspended' ? 'accent' : 'outline'}
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id, user.status || 'active')}
                              className={user.status !== 'suspended' ? 'border-accent-error text-accent-error hover:bg-accent-error hover:text-white' : ''}
                            >
                              {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-chrome-300">No users found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'events' && (
              <Card variant="luxury">
                <CardHeader>
                  <CardTitle>Event Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse p-4 rounded-lg bg-chrome-800">
                          <div className="h-4 bg-chrome-700 rounded mb-2"></div>
                          <div className="h-3 bg-chrome-700 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-chrome-700 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : events.length > 0 ? (
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="p-4 rounded-lg bg-glass-medium hover:bg-glass-light transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-white mb-1">{event.title}</h4>
                              <p className="text-sm text-chrome-300 mb-2">
                                {formatDate(event.date)} • {event.venue}
                              </p>
                              <p className="text-sm text-chrome-400 line-clamp-2">
                                {event.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3 ml-4">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                                {event.status}
                              </span>
                              {event.status === 'pending' && (
                                <div className="flex space-x-2">
                                  <Button
                                    variant="accent"
                                    size="sm"
                                    onClick={() => handleApproveEvent(event.id)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRejectEvent(event.id)}
                                    className="border-accent-error text-accent-error hover:bg-accent-error hover:text-white"
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-chrome-300">No events found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'clubs' && (
              <Card variant="luxury">
                <CardHeader>
                  <CardTitle>Club Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse p-4 rounded-lg bg-chrome-800">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-chrome-700 rounded-lg"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-chrome-700 rounded mb-1"></div>
                              <div className="h-3 bg-chrome-700 rounded w-2/3"></div>
                            </div>
                          </div>
                          <div className="h-3 bg-chrome-700 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : clubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clubs.map((club) => (
                        <div
                          key={club.id}
                          className="p-4 rounded-lg bg-glass-medium hover:bg-glass-light transition-colors"
                        >
                          <div className="flex items-start space-x-3 mb-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold">
                                {club.name?.charAt(0)?.toUpperCase() || 'C'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white mb-1">{club.name}</h4>
                              <p className="text-sm text-chrome-300">
                                {club.member_count || 0} members • {club.event_count || 0} events
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-chrome-400 line-clamp-2">
                            {club.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-chrome-300">No clubs found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </main>
      </div>
    </AdminRoute>
  );
}