import { useState, useEffect } from 'react';
import { 
  HiCalendar, 
  HiClock, 
  HiLocationMarker, 
  HiUsers,
  HiCheckCircle,
  HiXCircle,
  HiEye,
  HiFilter
} from 'react-icons/hi';
import { adminAPI } from '../../services/api';
import GlassCard from '../GlassCard';

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEvents();
    fetchPendingEvents();
  }, [filter, currentPage]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(filter !== 'all' && { status: filter })
      };
      const response = await adminAPI.getAllEvents(params);
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const response = await adminAPI.getPendingEvents();
      setPendingEvents(response.data.data.events);
    } catch (error) {
      console.error('Failed to fetch pending events:', error);
    }
  };

  const handleEventAction = async (eventId, action) => {
    try {
      await adminAPI.updateEventStatus(eventId, action);
      fetchEvents();
      fetchPendingEvents();
    } catch (error) {
      console.error(`Failed to ${action} event:`, error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <HiCheckCircle className="text-green-400" />;
      case 'pending': return <HiClock className="text-yellow-400" />;
      case 'rejected': return <HiXCircle className="text-red-400" />;
      default: return <HiClock className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Pending Events Alert */}
      {pendingEvents.length > 0 && (
        <GlassCard className="p-6 border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <HiClock className="text-yellow-400" />
              <span>Pending Approvals ({pendingEvents.length})</span>
            </h3>
          </div>
          <div className="space-y-3">
            {pendingEvents.slice(0, 3).map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{event.title}</h4>
                  <p className="text-gray-400 text-sm">
                    {event.club?.name} • {formatDate(event.date)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEventAction(event.id, 'approve')}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleEventAction(event.id, 'reject')}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <HiFilter className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-1"
            >
              <option value="all">All Events</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="text-gray-400 text-sm">
            Showing {events.length} events
          </div>
        </div>
      </GlassCard>

      {/* Events List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No events found</div>
        ) : (
          events.map(event => (
            <GlassCard key={event.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(event.status)}
                      <span className={`text-sm capitalize ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <HiUserGroup className="text-purple-400" size={16} />
                      <span>{event.club?.name || 'No Club'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HiCalendar className="text-blue-400" size={16} />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HiLocationMarker className="text-green-400" size={16} />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HiUsers className="text-yellow-400" size={16} />
                      <span>{event.registrations?.[0]?.count || 0}/{event.capacity}</span>
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-gray-300 text-sm mt-3 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors">
                    <HiEye size={18} />
                  </button>
                  {event.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleEventAction(event.id, 'approve')}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleEventAction(event.id, 'reject')}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-400">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default EventManagement;