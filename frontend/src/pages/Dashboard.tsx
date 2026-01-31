import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, registrationsAPI, adminAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
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
import { formatDate } from '../lib/utils';

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

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-xl ${color} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start mb-4">
          <Sparkles className="h-8 w-8 text-blue-400 mr-3" />
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
            color="bg-gradient-to-br from-blue-500 to-blue-700"
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
            color="bg-gradient-to-br from-purple-500 to-purple-700"
          />
          <StatCard
            icon={TrendingUp}
            title="Attendance"
            value={stats.overview.total_attendance}
            color="bg-gradient-to-br from-yellow-500 to-yellow-700"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-blue-400" />
                Upcoming Events
              </CardTitle>
              <Link to="/events">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
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
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-400 space-x-4">
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
          </CardContent>
        </Card>

        {/* Student Registrations */}
        {user?.role === 'student' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <CheckSquare className="h-6 w-6 mr-2 text-blue-400" />
                  My Registrations
                </CardTitle>
                <Link to="/registrations">
                  <Button variant="ghost" size="sm">
                    View all
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
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
                      className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">
                            {registration.event.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-400 space-x-4">
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
                        <Badge variant="success">
                          {registration.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions for Club Leads */}
        {user?.role === 'club_lead' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-6 w-6 mr-2 text-blue-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/events/create">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Event
                </Button>
              </Link>
              <Link to="/my-club">
                <Button variant="outline" className="w-full justify-start">
                  Manage My Club
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions for Admin */}
        {user?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-blue-400" />
                Admin Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/events">
                <Button className="w-full justify-start">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Review Pending Events
                </Button>
              </Link>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;