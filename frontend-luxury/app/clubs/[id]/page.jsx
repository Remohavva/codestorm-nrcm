'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { HiUserGroup, HiCalendar, HiTag, HiArrowLeft, HiLocationMarker, HiClock } from 'react-icons/hi';
import { clubs, events, clubDetails, eventGallery } from '@/lib/mockData';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';

export default function ClubDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clubId = parseInt(params.id);
  
  const [activeTab, setActiveTab] = useState('overview');
  
  const club = clubs.find(c => c.id === clubId);
  const clubDetail = clubDetails[clubId];
  const clubEvents = events.filter(e => e.clubId === clubId);
  const gallery = eventGallery[clubId] || [];

  if (!club) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Club Not Found</h1>
              <button 
                onClick={() => router.push('/clubs')}
                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Back to Clubs
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'events', label: 'Events' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'members', label: 'Members' }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Navbar />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.push('/clubs')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <HiArrowLeft className="w-5 h-5" />
              Back to Clubs
            </motion.button>

            {/* Club Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-8 mb-8"
            >
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl border border-gray-600/30">
                  {club.logo}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{club.name}</h1>
                  <p className="text-gray-300 mb-4">{club.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <HiUserGroup className="w-4 h-4" />
                      <span>{club.members} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiCalendar className="w-4 h-4" />
                      <span>{club.events} events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiTag className="w-4 h-4" />
                      <span>{club.category}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-white to-gray-100 text-black px-6 py-3 rounded-lg font-medium hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg">
                  Join Club
                </button>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-1 mb-8 bg-gray-800/30 backdrop-blur-sm rounded-lg p-1 border border-gray-700/50"
            >
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* About */}
                    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">About</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {clubDetail?.history || club.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {club.tags.map(tag => (
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
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Leadership */}
                    {clubDetail && (
                      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Leadership</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-400">Coordinator</div>
                            <div className="text-white font-medium">{clubDetail.coordinator.name}</div>
                            <div className="text-sm text-gray-400">{clubDetail.coordinator.email}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">President</div>
                            <div className="text-white font-medium">{clubDetail.president.name}</div>
                            <div className="text-sm text-gray-400">{clubDetail.president.year}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upcoming Event */}
                    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Next Event</h3>
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
                        <div className="text-white font-medium mb-2">{club.upcomingEvent}</div>
                        <div className="text-sm text-gray-400">Stay tuned for details!</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clubEvents.map(event => (
                    <div
                      key={event.id}
                      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 hover:border-gray-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'open' ? 'bg-green-500/20 text-green-400' :
                          event.status === 'ongoing' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <HiCalendar className="w-4 h-4" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HiLocationMarker className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HiUserGroup className="w-4 h-4" />
                          <span>{event.registered}/{event.capacity} registered</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="w-full mt-4 bg-gray-800/50 text-white py-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        View Event
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map(photo => (
                    <div
                      key={photo.id}
                      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-500/50 transition-all duration-300"
                    >
                      <div className="aspect-video bg-gray-800/50 flex items-center justify-center">
                        <img 
                          src={photo.image} 
                          alt={photo.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center text-gray-400">
                          📷 {photo.title}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-medium mb-1">{photo.title}</h3>
                        <p className="text-gray-400 text-sm">{photo.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'members' && (
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Members Directory</h3>
                  <p className="text-gray-400 mb-6">Connect with {club.members} fellow members</p>
                  <div className="text-gray-500">
                    Member directory coming soon...
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}