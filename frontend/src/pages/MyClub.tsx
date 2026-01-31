import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { clubsAPI, eventsAPI } from '../services/api';
import { 
  Users, 
  Calendar, 
  Settings, 
  Plus, 
  Edit,
  BarChart3,
  Clock,
  MapPin,
  ArrowRight
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const MyClub: React.FC = () => {
  const { user } = useAuth();
  const [club, setClub] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubData();
  }, []);

  const fetchClubData = async () => {
    try {
      setLoading(true);
      
      // Fetch all clubs and find the one led by current user
      const clubsResponse = await clubsAPI.getAll();
      const userClub = clubsResponse.data.data.clubs.find((c: any) => 
        c.lead_id === user?.id
      );
      
      if (userClub) {
        setClub(userClub);
        
        // Fetch events for this club
        const eventsResponse = await eventsAPI.getAll({ club_id: userClub.id });
        setEvents(eventsResponse.data.data.events);
      }
    } catch (error) {
      console.error('Error fetching club data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'bg-gray-900 text-gray-200 border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center py-16">
        <Users className="mx-auto h-16 w-16 text-gray-600 mb-6" />
        <h3 className="text-xl font-medium text-white mb-2">No club found</h3>
        <p className="text-gray-400 mb-8">
          You don't lead any clubs yet. Create one to get started.
        </p>
        <Link
          to="/clubs/create"
          className="btn-primary inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Club
        </Link>
      </div>
    );
  }

  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
  const pastEvents = events.filter(event => new Date(event.date) <= new Date());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center">
            <Users className="h-8 w-8 mr-3 text-primary-400" />
            My Club
          </h1>
          <p className="mt-2 text-xl text-gray-400">
            Manage your club and events
          </p>
        </div>
        
        <Link
          to="/events/create"
          className="btn-primary flex items-center group"
        >
          <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
          Create Event
        </Link>
      </div>

      {/* Club Info Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-white mb-2">{club.name}</h2>
            {club.description && (
              <p className="text-gray-400 leading-relaxed">{club.description}</p>
            )}
          </div>
          <button className="btn-ghost flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Edit Club
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center p-4 bg-dark-700/50 rounded-lg">
            <Calendar className="h-8 w-8 text-primary-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Total Events</p>
              <p className="text-2xl font-bold text-white">{events.length}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-dark-700/50 rounded-lg">
            <Clock className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Upcoming Events</p>
              <p className="text-2xl font-bold text-white">{upcomingEvents.length}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-dark-700/50 rounded-lg">
            <BarChart3 className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Total Registrations</p>
              <p className="text-2xl font-bold text-white">
                {events.reduce((sum, event) => sum + (event.registration_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-primary-400" />
            Upcoming Events
          </h3>
          <Link
            to="/events/create"
            className="btn-ghost flex items-center text-sm"
          >
            Create New
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8">
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
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white group-hover:text-primary-300 transition-colors">
                        {event.title}
                      </h4>
                      <span className={`status-badge ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400 space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.venue}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {event.registration_count || 0}/{event.capacity}
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to={`/events/${event.id}`}
                    className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center group ml-4"
                  >
                    View
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-primary-400" />
            Past Events
          </h3>
          
          <div className="space-y-4">
            {pastEvents.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="p-4 bg-dark-700/30 rounded-lg border border-dark-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-300 mb-2">{event.title}</h4>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {event.registration_count || 0} attended
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to={`/events/${event.id}`}
                    className="text-gray-500 hover:text-gray-400 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClub;