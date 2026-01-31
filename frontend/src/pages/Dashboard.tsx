import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, registrationsAPI, adminAPI } from '../services/api';
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  TrendingUp, 
  Plus,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles
} from 'lucide-react';
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

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="card-compact group hover:scale-105 transition-transform duration-200">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-xl ${color} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start mb-4">
          <Sparkles className="h-8 w-8 text-primary-400 mr-3" />
          <h1 className="text-4xl font-bold text-white">
            Welcome back, {user?.name}!
          </h1>
        </div>
        <p className="text-xl text-gray-400 max-w-2xl">
          Here's what's happening in your college events platform.
        </p>
      </div>

      {/* Admin Stats */}
      {user?.role === 'admin' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.overview.total_users}
            color="bg-gradient-to-br from-primary-500 to-primary-700"
          />
          <StatCard
            icon={Calendar}
            title="Total Events"
            value={stats.overview.total_events}
            color="bg-gradient-to-br from-green-500 to-green-700"
          />
          <StatCard
            icon={CheckSquare}
            title="Registrations"
            value={stats.overview.total_registrations}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
          />
          <StatCard
            icon={TrendingUp}
            title="Attendance"
            value={stats.overview.total_attendance}
            color="bg-gradient-to-br from-purple-500 to-purple-700"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-primary-400" />
              Upcoming Events
            </h2>
            <Link
              to="/events"
              className="btn-ghost flex items-center text-sm"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-dark-700/50 rounded-lg border border-dark-600 hover:border-primary-500/50 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-primary-300 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400 mt-2 space-x-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.venue}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(event.date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium text-white">
                        {event.registration_count || 0}/{event.capacity}
                      </div>
                      <div className="text-xs text-gray-400">registered</div>
                    </div>
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
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <CheckSquare className="h-6 w-6 mr-2 text-primary-400" />
                My Registrations
              </h2>
              <Link
                to="/registrations"
                className="btn-ghost flex items-center text-sm"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {userRegistrations.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-400">No upcoming registrations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="p-4 bg-dark-700/50 rounded-lg border border-dark-600 hover:border-primary-500/50 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-primary-300 transition-colors">
                          {registration.event.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-400 mt-2 space-x-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {registration.event.venue}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(registration.event.date)}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`status-badge ${
                            registration.status === 'registered'
                              ? 'status-approved'
                              : 'status-rejected'
                          }`}
                        >
                          {registration.status}
                        </span>
                      </div>
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
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Plus className="h-6 w-6 mr-2 text-primary-400" />
              Quick Actions
            </h2>
            <div className="space-y-4">
              <Link
                to="/events/create"
                className="block w-full btn-primary text-center group"
              >
                <Plus className="inline h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
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
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-primary-400" />
              Admin Actions
            </h2>
            <div className="space-y-4">
              <Link
                to="/admin/events"
                className="block w-full btn-primary text-center group"
              >
                <CheckSquare className="inline h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
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