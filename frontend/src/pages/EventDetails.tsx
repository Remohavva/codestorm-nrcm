import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, registrationsAPI } from '../services/api';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getById(id!);
      setEvent(response.data.data.event);
      
      // Check if user is registered
      if (user?.role === 'student') {
        const registrations = response.data.data.event.registrations || [];
        setIsRegistered(registrations.some((reg: any) => 
          reg.user.id === user.id && reg.status === 'registered'
        ));
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await registrationsAPI.register(id!);
      setIsRegistered(true);
      fetchEvent(); // Refresh to update registration count
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      setRegistering(true);
      await registrationsAPI.cancel(id!);
      setIsRegistered(false);
      fetchEvent(); // Refresh to update registration count
    } catch (error: any) {
      alert(error.response?.data?.message || 'Cancellation failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="mx-auto h-16 w-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">Event not found</h3>
        <p className="text-gray-400 mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/events')}
          className="btn-primary"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const isEventFull = (event.registration_count || 0) >= event.capacity;
  const isEventPast = new Date(event.date) < new Date();
  const canRegister = user?.role === 'student' && 
                     event.status === 'approved' && 
                     !isEventPast && 
                     !isEventFull && 
                     !isRegistered;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/events')}
        className="btn-ghost flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </button>

      {/* Event Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-4">{event.title}</h1>
            <span className={`status-badge ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>
          
          {canRegister && (
            <button
              onClick={handleRegister}
              disabled={registering}
              className="btn-primary flex items-center"
            >
              {registering ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Register
                </>
              )}
            </button>
          )}

          {isRegistered && (
            <button
              onClick={handleCancelRegistration}
              disabled={registering}
              className="btn-danger flex items-center"
            >
              {registering ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Registration
                </>
              )}
            </button>
          )}
        </div>

        {/* Event Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="flex items-center p-4 bg-dark-700/50 rounded-lg">
            <Calendar className="h-8 w-8 text-primary-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Date & Time</p>
              <p className="font-medium text-white">{formatDate(event.date)}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-dark-700/50 rounded-lg">
            <MapPin className="h-8 w-8 text-primary-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Venue</p>
              <p className="font-medium text-white">{event.venue}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-dark-700/50 rounded-lg">
            <Users className="h-8 w-8 text-primary-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Capacity</p>
              <p className="font-medium text-white">
                {event.registration_count || 0} / {event.capacity}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-dark-700/50 rounded-lg">
            <Clock className="h-8 w-8 text-primary-400 mr-3" />
            <div>
              <p className="text-sm text-gray-400">Available Spots</p>
              <p className="font-medium text-white">
                {Math.max(0, event.capacity - (event.registration_count || 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Event Description */}
        {event.description && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">About this event</h3>
            <p className="text-gray-300 leading-relaxed">{event.description}</p>
          </div>
        )}

        {/* Club Info */}
        {event.club && (
          <div className="border-t border-dark-700 pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Organized by</h3>
            <div className="flex items-center p-4 bg-dark-700/50 rounded-lg">
              <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-white">{event.club.name}</h4>
                <p className="text-sm text-gray-400">College Club</p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Status Messages */}
        {isRegistered && (
          <div className="mt-6 p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
            <span className="text-green-200">You are registered for this event</span>
          </div>
        )}

        {isEventFull && !isRegistered && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center">
            <XCircle className="h-5 w-5 text-red-400 mr-3" />
            <span className="text-red-200">This event is full</span>
          </div>
        )}

        {isEventPast && (
          <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-gray-300">This event has already occurred</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;