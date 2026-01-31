'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  HiCalendar, 
  HiUserGroup, 
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiChartBar,
  HiClock
} from 'react-icons/hi';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { events, coordinatorProfiles } from '@/lib/mockData';

export default function CoordinatorDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [coordinatorData, setCoordinatorData] = useState(null);
  const [clubEvents, setClubEvents] = useState([]);

  useEffect(() => {
    // Get coordinator data based on user email
    if (user?.email) {
      const coordinator = coordinatorProfiles[user.email];
      if (coordinator) {
        setCoordinatorData(coordinator);
        // Filter events for this coordinator's club
        const filteredEvents = events.filter(event => event.clubId === coordinator.clubId);
        setClubEvents(filteredEvents);
      }
    }
  }, [user]);

  if (!coordinatorData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
              <p className="text-gray-400 mb-6">You don't have coordinator access.</p>
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handleCreateEvent = () => {
    router.push('/coordinator/events/create');
  };

  const handleEditEvent = (eventId) => {
    router.push(`/coordinator/events/${eventId}/edit`);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setClubEvents(prev => prev.filter(event => event.id !== eventId));
      alert('Event deleted successfully!');
    }
  };

  const getEventStats = () => {
    const totalEvents = clubEvents.length;
    const upcomingEvents = clubEvents.filter(event => event.status === 'open' || event.status === 'ongoing').length;
    const totalRegistrations = clubEvents.reduce((sum, event) => sum + (event.registered || 0), 0);
    const completedEvents = clubEvents.filter(event => event.status === 'completed').length;

    return { totalEvents, upcomingEvents, totalRegistrations, completedEvents };
  };

  const stats = getEventStats();

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ongoing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                {coordinatorData.clubName} Dashboard
              </h1>
              <p className="text-gray-400">
                Welcome back, {coordinatorData.name} - {coordinatorData.position}
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Events</p>
                    <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
                  </div>
                  <HiCalendar className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Upcoming Events</p>
                    <p className="text-2xl font-bold text-white">{stats.upcomingEvents}</p>
                  </div>
                  <HiClock className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Registrations</p>
                    <p className="text-2xl font-bold text-white">{stats.totalRegistrations}</p>
                  </div>
                  <HiUserGroup className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Completed Events</p>
                    <p className="text-2xl font-bold text-white">{stats.completedEvents}</p>
                  </div>
                  <HiChartBar className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </motion.div>

            {/* Events Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Manage Events</h2>
                <button
                  onClick={handleCreateEvent}
                  className="bg-gradient-to-r from-white to-gray-100 text-black px-6 py-3 rounded-lg font-medium hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg flex items-center gap-2"
                >
                  <HiPlus className="w-5 h-5" />
                  Create Event
                </button>
              </div>

              {clubEvents.length > 0 ? (
                <div className="space-y-4">
                  {clubEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{event.description}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <HiCalendar className="w-4 h-4" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <HiUserGroup className="w-4 h-4" />
                              <span>{event.registered}/{event.capacity || '∞'} registered</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => router.push(`/events/${event.id}`)}
                            className="p-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 hover:text-white transition-all duration-300"
                            title="View Event"
                          >
                            <HiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditEvent(event.id)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300"
                            title="Edit Event"
                          >
                            <HiPencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                            title="Delete Event"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Events Yet</h3>
                  <p className="text-gray-400 mb-6">Create your first event to get started</p>
                  <button
                    onClick={handleCreateEvent}
                    className="bg-gradient-to-r from-white to-gray-100 text-black px-6 py-3 rounded-lg font-medium hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg"
                  >
                    Create Your First Event
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}