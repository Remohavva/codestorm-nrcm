'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { 
  HiCalendar, 
  HiClock, 
  HiLocationMarker, 
  HiUserGroup,
  HiTag,
  HiArrowLeft,
  HiCheckCircle,
  HiExclamationCircle
} from 'react-icons/hi';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import { events, myRegistrations } from '@/lib/mockData';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = parseInt(params.id);
  
  const event = events.find(e => e.id === eventId);
  const isRegistered = myRegistrations.some(reg => reg.eventId === eventId);

  if (!event) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
              <button 
                onClick={() => router.push('/events')}
                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handleRegister = () => {
    alert(`Registration for "${event.title}" - Feature coming soon!`);
  };

  const handleUnregister = () => {
    alert(`Unregistration for "${event.title}" - Feature coming soon!`);
  };

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
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.push('/events')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <HiArrowLeft className="w-5 h-5" />
              Back to Events
            </motion.button>

            {/* Event Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden mb-8"
            >
              {/* Event Image */}
              {event.image && (
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                      {event.status === 'ongoing' ? 'Happening Now' : event.status}
                    </span>
                  </div>

                  {/* Club Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-white border border-gray-600/30">
                      {event.club}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
                    <p className="text-gray-300 text-lg">{event.description}</p>
                  </div>
                  
                  {event.status === 'open' && (
                    <div className="ml-6">
                      {isRegistered ? (
                        <button 
                          onClick={handleUnregister}
                          className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300 font-medium flex items-center gap-2"
                        >
                          <HiCheckCircle className="w-5 h-5" />
                          Registered - Click to Cancel
                        </button>
                      ) : (
                        <button 
                          onClick={handleRegister}
                          className="px-6 py-3 bg-gradient-to-r from-white to-gray-100 text-black rounded-lg hover:from-gray-100 hover:to-white transition-all duration-300 font-medium shadow-lg"
                          disabled={event.capacity && event.registered >= event.capacity}
                        >
                          {event.capacity && event.registered >= event.capacity ? 'Event Full' : 'Register Now'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <HiCalendar className="w-5 h-5" />
                      <span className="text-sm font-medium">Date</span>
                    </div>
                    <p className="text-white font-semibold">{new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>

                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <HiClock className="w-5 h-5" />
                      <span className="text-sm font-medium">Time</span>
                    </div>
                    <p className="text-white font-semibold">{event.time}</p>
                  </div>

                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <HiLocationMarker className="w-5 h-5" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-white font-semibold">{event.location}</p>
                  </div>

                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <HiUserGroup className="w-5 h-5" />
                      <span className="text-sm font-medium">Participants</span>
                    </div>
                    <p className="text-white font-semibold">
                      {event.capacity ? `${event.registered}/${event.capacity}` : `${event.registered} registered`}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {event.tags && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map(tag => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-gray-300"
                        >
                          <HiTag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prize */}
                {event.prize && (
                  <div className="mb-6">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-green-400 mb-2">Prize Pool</h3>
                      <p className="text-green-300 text-xl font-bold">{event.prize}</p>
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {event.requirements && event.requirements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Requirements</h3>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
                      <ul className="space-y-2">
                        {event.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-300">
                            <HiExclamationCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Registration Status */}
                {isRegistered && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-400">
                      <HiCheckCircle className="w-5 h-5" />
                      <span className="font-medium">You are registered for this event</span>
                    </div>
                    <p className="text-green-300 text-sm mt-1">
                      You'll receive updates and reminders about this event.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}