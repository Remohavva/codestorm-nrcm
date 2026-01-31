import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, registrationsAPI, clubsAPI } from '../services/api';
import { Calendar, MapPin, Users, Plus, Filter } from 'lucide-react';
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
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="mt-2 text-gray-600">
            Discover and register for upcoming college events
          </p>
        </div>
        
        {(user?.role === 'club_lead' || user?.role === 'admin') && (
          <Link
            to="/events/create"
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          
          <select
            className="input-field"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="input-field"
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
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              checked={filters.upcoming}
              onChange={(e) => setFilters({ ...filters, upcoming: e.target.checked })}
            />
            <span className="ml-2 text-sm text-gray-700">Upcoming only</span>
          </label>
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>

              {event.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(event.date)}
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.venue}
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {event.registration_count || 0}/{event.capacity} registered
                </div>

                {event.club && (
                  <div className="text-sm text-gray-500">
                    by {event.club.name}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to={`/events/${event.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Details
                </Link>

                {user?.role === 'student' && event.status === 'approved' && (
                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={
                      registering === event.id ||
                      (event.registration_count || 0) >= event.capacity
                    }
                    className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registering === event.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (event.registration_count || 0) >= event.capacity ? (
                      'Full'
                    ) : (
                      'Register'
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