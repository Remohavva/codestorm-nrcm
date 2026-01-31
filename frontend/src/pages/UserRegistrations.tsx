import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registrationsAPI } from '../services/api';
import { 
  CheckSquare, 
  Calendar, 
  MapPin, 
  Clock, 
  Filter,
  ArrowRight,
  XCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const UserRegistrations: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    upcoming: true,
  });

  useEffect(() => {
    fetchRegistrations();
  }, [filters]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await registrationsAPI.getUserRegistrations(filters);
      setRegistrations(response.data.data.registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
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
      case 'registered':
        return 'status-approved';
      case 'cancelled':
        return 'status-rejected';
      default:
        return 'bg-gray-900 text-gray-200 border-gray-700';
    }
  };

  const isEventPast = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white flex items-center">
          <CheckSquare className="h-8 w-8 mr-3 text-primary-400" />
          My Registrations
        </h1>
        <p className="mt-2 text-xl text-gray-400">
          Track your event registrations and attendance
        </p>
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
            <option value="registered">Registered</option>
            <option value="cancelled">Cancelled</option>
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

      {/* Registrations List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-16">
          <CheckSquare className="mx-auto h-16 w-16 text-gray-600 mb-6" />
          <h3 className="text-xl font-medium text-white mb-2">No registrations found</h3>
          <p className="text-gray-400 mb-8">
            You haven't registered for any events yet. Browse events to get started.
          </p>
          <Link
            to="/events"
            className="btn-primary inline-flex items-center"
          >
            Browse Events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((registration) => (
            <div key={registration.id} className="card hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {registration.event.title}
                      </h3>
                      <span className={`status-badge ${getStatusColor(registration.status)}`}>
                        {registration.status}
                      </span>
                    </div>
                    {isEventPast(registration.event.date) && (
                      <span className="text-xs text-gray-500 bg-dark-700 px-2 py-1 rounded">
                        Past Event
                      </span>
                    )}
                  </div>

                  {registration.event.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {registration.event.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 text-primary-400" />
                      {formatDate(registration.event.date)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mr-2 text-primary-400" />
                      {registration.event.venue}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="h-4 w-4 mr-2 text-primary-400" />
                      Registered {new Date(registration.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {registration.event.club && (
                    <div className="text-sm text-gray-400 mb-4">
                      Organized by {registration.event.club.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                <Link
                  to={`/events/${registration.event.id}`}
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center group"
                >
                  View Event
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {registration.status === 'registered' && !isEventPast(registration.event.date) && (
                  <button className="btn-ghost text-red-400 hover:text-red-300 text-sm flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
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

export default UserRegistrations;