import { useState, useEffect } from 'react';
import { 
  HiPlus, 
  HiCalendar, 
  HiUsers, 
  HiUserGroup,
  HiClipboardList,
  HiClock,
  HiCheckCircle,
  HiExclamationTriangle,
  HiPencil,
  HiTrash
} from 'react-icons/hi';
import { coordinatorAPI } from '../services/api';

function CoordinatorDashboardSimple() {
  const [dashboardData, setDashboardData] = useState(null);
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try to fetch coordinator data
      const [dashboardRes, eventsRes, clubsRes] = await Promise.all([
        coordinatorAPI.getDashboard().catch(() => ({ data: { data: { stats: { total_clubs: 0, total_events: 0, pending_events: 0, total_registrations: 0 } } } })),
        coordinatorAPI.getMyEvents().catch(() => ({ data: { data: { events: [] } } })),
        coordinatorAPI.getMyClubs().catch(() => ({ data: { data: { clubs: [] } } }))
      ]);
      
      setDashboardData(dashboardRes.data.data);
      setEvents(eventsRes.data.data.events);
      setClubs(clubsRes.data.data.clubs);
    } catch (err) {
      console.error('Dashboard error:', err);
      // Set default data if API fails
      setDashboardData({
        stats: {
          total_clubs: 0,
          total_events: 0,
          pending_events: 0,
          total_registrations: 0
        }
      });
      setEvents([]);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await coordinatorAPI.deleteEvent(eventId);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to delete event: ' + (err.response?.data?.message || err.message));
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
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <HiCheckCircle />;
      case 'pending': return <HiClock />;
      case 'rejected': return <HiExclamationTriangle />;
      default: return <HiClock />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading coordinator dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Coordinator Dashboard</h1>
            <p className="text-gray-400">Manage your clubs and events</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <HiPlus size={20} />
            <span>Create Event</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: HiClipboardList },
              { id: 'events', label: 'My Events', icon: HiCalendar },
              { id: 'clubs', label: 'My Clubs', icon: HiUserGroup }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Clubs</p>
                    <p className="text-2xl font-bold text-white">{dashboardData.stats.total_clubs}</p>
                  </div>
                  <HiUserGroup className="text-purple-400" size={32} />
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Events</p>
                    <p className="text-2xl font-bold text-white">{dashboardData.stats.total_events}</p>
                  </div>
                  <HiCalendar className="text-blue-400" size={32} />
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending Events</p>
                    <p className="text-2xl font-bold text-white">{dashboardData.stats.pending_events}</p>
                  </div>
                  <HiClock className="text-yellow-400" size={32} />
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Registrations</p>
                    <p className="text-2xl font-bold text-white">{dashboardData.stats.total_registrations}</p>
                  </div>
                  <HiUsers className="text-green-400" size={32} />
                </div>
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.slice(0, 5).map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{event.title}</h4>
                        <p className="text-gray-400 text-sm">
                          {event.club?.name} • {formatDate(event.date)}
                        </p>
                      </div>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                        {getStatusIcon(event.status)}
                        <span className="capitalize">{event.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No events yet. Create your first event!</p>
              )}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">My Events</h2>
              <div className="text-gray-400 text-sm">
                {events.length} events total
              </div>
            </div>

            {events.length > 0 ? (
              <div className="grid gap-6">
                {events.map(event => (
                  <div key={event.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                            {getStatusIcon(event.status)}
                            <span className="capitalize">{event.status}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center space-x-2">
                            <HiUserGroup size={16} />
                            <span>{event.club?.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <HiCalendar size={16} />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <HiUsers size={16} />
                            <span>{event.registration_count || 0}/{event.capacity}</span>
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-gray-300 text-sm">{event.description}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button 
                          onClick={() => setEditingEvent(event)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                          title="Edit Event"
                        >
                          <HiPencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-md transition-colors"
                          title="Delete Event"
                        >
                          <HiTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
                <HiCalendar className="mx-auto text-gray-500 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-white mb-2">No Events Yet</h3>
                <p className="text-gray-400 mb-4">Create your first event to get started</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Event
                </button>
              </div>
            )}
          </div>
        )}

        {/* Clubs Tab */}
        {activeTab === 'clubs' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">My Clubs</h2>
            
            {clubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.map(club => (
                  <div key={club.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-2">{club.name}</h3>
                    {club.description && (
                      <p className="text-gray-400 text-sm mb-4">{club.description}</p>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Events:</span>
                        <span className="text-white">{club.event_count || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pending:</span>
                        <span className="text-yellow-400">{club.pending_events || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Approved:</span>
                        <span className="text-green-400">{club.approved_events || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
                <HiUserGroup className="mx-auto text-gray-500 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-white mb-2">No Clubs Assigned</h3>
                <p className="text-gray-400">Contact an administrator to be assigned as a club leader</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Event Modal */}
      {(showCreateModal || editingEvent) && (
        <EventModal
          event={editingEvent}
          clubs={clubs}
          onClose={() => {
            setShowCreateModal(false);
            setEditingEvent(null);
          }}
          onSave={() => {
            setShowCreateModal(false);
            setEditingEvent(null);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}

// Event Modal Component
function EventModal({ event, clubs, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
    venue: event?.venue || '',
    capacity: event?.capacity || '',
    club_id: event?.club_id || (clubs[0]?.id || '')
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (event) {
        await coordinatorAPI.updateEvent(event.id, formData);
      } else {
        await coordinatorAPI.createEvent(formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">
          {event ? 'Edit Event' : 'Create Event'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-600/30 rounded text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {clubs.length > 0 && (
            <div>
              <label className="block text-gray-400 text-sm mb-1">Club</label>
              <select
                value={formData.club_id}
                onChange={(e) => setFormData({...formData, club_id: e.target.value})}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              >
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-sm mb-1">Date & Time</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Venue</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({...formData, venue: e.target.value})}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              rows="3"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : (event ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CoordinatorDashboardSimple;