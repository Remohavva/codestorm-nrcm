'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { events, clubs, myRegistrations, userProfile } from '@/lib/mockData';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Use mock data instead of API calls
      const mockStats = {
        registeredEvents: myRegistrations.length,
        attendedEvents: userProfile.totalEvents,
        clubMemberships: userProfile.clubs.length,
        totalEvents: events.length,
        totalClubs: clubs.length,
        totalUsers: 150, // Mock data
        totalRegistrations: events.reduce((sum, event) => sum + event.registered, 0),
        activeClubs: clubs.length
      };

      // Get recent events (upcoming events)
      const upcomingEvents = events
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

      setStats(mockStats);
      setRecentEvents(upcomingEvents);
    } catch (error) {
      console.error('Dashboard load error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleSpecificStats = () => {
    if (!stats) return [];

    switch (user?.role) {
      case 'student':
        return [
          {
            title: 'Registered Events',
            value: stats.registeredEvents || 0,
            change: '+2 this week',
            changeType: 'positive',
            icon: (
              <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ),
          },
          {
            title: 'Attended Events',
            value: stats.attendedEvents || 0,
            change: '+1 this month',
            changeType: 'positive',
            icon: (
              <svg className="w-6 h-6 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            title: 'Club Memberships',
            value: stats.clubMemberships || 0,
            icon: (
              <svg className="w-6 h-6 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ),
          },
        ];

      case 'coordinator':
        return [
          {
            title: 'My Events',
            value: stats.totalEvents || 0,
            change: '+3 this month',
            changeType: 'positive',
            icon: (
              <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ),
          },
          {
            title: 'Total Registrations',
            value: stats.totalRegistrations || 0,
            change: '+12 this week',
            changeType: 'positive',
            icon: (
              <svg className="w-6 h-6 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            ),
          },
          {
            title: 'Active Clubs',
            value: stats.activeClubs || 0,
            icon: (
              <svg className="w-6 h-6 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ),
          },
        ];

      case 'admin':
        return [
          {
            title: 'Total Events',
            value: stats.totalEvents || 0,
            change: '+5 this month',
            changeType: 'positive',
            icon: (
              <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ),
          },
          {
            title: 'Total Users',
            value: stats.totalUsers || 0,
            change: '+8 this week',
            changeType: 'positive',
            icon: (
              <svg className="w-6 h-6 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            ),
          },
          {
            title: 'Active Clubs',
            value: stats.totalClubs || 0,
            icon: (
              <svg className="w-6 h-6 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ),
          },
        ];

      default:
        return [];
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
              {getGreeting()}, {typeof user?.name === 'string' ? user.name : 'User'}!
            </h1>
            <p className="text-chrome-300 text-lg">
              Welcome to your {user?.role} dashboard
            </p>
          </motion.div>

          {loading ? (
            /* Loading State */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-chrome animate-pulse">
                  <div className="h-20 bg-chrome-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Stats Cards */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {getRoleSpecificStats().map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Events */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card variant="luxury">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Events
                    <Button variant="ghost" size="sm" onClick={() => router.push('/events')}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-chrome-800 rounded mb-2"></div>
                          <div className="h-3 bg-chrome-800 rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentEvents.length > 0 ? (
                    <div className="space-y-4">
                      {recentEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-glass-medium hover:bg-glass-light transition-colors cursor-pointer"
                          onClick={() => router.push(`/events/${event.id}`)}
                        >
                          <div>
                            <h4 className="font-medium text-white">{event.title}</h4>
                            <p className="text-sm text-chrome-300">
                              {formatDate(event.date)} • {event.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === 'open' 
                                ? 'bg-accent-primary/20 text-accent-primary'
                                : event.status === 'ongoing'
                                ? 'bg-accent-success/20 text-accent-success'
                                : 'bg-chrome-600/20 text-chrome-300'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-chrome-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-chrome-300">No recent events</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card variant="luxury">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user?.role === 'coordinator' && (
                      <>
                        <Button 
                          variant="chrome" 
                          className="w-full justify-start"
                          onClick={() => window.location.href = '/coordinator/events/create'}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Create New Event
                        </Button>
                        <Button 
                          variant="chrome" 
                          className="w-full justify-start"
                          onClick={() => window.location.href = '/coordinator/clubs'}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Manage Clubs
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      variant="chrome" 
                      className="w-full justify-start"
                      onClick={() => router.push('/feed')}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      View Feed
                    </Button>
                    
                    <Button 
                      variant="chrome" 
                      className="w-full justify-start"
                      onClick={() => router.push('/events')}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Browse Events
                    </Button>
                    
                    <Button 
                      variant="chrome" 
                      className="w-full justify-start"
                      onClick={() => router.push('/clubs')}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Explore Clubs
                    </Button>
                    
                    <Button 
                      variant="chrome" 
                      className="w-full justify-start"
                      onClick={() => router.push('/registrations')}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      My Registrations
                    </Button>
                    
                    <Button 
                      variant="chrome" 
                      className="w-full justify-start"
                      onClick={() => router.push('/profile')}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}