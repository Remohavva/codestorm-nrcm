import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, eventsAPI } from '../services/api';
import { 
  Calendar, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'pending',
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllEvents(filters);
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId: string) => {
    try {
      setActionLoading(eventId);
      await eventsAPI.approve(eventId);
      fetchEvents(); // Refresh the list
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve event');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (eventId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    try {
      setActionLoading(eventId);
      await eventsAPI.reject(eventId, reason || undefined);
      fetchEvents(); // Refresh the list
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject event');
    } finally {
      setActionLoading(null);
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
      {/* Back Button */}
      <Link
        to="/admin"
        className="btn-ghost flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Admin Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white flex items-center">
          <Calendar className="h-8 w-8 mr-3 text-primary-400" />
          Event Management
        </h1>
        <p className="mt-2 text-xl text-gray-400">
          Review and manage all events in the system
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="text-sm text-gray-400">
            {events.length} events found
          </div>
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="mx-auto h-16 w-16 text-gray-600 mb-6" />
          <h3 className="text-xl font-medium text-white mb-2">No events found</h3>
          <p className="text-gray-400">
            No events match your current filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="card hover:scale-[1.01] transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {event.title}
                      </h3>
                      <span className={`status-badge ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    {event.status === 'pending' && (
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleApprove(event.id)}
                          disabled={actionLoading === event.id}
                          className="btn-primary text-sm flex items-center"
                        >
                          {actionLoading === event.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(event.id)}
                          disabled={actionLoading === event.id}
                          className="btn-danger text-sm flex items-center"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="h-4 w-4 mr-2 text-primary-400" />
                      {formatDate(event.date)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mr-2 text-primary-400" />
                      {event.venue}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="h-4 w-4 mr-2 text-primary-400" />
                      {event.registration_count || 0}/{event.capacity}
                    </div>

                    {event.club && (
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="h-4 w-4 mr-2 text-primary-400" />
                        {event.club.name}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                    <div className="text-xs text-gray-500">
                      Created {new Date(event.created_at).toLocaleDateString()}
                    </div>
                    
                    <Link
                      to={`/events/${event.id}`}
                      className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Events Alert */}
      {filters.status === 'pending' && events.length > 0 && (
        <div className="card bg-yellow-900/20 border-yellow-700/50">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-200">
                {events.length} events awaiting review
              </h3>
              <p className="text-xs text-yellow-300 mt-1">
                Please review and approve/reject pending events to keep the platform active.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;