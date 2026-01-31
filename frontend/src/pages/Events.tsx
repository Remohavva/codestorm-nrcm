import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, registrationsAPI, clubsAPI } from '../services/api';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Filter, 
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Events: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'approved',
    club_id: '',
    upcoming: true,
  });

  useEffect(() => {
    fetchEvents();
    fetchClubs();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll(filters);
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await clubsAPI.getAll();
      setClubs(response.data.data.clubs);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      setRegistering(eventId);
      await registrationsAPI.register(eventId);
      // Refresh events to update registration count
      fetchEvents();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(null);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-primary-400" />
            Events
          </h1>
          <p className="mt-2 text-xl text-gray-400">
            Discover and register for upcoming college events
          </p>
        </div>
        
        {(user?.role === 'club_lead' || user?.role === 'admin') && (
          <Link
            to="/events/create"
            className="btn-primary flex items-center group"
          >
            <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            Create Event
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-300">Filters:</span>
          </div>
          
          <select
            className="input-field min-w-[120px]"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="input-field min-w-[150px]"
            value={filters.club_id}
            onChange={(e) => setFilters({ ...filters, club_id: e.target.value })}
          >
            <option value="">All Clubs</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>

          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-dark-600 text-primary-600 focus:ring-primary-500 bg-dark-700"
              checked={filters.upcoming}
              onChange={(e) => setFilters({ ...filters, upcoming: e.target.checked })}
            />
            <span className="ml-2 text-sm text-gray-300">Upcoming only</span>
          </label>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="mx-auto h-16 w-16 text-gray-600 mb-6" />
          <h3 className="text-xl font-medium text-white mb-2">No events found</h3>
          <p className="text-gray-400 mb-8">
            Try adjusting your filters or check back later for new events.
          </p>
          {(user?.role === 'club_lead' || user?.role === 'admin') && (
            <Link
              to="/events/create"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Event
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="card group hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white group-hover:text-primary-300 transition-colors mb-2">
                    {event.title}
                  </h3>
                  <span className={`status-badge ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                {event.status === 'approved' && (
                  <Sparkles className="h-5 w-5 text-primary-400 animate-pulse-slow" />
                )}
              </div>

              {event.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-4 w-4 mr-2 text-primary-400" />
                  {formatDate(event.date)}
                </div>
                
                <div className="flex items-center text-sm text-gray-400">
                  <MapPin className="h-4 w-4 mr-2 text-primary-400" />
                  {event.venue}
                </div>
                
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="h-4 w-4 mr-2 text-primary-400" />
                  {event.registration_count || 0}/{event.capacity} registered
                </div>

                {event.club && (
                  <div className="text-sm text-gray-400">
                    by {event.club.name}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                <Link
                  to={`/events/${event.id}`}
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center group"
                >
                  View Details
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {user?.role === 'student' && event.status === 'approved' && (
                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={
                      registering === event.id ||
                      (event.registration_count || 0) >= event.capacity
                    }
                    className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {registering === event.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (event.registration_count || 0) >= event.capacity ? (
                      'Full'
                    ) : (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        Register
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;