'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HiCalendar, HiClock, HiLocationMarker, HiCheckCircle, HiXCircle, HiExclamationCircle } from 'react-icons/hi';
import { myRegistrations } from '@/lib/mockData';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';

export default function RegistrationsPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState(myRegistrations);

  const handleCancelRegistration = (eventId) => {
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      setRegistrations(registrations.filter(reg => reg.eventId !== eventId));
      // In a real app, you'd make an API call here
      alert('Registration cancelled successfully!');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed':
        return <HiCheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <HiClock className="w-5 h-5 text-yellow-400" />;
      case 'cancelled':
        return <HiXCircle className="w-5 h-5 text-red-400" />;
      default:
        return <HiExclamationCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
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
              <h1 className="text-4xl font-bold text-white mb-2">My Registrations</h1>
              <p className="text-gray-400">Events you've registered for</p>
            </motion.div>

            {/* Registrations List */}
            {registrations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-12 text-center"
              >
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Registrations Yet</h3>
                <p className="text-gray-400 mb-6">You haven't registered for any events yet.</p>
                <button 
                  onClick={() => router.push('/events')}
                  className="bg-gradient-to-r from-white to-gray-100 text-black px-6 py-3 rounded-lg font-medium hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg"
                >
                  Explore Events
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {registrations.map((registration, index) => {
                  const event = registration.event;
                  const isUpcoming = new Date(event.date) >= new Date();
                  
                  return (
                    <motion.div
                      key={registration.eventId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 hover:border-gray-500/50 transition-all duration-300"
                    >
                      {/* Glass effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10">
                        {/* Registration Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-gray-100 transition-colors duration-300">
                              {event.title}
                            </h3>
                            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                              {event.club}
                            </span>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(registration.status)}`}>
                            {getStatusIcon(registration.status)}
                            {getStatusText(registration.status)}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
                          {event.description}
                        </p>

                        {/* Event Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/30 group-hover:bg-gray-700/30 group-hover:border-gray-600/30 transition-all duration-300">
                          <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                            <HiCalendar className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                            <HiClock className="w-4 h-4" />
                            <span className="text-sm">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                            <HiLocationMarker className="w-4 h-4" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        </div>

                        {/* Event Meta */}
                        <div className="flex flex-wrap gap-4 mb-6 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Type:</span>
                            <span className="text-white font-medium">{event.type}</span>
                          </div>
                          {event.prize && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Prize:</span>
                              <span className="text-green-400 font-medium">{event.prize}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Registered:</span>
                            <span className="text-white font-medium">
                              {new Date(registration.registeredAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <button 
                            onClick={() => router.push(`/events/${event.id}`)}
                            className="flex-1 bg-gray-800/50 text-white py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-300 font-medium"
                          >
                            View Details
                          </button>
                          {registration.status === 'confirmed' && isUpcoming && (
                            <button 
                              onClick={() => handleCancelRegistration(registration.eventId)}
                              className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300 font-medium"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}