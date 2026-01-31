import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  CheckSquare, 
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowRight,
  Shield
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics
      const statsResponse = await adminAPI.getAnalytics();
      setStats(statsResponse.data.data.stats);
      
      // Fetch pending events
      const pendingResponse = await adminAPI.getPendingEvents();
      setPendingEvents(pendingResponse.data.data.events);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, color, subtitle }: any) => (
    <div className="card-compact group hover:scale-105 transition-transform duration-200">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-xl ${color} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white flex items-center">
          <Shield className="h-8 w-8 mr-3 text-primary-400" />
          Admin Dashboard
        </h1>
        <p className="mt-2 text-xl text-gray-400">
          System overview and management tools
        </p>
      </div>

      {/* Overview Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.overview.total_users}
            color="bg-gradient-to-br from-primary-500 to-primary-700"
            subtitle="Registered accounts"
          />
          <StatCard
            icon={Calendar}
            title="Total Events"
            value={stats.overview.total_events}
            color="bg-gradient-to-br from-green-500 to-green-700"
            subtitle="All time events"
          />
          <StatCard
            icon={CheckSquare}
            title="Registrations"
            value={stats.overview.total_registrations}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
            subtitle="Event sign-ups"
          />
          <StatCard
            icon={TrendingUp}
            title="Attendance"
            value={stats.overview.total_attendance}
            color="bg-gradient-to-br from-purple-500 to-purple-700"
            subtitle="Check-ins recorded"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <AlertCircle className="h-6 w-6 mr-2 text-yellow-400" />
              Pending Events
            </h2>
            <Link
              to="/admin/events"
              className="btn-ghost flex items-center text-sm"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {pendingEvents.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400">No pending events</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg hover:border-yellow-600/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-400 space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {event.club?.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="btn-primary text-xs px-3 py-1">
                        Approve
                      </button>
                      <button className="btn-danger text-xs px-3 py-1">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-primary-400" />
            Quick Actions
          </h2>
          
          <div className="space-y-4">
            <Link
              to="/admin/events"
              className="block w-full p-4 bg-dark-700/50 rounded-lg border border-dark-600 hover:border-primary-500/50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-white group-hover:text-primary-300 transition-colors">
                      Manage Events
                    </h3>
                    <p className="text-sm text-gray-400">Review and approve events</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="block w-full p-4 bg-dark-700/50 rounded-lg border border-dark-600 hover:border-primary-500/50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-white group-hover:text-primary-300 transition-colors">
                      User Management
                    </h3>
                    <p className="text-sm text-gray-400">Manage user roles and permissions</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
              </div>
            </Link>

            <Link
              to="/admin/analytics"
              className="block w-full p-4 bg-dark-700/50 rounded-lg border border-dark-600 hover:border-primary-500/50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-primary-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-white group-hover:text-primary-300 transition-colors">
                      Analytics
                    </h3>
                    <p className="text-sm text-gray-400">View detailed system analytics</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recent_activity && (
        <div className="card">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-primary-400" />
            Recent Activity
          </h2>
          
          <div className="space-y-3">
            {stats.recent_activity.map((activity: any, index: number) => (
              <div
                key={index}
                className="flex items-center p-3 bg-dark-700/30 rounded-lg"
              >
                <div className="h-2 w-2 bg-primary-400 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{activity.description}</p>
                  <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;