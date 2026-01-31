import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, registrationsAPI, adminAPI } from '../services/api';
import { Calendar, Users, CheckSquare, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch upcoming events
        const eventsResponse = await eventsAPI.getAll({ 
          status: 'approved', 
          upcoming: true 
        });
        setUpcomingEvents(eventsResponse.data.data.events.slice(0, 5));

        // Fetch user-specific data based on role
        if (user?.role === 'student') {
          const registrationsResponse = await registrationsAPI.getUserRegistrations({ 
            upcoming: true 
          });
          setUserRegistrations(registrationsResponse.data.data.registrations.slice(0, 5));
        }

        // Fetch admin stats if admin
        if (user?.role === 'admin') {
          const statsResponse = await adminAPI.getAnalytics();
          setStats(statsResponse.data.data.stats);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening in your college events platform.
        </p>
      </div>

      {/* Admin Stats */}
      {user?.role === 'admin' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overview.total_users}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overview.total_events}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckSquare className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Registrations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overview.total_registrations}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Attendance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overview.total_attendance}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <Link
              to="/events"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming events</p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.venue}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(event.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {event.registration_count || 0}/{event.capacity}
                    </p>
                    <p className="text-xs text-gray-500">registered</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Registrations */}
        {user?.role === 'student' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Registrations</h2>
              <Link
                to="/registrations"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>

            {userRegistrations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming registrations</p>
            ) : (
              <div className="space-y-4">
                {userRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {registration.event.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {registration.event.venue}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(registration.event.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          registration.status === 'registered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {registration.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions for Club Leads */}
        {user?.role === 'club_lead' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/events/create"
                className="block w-full btn-primary text-center"
              >
                Create New Event
              </Link>
              <Link
                to="/my-club"
                className="block w-full btn-secondary text-center"
              >
                Manage My Club
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions for Admin */}
        {user?.role === 'admin' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Actions</h2>
            <div className="space-y-4">
              <Link
                to="/admin/events"
                className="block w-full btn-primary text-center"
              >
                Review Pending Events
              </Link>
              <Link
                to="/admin"
                className="block w-full btn-secondary text-center"
              >
                View Full Analytics
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;