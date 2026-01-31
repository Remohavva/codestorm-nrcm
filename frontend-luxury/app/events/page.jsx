'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  HiCalendar, 
  HiClock, 
  HiLocationMarker, 
  HiUserGroup,
  HiTag,
  HiArrowRight,
  HiFilter
} from 'react-icons/hi';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import { events, myRegistrations } from '@/lib/mockData';

export default function EventsPage() {
  const router = useRouter();
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Get registered event IDs from mock data
  const registeredEventIds = new Set(myRegistrations.map(reg => reg.eventId));

  const filterEvents = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.club.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    setFilteredEvents(filtered);
  };

  // Update filtered events when filters change
  React.useEffect(() => {
    filterEvents();
  }, [searchTerm, statusFilter, typeFilter]);

  const handleRegister = (eventId) => {
    alert(`Registration for event ${eventId} - Feature coming soon!`);
  };

  const handleUnregister = (eventId) => {
    alert(`Unregistration for event ${eventId} - Feature coming soon!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
      case 'upcoming':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ongoing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Competition':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Workshop':
        return 'bg-blue-500/20 text-blue-400';
      case 'Performance':
        return 'bg-purple-500/20 text-purple-400';
      case 'Exhibition':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'open', label: 'Open' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'Competition', label: 'Competition' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Performance', label: 'Performance' },
    { value: 'Exhibition', label: 'Exhibition' },
  ];

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
              className="flex items-start justify-between mb-8"
            >
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">All Events</h1>
                <p className="text-gray-400">Discover and register for upcoming events</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700/50">
                <span className="text-white font-medium">{filteredEvents.length} events</span>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gray-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex gap-4">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:border-gray-500/50 focus:outline-none transition-colors"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:border-gray-500/50 focus:outline-none transition-colors"
                    >
                      {typeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredEvents.map((event, index) => {
                  const isRegistered = registeredEventIds.has(event.id);
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5"
                    >
                      {/* Glass effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10">
                        {/* Event Image */}
                        <div className="h-48 bg-gradient-to-br from-gray-700/50 to-gray-800/50 relative overflow-hidden">
                          {event.image && (
                            <img 
                              src={event.image} 
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          
                          {/* Status and Type Badges */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                              {event.status === 'ongoing' ? 'Happening Now' : event.status}
                            </span>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                              {event.type}
                            </span>
                          </div>

                          {/* Club Badge */}
                          <div className="absolute top-4 right-4">
                            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white border border-gray-600/30">
                              {event.club}
                            </div>
                          </div>

                          {/* Date and Time */}
                          <div className="absolute bottom-4 left-4 text-white">
                            <div className="flex items-center gap-2 text-sm">
                              <HiCalendar className="w-4 h-4" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm opacity-80">
                              <HiClock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-100 transition-colors duration-300">
                            {event.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-4 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
                            {event.description}
                          </p>
                          
                          <div className="space-y-2 text-sm text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
                            <div className="flex items-center">
                              <HiLocationMarker className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center">
                              <HiUserGroup className="w-4 h-4 mr-2" />
                              {event.capacity 
                                ? `${event.registered}/${event.capacity}` 
                                : `${event.registered} registered`
                              }
                            </div>
                          </div>

                          {/* Tags */}
                          {event.tags && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {event.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex} 
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-800/50 text-gray-300 border border-gray-700/50 group-hover:bg-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300"
                                >
                                  <HiTag className="w-3 h-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Prize */}
                          {event.prize && (
                            <div className="mb-4">
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                Prize: {event.prize}
                              </span>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/events/${event.id}`)}
                              className="flex-1 bg-gray-800/50 text-white py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                            >
                              View Details
                              <HiArrowRight className="w-4 h-4" />
                            </button>
                            
                            {event.status === 'open' && (
                              isRegistered ? (
                                <button
                                  onClick={() => handleUnregister(event.id)}
                                  className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300 font-medium"
                                >
                                  Unregister
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRegister(event.id)}
                                  className="px-6 py-3 bg-gradient-to-r from-white to-gray-100 text-black rounded-lg hover:from-gray-100 hover:to-white transition-all duration-300 font-medium"
                                  disabled={event.capacity && event.registered >= event.capacity}
                                >
                                  {event.capacity && event.registered >= event.capacity ? 'Full' : 'Register'}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-12 text-center"
              >
                <HiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No events are currently available'
                  }
                </p>
                {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setTypeFilter('all');
                    }}
                    className="bg-gray-800/50 text-white px-6 py-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}